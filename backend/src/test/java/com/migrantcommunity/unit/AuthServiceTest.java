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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String VALID_PASSWORD = "Password1!";

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
    @Mock LoginAttemptService loginAttemptService;
    @Mock OtpService otpService;
    @Mock PasswordResetAttemptService resetAttemptService;

    @InjectMocks AuthService service;

    @Test
    void registerRejectsMismatchedPasswords() {
        RegisterRequest req = new RegisterRequest("a@b.com", VALID_PASSWORD, "Different1!");
        assertThrows(BadRequestException.class, () -> service.register(req));
    }

    @Test
    void registerRejectsWeakPassword() {
        RegisterRequest req = new RegisterRequest("a@b.com", "password123", "password123");
        assertThrows(BadRequestException.class, () -> service.register(req));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmail("a@b.com")).thenReturn(true);
        RegisterRequest req = new RegisterRequest("a@b.com", VALID_PASSWORD, VALID_PASSWORD);
        assertThrows(BadRequestException.class, () -> service.register(req));
    }

    @Test
    void loginRejectsUnknownUser() {
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.empty());
        when(loginAttemptService.isLocked(anyString())).thenReturn(false);
        assertThrows(BadRequestException.class, () -> service.login("x@y.com", "password123"));
    }

    @Test
    void loginRejectsWrongPassword() {
        User u = new User();
        u.setId(1L); u.setEmail("x@y.com"); u.setActive(true); u.setVerified(true);
        u.setPasswordHash("hash");
        u.setAccountStatus(com.migrantcommunity.common.enums.UserStatus.ACTIVE);
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);
        when(loginAttemptService.isLocked(anyString())).thenReturn(false);
        assertThrows(BadRequestException.class, () -> service.login("x@y.com", "bad"));
    }

    @Test
    void loginRejectsSuspendedAccount() {
        User u = new User();
        u.setId(1L); u.setEmail("x@y.com"); u.setActive(false);
        u.setPasswordHash("hash");
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(u));
        when(loginAttemptService.isLocked(anyString())).thenReturn(false);
        assertThrows(BadRequestException.class, () -> service.login("x@y.com", "password123"));
    }

    // ---- Password reset / OTP ----

    private User resetUser() {
        User u = new User();
        u.setId(7L);
        u.setEmail("user@example.com");
        u.setActive(true);
        return u;
    }

    @Test
    void forgotPasswordIsSilentOnCooldownAndDoesNotRevealAccount() {
        when(emailService.isEnabled()).thenReturn(true);
        User u = resetUser();
        PasswordResetToken recent = new PasswordResetToken();
        recent.setUser(u);
        recent.setToken("hash");
        recent.setExpiresAt(Instant.now().plus(2, ChronoUnit.MINUTES));
        recent.setCreatedAt(Instant.now()); // just created -> inside 60s cooldown

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(u));
        when(resetTokenRepository.findLatestByUserId(7L)).thenReturn(Optional.of(recent));

        // Must not throw — throwing would leak that the email is registered.
        assertDoesNotThrow(() -> service.forgotPassword("user@example.com"));
        verify(resetTokenRepository, never()).save(any());
        verify(emailService, never()).send(anyString(), anyString(), anyString());
    }

    @Test
    void forgotPasswordUnknownEmailStillSucceeds() {
        when(emailService.isEnabled()).thenReturn(true);
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());
        assertDoesNotThrow(() -> service.forgotPassword("ghost@example.com"));
        verify(emailService, never()).send(anyString(), anyString(), anyString());
    }

    @Test
    void forgotPasswordStoresHashedOtpNotPlaintext() {
        when(emailService.isEnabled()).thenReturn(true);
        when(emailService.send(anyString(), anyString(), anyString())).thenReturn(true);
        User u = resetUser();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(u));
        when(resetTokenRepository.findLatestByUserId(7L)).thenReturn(Optional.empty());
        when(otpService.hash(anyString())).thenAnswer(inv -> "H:" + inv.getArgument(0));
        when(resetTokenRepository.existsByToken(anyString())).thenReturn(false);

        service.forgotPassword("user@example.com");

        var captor = org.mockito.ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(resetTokenRepository).save(captor.capture());
        String stored = captor.getValue().getToken();
        assertTrue(stored.startsWith("H:"), "OTP must be stored hashed, got: " + stored);
        assertFalse(stored.matches("\\d{6}"), "plaintext OTP must never be persisted");
        // Email must contain the plaintext OTP, not the hash.
        verify(emailService).send(eq("user@example.com"), anyString(),
                argThat(body -> body != null && body.matches("(?s).*\\d{6}.*")));
    }

    @Test
    void resetPasswordRejectsMalformedOtp() {
        assertThrows(BadRequestException.class,
                () -> service.resetPassword("abc", VALID_PASSWORD, "1.2.3.4"));
        verify(resetTokenRepository, never()).findByToken(anyString());
    }

    @Test
    void resetPasswordRejectsWeakPassword() {
        assertThrows(BadRequestException.class,
                () -> service.resetPassword("123456", "weak", "1.2.3.4"));
    }

    @Test
    void resetPasswordRejectsUnknownOrExpiredToken() {
        when(otpService.hash("123456")).thenReturn("h");
        when(resetTokenRepository.findByToken("h")).thenReturn(Optional.empty());
        assertThrows(BadRequestException.class,
                () -> service.resetPassword("123456", VALID_PASSWORD, "1.2.3.4"));
    }

    @Test
    void resetPasswordSuccessRevokesSessions() {
        User u = resetUser();
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(u);
        token.setToken("stored-hash");
        token.setExpiresAt(Instant.now().plus(2, ChronoUnit.MINUTES));

        RefreshToken rt = new RefreshToken();
        rt.setUser(u);
        UserSession session = new UserSession();
        session.setUser(u);

        when(otpService.hash("123456")).thenReturn("stored-hash");
        when(otpService.matches("123456", "stored-hash")).thenReturn(true);
        when(resetTokenRepository.findByToken("stored-hash")).thenReturn(Optional.of(token));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(refreshTokenRepository.findByUser(u)).thenReturn(java.util.List.of(rt));
        when(userSessionRepository.findByUserAndRevokedFalse(u)).thenReturn(java.util.List.of(session));

        service.resetPassword("123456", VALID_PASSWORD, "1.2.3.4");

        assertTrue(token.getUsedAt() != null);
        assertTrue(rt.isRevoked());
        assertTrue(session.isRevoked());
        verify(resetAttemptService).reset("1.2.3.4");
    }

    @Test
    void resetPasswordEnforcesAttemptLimit() {
        doThrow(new com.migrantcommunity.common.exception.TooManyRequestsException("slow down"))
                .when(resetAttemptService).checkAllowed("9.9.9.9");
        assertThrows(com.migrantcommunity.common.exception.TooManyRequestsException.class,
                () -> service.resetPassword("123456", VALID_PASSWORD, "9.9.9.9"));
        verify(resetTokenRepository, never()).findByToken(anyString());
    }
}
