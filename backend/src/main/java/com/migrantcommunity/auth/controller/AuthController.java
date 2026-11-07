package com.migrantcommunity.auth.controller;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.dto.LoginRequest;
import com.migrantcommunity.auth.dto.RegisterRequest;
import com.migrantcommunity.auth.dto.RefreshRequest;
import com.migrantcommunity.auth.dto.ResetPasswordRequest;
import com.migrantcommunity.auth.dto.ForgotPasswordRequest;
import com.migrantcommunity.auth.dto.UserSummary;
import com.migrantcommunity.auth.service.AuthService;
import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.security.CustomUserDetails;
import com.migrantcommunity.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.register(req), "Registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(req.email(), req.password()), "Logged in"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal != null) authService.logout(principal.getUser());
        return ResponseEntity.ok(ApiResponse.ok(null, "Logged out"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.refresh(req.refreshToken()), "Token refreshed"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.email());
        return ResponseEntity.ok(ApiResponse.ok(null, "If the account exists, a reset link was sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.token(), req.newPassword());
        return ResponseEntity.ok(ApiResponse.ok(null, "Password reset"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSummary>> me(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.ok(null, "Not authenticated"));
        }
        return ResponseEntity.ok(ApiResponse.ok(authService.getCurrentUser(principal.getUser()), "Current user"));
    }
}
