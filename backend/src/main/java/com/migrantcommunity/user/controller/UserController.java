package com.migrantcommunity.user.controller;

import com.migrantcommunity.user.dto.UserResponse;
import com.migrantcommunity.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for user account endpoints. */
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse currentUser() {
        return userService.currentUser();
    }
}
