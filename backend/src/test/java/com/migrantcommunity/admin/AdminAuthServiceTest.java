package com.migrantcommunity.admin;

import com.migrantcommunity.admin.dto.AdminLoginResponse;
import com.migrantcommunity.admin.service.AdminAuthService;
import com.migrantcommunity.common.enums.AdminRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {
        "admin.bootstrap.email=superadmin@migrantcommunity.com",
        "admin.bootstrap.password=test-admin-password-123",
        "jwt.secret=test-jwt-signing-secret-that-is-long-enough-123456"
})
class AdminAuthServiceTest {

    @Autowired
    private AdminAuthService service;

    @Test
    void loginSuccess() {
        AdminLoginResponse res = service.login(new com.migrantcommunity.admin.dto.AdminLoginRequest("superadmin@migrantcommunity.com", "test-admin-password-123"));
        assertNotNull(res);
        assertEquals(AdminRole.SUPER_ADMIN, res.admin().role());
        assertEquals(3, res.token().split("\\.").length);
    }

    @Test
    void loginWrongPassword() {
        assertThrows(BadCredentialsException.class, () -> service.login(new com.migrantcommunity.admin.dto.AdminLoginRequest("superadmin@migrantcommunity.com", "wrong")));
    }

    @Test
    void loginUnknownEmail() {
        assertThrows(BadCredentialsException.class, () -> service.login(new com.migrantcommunity.admin.dto.AdminLoginRequest("nobody@example.com", "test-admin-password-123")));
    }

    @Test
    void createAdminDuplicateEmail() {
        assertThrows(IllegalArgumentException.class, () -> service.createAdmin("Dup", "superadmin@migrantcommunity.com", AdminRole.ADMIN));
    }
}
