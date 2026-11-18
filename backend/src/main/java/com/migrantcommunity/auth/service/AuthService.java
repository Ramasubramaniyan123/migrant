package com.migrantcommunity.auth.service;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.dto.RegisterRequest;
import com.migrantcommunity.auth.dto.UserSummary;
import com.migrantcommunity.auth.mapper.AuthMapper;
import com.migrantcommunity.common.email.EmailService;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.exception.ServiceUnavailableException;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.profile.repository.ProfileRepository;
import com.migrantcommunity.security.EmailVerificationToken;
import com.migrantcommunity.security.EmailVerificationTokenRepository;
import com.migrantcommunity.security.LoginAttemptService;
import com.migrantcommunity.security.OtpService;
import com.migrantcommunity.security.PasswordResetAttemptService;
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

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

import org.json.JSONObject;

@Service
@Transactional
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final HttpClient GOOGLE_HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    private static final long VERIFICATION_TOKEN_TTL_HOURS = 24;
    private static final long RESET_OTP_TTL_MINUTES = 2;
    private static final long RESET_OTP_COOLDOWN_SECONDS = 60;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserSessionRepository userSessionRepository;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final EmailService emailService;
    private final ProfileRepository profileRepository;
    private final LoginAttemptService loginAttemptService;
    private final OtpService otpService;
    private final PasswordResetAttemptService resetAttemptService;
    private final String appBaseUrl;
    private final String googleClientId;

    // Password validation pattern: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,128}$"
    );

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository,
                       UserSessionRepository userSessionRepository,
                       EmailVerificationTokenRepository verificationTokenRepository,
                       PasswordResetTokenRepository resetTokenRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, AuthMapper authMapper,
                       EmailService emailService, ProfileRepository profileRepository,
                       LoginAttemptService loginAttemptService,
                       OtpService otpService,
                       PasswordResetAttemptService resetAttemptService,
                       @Value("${app.base-url:http://localhost:5173}") String appBaseUrl,
                       @Value("${google.client-id:}") String googleClientId) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userSessionRepository = userSessionRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.googleClientId = googleClientId;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authMapper = authMapper;
        this.emailService = emailService;
        this.profileRepository = profileRepository;
        this.loginAttemptService = loginAttemptService;
        this.otpService = otpService;
        this.resetAttemptService = resetAttemptService;
        this.appBaseUrl = appBaseUrl;
    }

    public AuthResponse register(RegisterRequest req) {
        if (!req.password().equals(req.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        
        // Validate password strength
        if (!PASSWORD_PATTERN.matcher(req.password()).matches()) {
            throw new BadRequestException(
                "Password must be 8-128 characters with at least one uppercase, one lowercase, one digit, and one special character (@#$%^&+=!)"
            );
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
        user.setAccountStatus(com.migrantcommunity.common.enums.UserStatus.PENDING_VERIFICATION);

        // Create profile and set bidirectional relationship before saving
        Profile profile = new Profile();
        profile.setUser(user);
        user.setProfile(profile);
        
        // Save user with cascade which will also persist the profile
        user = userRepository.save(user);

        sendVerificationEmail(user);
        // Tokens are issued only after email verification so unverified
        // accounts cannot call authenticated APIs.
        return authMapper.toResponse(user, null, null);
    }

    public AuthResponse login(String email, String password) {
        return login(email, password, null, null);
    }

    public AuthResponse login(String email, String password, String ipAddress, String userAgent) {
        String key = email.toLowerCase().trim();
        
        if (loginAttemptService.isLocked(key)) {
            long remainingMinutes = TimeUnit.MILLISECONDS.toMinutes(loginAttemptService.getRemainingLockTime(key));
            throw new BadRequestException("Account locked due to too many failed attempts. Try again in " + 
                (remainingMinutes + 1) + " minutes.");
        }
        
        User user = userRepository.findByEmail(key)
                .orElseThrow(() -> {
                    loginAttemptService.loginFailed(key);
                    throw new BadRequestException("Invalid credentials");
                });
                
        if (!user.isVerified()
                || user.getAccountStatus() == com.migrantcommunity.common.enums.UserStatus.PENDING_VERIFICATION) {
            throw new BadRequestException("Please verify your email before signing in");
        }
        if (!user.isActive()
                || user.getAccountStatus() != com.migrantcommunity.common.enums.UserStatus.ACTIVE) {
            throw new BadRequestException("Account is suspended");
        }
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            loginAttemptService.loginFailed(key);
            throw new BadRequestException("Invalid credentials");
        }
        
        loginAttemptService.loginSucceeded(key);
        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = issueRefreshToken(user, ipAddress, userAgent);
        return authMapper.toResponse(user, accessToken, refreshToken);
    }

    public AuthResponse authenticateWithGoogle(String idToken, String ipAddress, String userAgent) {
        JSONObject identity = validateGoogleIdToken(idToken);
        String email = identity.getString("email");
        String name = identity.optString("name", "");
        String picture = identity.optString("picture", "");

        String key = email.toLowerCase(Locale.ROOT).trim();
        User user = userRepository.findByEmail(key).orElse(null);

        if (user == null) {
            // Create new user from Google OAuth
            user = new User();
            user.setEmail(key);
            user.setPasswordHash(passwordEncoder.encode(generateRandomPassword()));
            user.setRole(com.migrantcommunity.common.enums.UserRole.USER);
            user.setAccountStatus(com.migrantcommunity.common.enums.UserStatus.ACTIVE);
            user.setActive(true);
            user.setVerified(true);

            // Parse name into first and last name for profile
            String[] nameParts = name != null && !name.isBlank() ? name.split(" ", 2) : new String[]{};
            String firstName = nameParts.length > 0 ? nameParts[0] : "";
            String lastName = nameParts.length > 1 ? nameParts[1] : "";

            // Create profile and set bidirectional relationship
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setFirstName(firstName);
            profile.setLastName(lastName);
            if (picture != null && !picture.isBlank()) {
                profile.setProfilePictureUrl(picture);
            }
            user.setProfile(profile);

            // Save user with cascade which will also persist the profile
            user = userRepository.save(user);
        } else {
            if (!user.isActive()
                    || user.getAccountStatus() == com.migrantcommunity.common.enums.UserStatus.SUSPENDED
                    || user.getAccountStatus() == com.migrantcommunity.common.enums.UserStatus.DEACTIVATED) {
                throw new ForbiddenException("Account is suspended");
            }
            if (!user.isVerified()
                    || user.getAccountStatus() == com.migrantcommunity.common.enums.UserStatus.PENDING_VERIFICATION) {
                user.setVerified(true);
                user.setAccountStatus(com.migrantcommunity.common.enums.UserStatus.ACTIVE);
                user.setUpdatedAt(Instant.now());
                userRepository.save(user);
            }

            // Update profile picture if not set
            Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null && (profile.getProfilePictureUrl() == null || profile.getProfilePictureUrl().isBlank())) {
                profile.setProfilePictureUrl(picture);
                profileRepository.save(profile);
            }
        }

        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = issueRefreshToken(user, ipAddress, userAgent);
        return authMapper.toResponse(user, accessToken, refreshToken);
    }

    private String generateRandomPassword() {
        byte[] bytes = new byte[24];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public AuthResponse refresh(String refreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
        if (stored.isRevoked()) {
            // Reuse of a rotated token indicates theft: revoke the whole family.
            refreshTokenRepository.revokeAllByUser(stored.getUser());
            userSessionRepository.findByUserAndRevokedFalse(stored.getUser())
                    .forEach(session -> session.setRevoked(true));
            throw new BadRequestException("Refresh token is expired or revoked");
        }
        if (stored.isExpired()) {
            throw new BadRequestException("Refresh token is expired or revoked");
        }
        User user = stored.getUser();
        if (!user.isActive()
                || user.getAccountStatus() != com.migrantcommunity.common.enums.UserStatus.ACTIVE) {
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
        if (!emailService.isEnabled()) {
            throw new ServiceUnavailableException("Email delivery is temporarily unavailable");
        }
        userRepository.findByEmail(email.toLowerCase().trim()).ifPresent(user -> {
            // Cooldown: silently skip resend if a usable OTP was issued within
            // the last 60 seconds. Must not throw — an error here would reveal
            // that the email is registered (account enumeration).
            boolean onCooldown = resetTokenRepository.findLatestByUserId(user.getId())
                    .map(existing -> existing.isUsable()
                            && Instant.now().getEpochSecond() - existing.getCreatedAt().getEpochSecond()
                                    < RESET_OTP_COOLDOWN_SECONDS)
                    .orElse(false);
            if (onCooldown) {
                return;
            }

            // Invalidate all previous tokens for this user
            resetTokenRepository.deleteByUserId(user.getId());

            IssuedOtp issued = issueUniqueOtp();
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setToken(issued.hash());
            token.setExpiresAt(Instant.now().plus(RESET_OTP_TTL_MINUTES, ChronoUnit.MINUTES));
            resetTokenRepository.save(token);

            // The plaintext OTP only ever exists in the outgoing email.
            boolean delivered = emailService.send(user.getEmail(), "Your password reset code",
                    "Hello,\n\nYour password reset code is:\n\n    " + issued.otp()
                            + "\n\nThis code expires in " + RESET_OTP_TTL_MINUTES + " minutes."
                            + "\n\nIf you did not request this, ignore this email.");
            if (!delivered) {
                throw new ServiceUnavailableException("Email delivery is temporarily unavailable");
            }
        });
        // Always return success to avoid account enumeration.
    }

    private record IssuedOtp(String otp, String hash) {
    }

    /** Generates an OTP whose keyed hash is unique across all pending tokens. */
    private IssuedOtp issueUniqueOtp() {
        for (int attempt = 0; attempt < 20; attempt++) {
            String otp = generateOtp();
            String hash = otpService.hash(otp);
            if (!resetTokenRepository.existsByToken(hash)) {
                return new IssuedOtp(otp, hash);
            }
        }
        throw new IllegalStateException("Unable to issue a unique password reset code");
    }

    public void resetPassword(String tokenValue, String newPassword) {
        resetPassword(tokenValue, newPassword, null);
    }

    public void resetPassword(String tokenValue, String newPassword, String clientIp) {
        resetAttemptService.checkAllowed(clientIp);
        if (tokenValue == null || !tokenValue.matches("\\d{6}")) {
            throw new BadRequestException("Invalid or expired reset token");
        }
        if (!PASSWORD_PATTERN.matcher(newPassword).matches()) {
            throw new BadRequestException(
                "Password must be 8-128 characters with at least one uppercase, one lowercase, one digit, and one special character (@#$%^&+=!)"
            );
        }
        PasswordResetToken token = resetTokenRepository.findByToken(otpService.hash(tokenValue))
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        if (!token.isUsable() || !otpService.matches(tokenValue, token.getToken())) {
            throw new BadRequestException("Invalid or expired reset token");
        }
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsedAt(Instant.now());
        resetTokenRepository.save(token);
        resetAttemptService.reset(clientIp);

        // Invalidate all outstanding sessions after a credential change.
        refreshTokenRepository.findByUser(user).forEach(rt -> rt.setRevoked(true));
        userSessionRepository.findByUserAndRevokedFalse(user)
                .forEach(session -> session.setRevoked(true));
    }

    @Transactional
    public void verifyEmail(String tokenValue) {
        EmailVerificationToken token = verificationTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new ResourceNotFoundException("Verification token not found"));
        if (!token.isUsable()) {
            throw new BadRequestException("Verification link is invalid or has expired");
        }
        User user = token.getUser();
        user.setVerified(true);
        user.setAccountStatus(com.migrantcommunity.common.enums.UserStatus.ACTIVE);
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
        boolean delivered = emailService.send(user.getEmail(), "Verify your Migrant Community account",
                "Hello,\n\nConfirm your email address to activate your account:\n\n" + link
                        + "\n\nThis link expires in " + VERIFICATION_TOKEN_TTL_HOURS + " hours.");
        if (!delivered && emailService.isEnabled()) {
            throw new ServiceUnavailableException("Email delivery is temporarily unavailable");
        }
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

    private static String generateOtp() {
        // 6-digit numeric OTP: 100000–999999
        int otp = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }

    public UserSummary getCurrentUser(User user) {
        return authMapper.toSummary(user);
    }

    private JSONObject validateGoogleIdToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            throw new BadRequestException("Google ID token is missing");
        }
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new IllegalStateException("Google OAuth client ID is not configured");
        }

        String verificationUrl = "https://oauth2.googleapis.com/tokeninfo?id_token="
                + URLEncoder.encode(idToken, StandardCharsets.UTF_8);
        HttpRequest request = HttpRequest.newBuilder(URI.create(verificationUrl))
                .timeout(Duration.ofSeconds(5))
                .GET()
                .build();
        try {
            HttpResponse<String> response = GOOGLE_HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new BadRequestException("Google ID token is invalid or expired");
            }

            JSONObject claims = new JSONObject(response.body());
            String issuer = claims.optString("iss");
            long exp = claims.optLong("exp", 0L);
            boolean expired = exp > 0 && Instant.ofEpochSecond(exp).isBefore(Instant.now());
            if (!googleClientId.equals(claims.optString("aud"))
                    || (!issuer.equals("accounts.google.com") && !issuer.equals("https://accounts.google.com"))
                    || !isGoogleEmailVerified(claims)
                    || claims.optString("email").isBlank()
                    || claims.optString("sub").isBlank()
                    || expired) {
                throw new BadRequestException("Google ID token claims are invalid");
            }
            return claims;
        } catch (IOException e) {
            throw new IllegalStateException("Unable to verify Google ID token", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Google ID token verification was interrupted", e);
        }
    }

    static boolean isGoogleEmailVerified(JSONObject claims) {
        Object value = claims.opt("email_verified");
        if (value instanceof Boolean bool) {
            return bool;
        }
        return "true".equalsIgnoreCase(String.valueOf(value));
    }
}
