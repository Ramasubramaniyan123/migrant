package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.dto.AdminLoginRequest;
import com.migrantcommunity.admin.dto.AdminLoginResponse;
import com.migrantcommunity.admin.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/admin/auth")
public class AdminAuthController {

    private final AdminAuthService service;

    public AdminAuthController(AdminAuthService service) { this.service = service; }

    @PostMapping("/login")
    public AdminLoginResponse login(@Valid @RequestBody AdminLoginRequest req) {
        return service.login(req);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null) service.logout(auth.replace("Bearer ", ""));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgot(@RequestBody Map<String, String> body) {
        service.requestPasswordReset(body.get("email"));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> reset(@RequestBody Map<String, String> body) {
        service.resetPassword(body.get("token"), body.get("newPassword"));
        return ResponseEntity.noContent().build();
    }
}
