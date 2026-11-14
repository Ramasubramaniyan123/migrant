package com.migrantcommunity.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginAttemptServiceTest {

    private LoginAttemptService loginAttemptService;

    @BeforeEach
    void setUp() {
        loginAttemptService = new LoginAttemptService();
    }

    @Test
    void testLoginSuccessResetsAttempts() {
        String email = "test@example.com";
        
        loginAttemptService.loginFailed(email);
        loginAttemptService.loginFailed(email);
        loginAttemptService.loginFailed(email);
        loginAttemptService.loginFailed(email);
        loginAttemptService.loginFailed(email);
        
        assertTrue(loginAttemptService.isLocked(email));
        
        loginAttemptService.loginSucceeded(email);
        
        assertFalse(loginAttemptService.isLocked(email));
    }

    @Test
    void testLoginFailedIncrementsAttempts() {
        String email = "test@example.com";
        
        loginAttemptService.loginFailed(email);
        loginAttemptService.loginFailed(email);
        loginAttemptService.loginFailed(email);
        
        assertFalse(loginAttemptService.isLocked(email));
    }

    @Test
    void testLockAfterMaxAttempts() {
        String email = "test@example.com";
        
        for (int i = 0; i < 5; i++) {
            loginAttemptService.loginFailed(email);
        }
        
        assertTrue(loginAttemptService.isLocked(email));
    }

    @Test
    void testDifferentUsersHaveSeparateCounters() {
        String email1 = "user1@example.com";
        String email2 = "user2@example.com";
        
        for (int i = 0; i < 5; i++) {
            loginAttemptService.loginFailed(email1);
        }
        
        assertTrue(loginAttemptService.isLocked(email1));
        assertFalse(loginAttemptService.isLocked(email2));
    }

    @Test
    void testRemainingLockTime() {
        String email = "test@example.com";
        
        for (int i = 0; i < 5; i++) {
            loginAttemptService.loginFailed(email);
        }
        
        long remaining = loginAttemptService.getRemainingLockTime(email);
        assertTrue(remaining > 0);
        assertTrue(remaining <= 30 * 60 * 1000); // 30 minutes max
    }
}
