package com.migrantcommunity.auth.controller;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.service.AuthService;
import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.security.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/oauth")
public class OAuthController {

    private final AuthService authService;
    private final ClientIpResolver clientIpResolver;

    public OAuthController(AuthService authService, ClientIpResolver clientIpResolver) {
        this.authService = authService;
        this.clientIpResolver = clientIpResolver;
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> handleGoogleOAuth(
            @RequestBody GoogleOAuthRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = clientIpResolver.resolve(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthResponse response = authService.authenticateWithGoogle(
                request.idToken(),
                clientIp,
                userAgent
        );

        return ResponseEntity.ok(ApiResponse.ok(response, "Successfully authenticated with Google"));
    }

    public record GoogleOAuthRequest(String idToken) {}
}
