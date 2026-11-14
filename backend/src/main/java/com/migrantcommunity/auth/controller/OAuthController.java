package com.migrantcommunity.auth.controller;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.service.AuthService;
import com.migrantcommunity.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/oauth")
public class OAuthController {

    private final AuthService authService;

    public OAuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> handleGoogleOAuth(
            @RequestBody GoogleOAuthRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthResponse response = authService.authenticateWithGoogle(
                request.idToken(),
                clientIp,
                userAgent
        );

        return ResponseEntity.ok(ApiResponse.ok(response, "Successfully authenticated with Google"));
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    public record GoogleOAuthRequest(String idToken) {}
}
