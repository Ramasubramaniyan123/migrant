package com.migrantcommunity.user.controller;

import com.migrantcommunity.user.dto.UserResponse;
import com.migrantcommunity.user.service.UserService;
import com.migrantcommunity.security.CustomUserDetails;
import com.migrantcommunity.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for user account endpoints. */
@RestController
@RequestMapping("/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.ok(null, "Not authenticated"));
        }
        UserResponse user = userService.getUserResponse(principal.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok(user, "Current user retrieved"));
    }
}
