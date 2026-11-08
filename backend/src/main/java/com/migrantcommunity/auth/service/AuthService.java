package com.migrantcommunity.auth.service;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.dto.RegisterRequest;
import com.migrantcommunity.auth.dto.UserSummary;
import com.migrantcommunity.auth.mapper.AuthMapper;
import com.migrantcommunity.common.email.EmailService;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.security.EmailVerificationToken;
import com.migrantcommunity.security.EmailVerificationTokenRepository;
import com.migrantcommunity.security.PasswordResetToken;
import com.migrantcommunity.security.PasswordResetTokenRepository;
import com.migrantcommunity.security.RefreshToken;
import com.migrantcommunity.security.RefreshTokenRepository;
import com.migrantcommunity.security.UserSession;
import com.migrantcommunity.security.UserSessionRepository;
import com.migrantcommunity.security.jwt.JwtService;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long VERIFICATION_TOKEN_TTL_HOURS = 24;
    private static final long RESET_TOKEN_TTL_MINUTES = 30;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserSessionRepository userSessionRepository;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final EmailService emailService;
    private final String appBaseUrl;

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository,
                       UserSessionRepository userSessionRepository,
                       EmailVerificationTokenRepository verificationTokenRepository,
                       PasswordResetTokenRepository resetTokenRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, AuthMapper authMapper,
                       EmailService emailService,
                       @Value("${app.base-url:http://localhost:5173}") String appBaseUrl) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userSessionRepository = userSessionRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authMapper = authMapper;
        this.emailService = emailService;
        this.appBaseUrl = appBaseUrl;
    }

    public AuthResponse register(RegisterRequest req) {
        if (!req.password().equals(req.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("Email already registered");
        }
        User user = new User();
        user.setEmail(req.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(com.migrantcommunity.common.enums.UserRole.USER);
        user.setActive(true);
        user.setVerified(false);
        user = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(user);
        user.setProfile(profile);
        userRepository.save(user);

        sendVerificationEmail(user);

        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = issueRefreshToken(user, null, null);
        return authMapper.toResponse(user, accessToken, refreshToken);
    }

    public AuthResponse login(String email, String password) {
        return login(email, password, null, null);
    }

    public AuthResponse login(String email, String password, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        if (!user.isActive()) {
            throw new BadRequestException("Account is suspended");
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials");
        }
        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = issueRefreshToken(user, ipAddress, userAgent);
        return authMapper.toResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refresh(String refreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
        if (stored.isRevoked() || stored.isExpired()) {
            throw new BadRequestException("Refresh token is expired or revoked");
        }
        User user = stored.getUser();
        if (!user.isActive()) {
            throw new BadRequestException("Account is suspended");
        }
        // Rotation: revoke the presented token before issuing a new pair.
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);
        String accessToken = jwtService.issueAccessToken(user);
        String newRefreshToken = issueRefreshToken(user, null, null);
        return authMapper.toResponse(user, accessToken, newRefreshToken);
    }

    public void logout(User user) {
        refreshTokenRepository.findByUser(user).forEach(rt -> rt.setRevoked(true));
        userSessionRepository.findByUserAndRevokedFalse(user)
                .forEach(session -> session.setRevoked(true));
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email.toLowerCase().trim()).ifPresent(user -> {
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setToken(generateToken());
            token.setExpiresAt(Instant.now().plus(RESET_TOKEN_TTL_MINUTES, ChronoUnit.MINUTES));
            resetTokenRepository.save(token);

            String link = appBaseUrl + "/reset-password?token=" + token.getToken();
            emailService.send(user.getEmail(), "Reset your Migrant Community password",
                    "Hello,\n\nUse the following link to reset your password. It expires in "
                            + RESET_TOKEN_TTL_MINUTES + " minutes.\n\n" + link
                            + "\n\nIf you did not request this, ignore this email.");
        });
        // Always return success to avoid account enumeration.
    }

    public void resetPassword(String tokenValue, String newPassword) {
        PasswordResetToken token = resetTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        if (!token.isUsable()) {
            throw new BadRequestException("Invalid or expired reset token");
        }
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsedAt(Instant.now());
        resetTokenRepository.save(token);

        // Invalidate all outstanding sessions after a credential change.
        refreshTokenRepository.findByUser(user).forEach(rt -> rt.setRevoked(true));
        userSessionRepository.findByUserAndRevokedFalse(user)
                .forEach(session -> session.setRevoked(true));
    }

    @Transactional(readOnly = true)
    public void verifyEmail(String tokenValue) {
        EmailVerificationToken token = verificationTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("Verification token not found"));
        if (!token.isUsable()) {
            throw new BadRequestException("Verification link is invalid or has expired");
        }
        User user = token.getUser();
        user.setVerified(true);
        userRepository.save(user);
        token.setUsedAt(Instant.now());
        verificationTokenRepository.save(token);
    }

    public void resendVerification(String email) {
        userRepository.findByEmail(email.toLowerCase().trim())
                .filter(u -> !u.isVerified())
                .ifPresent(this::sendVerificationEmail);
    }

    private void sendVerificationEmail(User user) {
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(generateToken());
        token.setExpiresAt(Instant.now().plus(VERIFICATION_TOKEN_TTL_HOURS, ChronoUnit.HOURS));
        verificationTokenRepository.save(token);

        String link = appBaseUrl + "/verify-email?token=" + token.getToken();
        emailService.send(user.getEmail(), "Verify your Migrant Community account",
                "Hello,\n\nConfirm your email address to activate your account:\n\n" + link
                        + "\n\nThis link expires in " + VERIFICATION_TOKEN_TTL_HOURS + " hours.");
    }

    private String issueRefreshToken(User user, String ipAddress, String userAgent) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(UUID.randomUUID().toString().replace("-", "")
                + UUID.randomUUID().toString().replace("-", ""));
        rt.setExpiryDate(Instant.now().plusSeconds(7L * 24 * 60 * 60));
        rt.setRevoked(false);
        RefreshToken saved = refreshTokenRepository.save(rt);

        UserSession session = new UserSession();
        session.setUser(user);
        session.setRefreshToken(saved);
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        session.setExpiresAt(saved.getExpiryDate());
        userSessionRepository.save(session);
        return saved.getToken();
    }

    private static String generateToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public UserSummary getCurrentUser(User user) {
        return authMapper.toSummary(user);
    }
}
