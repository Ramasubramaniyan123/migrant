package com.migrantcommunity.unit;

import com.migrantcommunity.auth.dto.RegisterRequest;
import com.migrantcommunity.auth.service.AuthService;
import com.migrantcommunity.auth.mapper.AuthMapper;
import com.migrantcommunity.common.email.EmailService;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.profile.repository.ProfileRepository;
import com.migrantcommunity.security.*;
import com.migrantcommunity.security.jwt.JwtService;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock RefreshTokenRepository refreshTokenRepository;
    @Mock UserSessionRepository userSessionRepository;
    @Mock EmailVerificationTokenRepository verificationTokenRepository;
    @Mock PasswordResetTokenRepository resetTokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthMapper authMapper;
    @Mock EmailService emailService;
    @Mock ProfileRepository profileRepository;

    @InjectMocks AuthService service;

    @Test
    void registerRejectsMismatchedPasswords() {
        RegisterRequest req = new RegisterRequest("a@b.com", "password123", "different1");
        assertThrows(BadRequestException.class, () -> service.register(req));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmail("a@b.com")).thenReturn(true);
        RegisterRequest req = new RegisterRequest("a@b.com", "password123", "password123");
        assertThrows(BadRequestException.class, () -> service.register(req));
    }

    @Test
    void loginRejectsUnknownUser() {
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.empty());
        assertThrows(BadRequestException.class, () -> service.login("x@y.com", "password123"));
    }

    @Test
    void loginRejectsWrongPassword() {
        User u = new User();
        u.setId(1L); u.setEmail("x@y.com"); u.setActive(true);
        u.setPasswordHash("hash");
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);
        assertThrows(BadRequestException.class, () -> service.login("x@y.com", "bad"));
    }

    @Test
    void loginRejectsSuspendedAccount() {
        User u = new User();
        u.setId(1L); u.setEmail("x@y.com"); u.setActive(false);
        u.setPasswordHash("hash");
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(u));
        assertThrows(BadRequestException.class, () -> service.login("x@y.com", "password123"));
    }
}
