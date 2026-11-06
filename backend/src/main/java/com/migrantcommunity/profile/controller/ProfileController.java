package com.migrantcommunity.profile.controller;

import com.migrantcommunity.profile.dto.ProfileResponse;
import com.migrantcommunity.profile.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for profile endpoints. */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileResponse currentProfile() {
        return profileService.currentProfile();
    }
}
