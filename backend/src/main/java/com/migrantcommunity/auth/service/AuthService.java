package com.migrantcommunity.auth.service;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.dto.RegisterRequest;
import com.migrantcommunity.auth.dto.UserSummary;
import com.migrantcommunity.auth.mapper.AuthMapper;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.security.jwt.JwtService;
import com.migrantcommunity.security.RefreshToken;
import com.migrantcommunity.security.RefreshTokenRepository;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, AuthMapper authMapper) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authMapper = authMapper;
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
        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = issueRefreshToken(user);
        return authMapper.toResponse(user, accessToken, refreshToken);
    }

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        if (!user.isActive()) {
            throw new BadRequestException("Account is suspended");
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials");
        }
        String accessToken = jwtService.issueAccessToken(user);
        String refreshToken = issueRefreshToken(user);
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
        refreshTokenRepository.delete(stored);
        String accessToken = jwtService.issueAccessToken(user);
        String newRefreshToken = issueRefreshToken(user);
        return authMapper.toResponse(user, accessToken, newRefreshToken);
    }

    public void logout(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email.toLowerCase().trim());
    }

    public void resetPassword(String token, String newPassword) {
        throw new UnsupportedOperationException("Email-delivered password reset is not wired to a mail provider");
    }

    private String issueRefreshToken(User user) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(UUID.randomUUID().toString());
        rt.setExpiryDate(Instant.now().plusSeconds(7L * 24 * 60 * 60));
        rt.setRevoked(false);
        return refreshTokenRepository.save(rt).getToken();
    }

    public UserSummary getCurrentUser(User user) {
        return authMapper.toSummary(user);
    }
}
