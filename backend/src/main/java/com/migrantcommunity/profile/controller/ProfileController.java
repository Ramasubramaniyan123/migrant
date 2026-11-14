package com.migrantcommunity.profile.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.profile.dto.LocationUpdateRequest;
import com.migrantcommunity.profile.dto.PrivacySettingsRequest;
import com.migrantcommunity.profile.dto.ProfileDetailsResponse;
import com.migrantcommunity.profile.dto.ProfileResponse;
import com.migrantcommunity.profile.dto.ProfileUpdateRequest;
import com.migrantcommunity.profile.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** REST entry point for profile endpoints. */
@RestController
@RequestMapping("/v1/profile")
@Tag(name = "Profile", description = "User profile management")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get the current user's compact profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> currentProfile() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.currentProfile(), "Profile retrieved"));
    }

    @GetMapping("/details")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get the full profile of the current user")
    public ResponseEntity<ApiResponse<ProfileDetailsResponse>> details() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfileDetails(), "Profile retrieved"));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update profile fields")
    public ResponseEntity<ApiResponse<ProfileDetailsResponse>> update(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.updateProfile(request), "Profile updated"));
    }

    @PutMapping("/privacy")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update privacy and discoverability settings")
    public ResponseEntity<ApiResponse<ProfileDetailsResponse>> updatePrivacy(
            @Valid @RequestBody PrivacySettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.updatePrivacySettings(request), "Privacy settings updated"));
    }

    @PutMapping("/location")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update the user's current location")
    public ResponseEntity<ApiResponse<ProfileDetailsResponse>> updateLocation(
            @Valid @RequestBody LocationUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.updateLocation(request), "Location updated"));
    }

    @PostMapping("/languages/{languageId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a language to the user's profile")
    public ResponseEntity<ApiResponse<Void>> addLanguage(
            @PathVariable Long languageId,
            @RequestParam(required = false) String proficiency,
            @RequestParam(defaultValue = "false") boolean primary) {
        profileService.addLanguage(languageId, proficiency, primary);
        return ResponseEntity.ok(ApiResponse.ok(null, "Language added"));
    }

    @DeleteMapping("/languages/{languageId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove a language from the user's profile")
    public ResponseEntity<ApiResponse<Void>> removeLanguage(@PathVariable Long languageId) {
        profileService.removeLanguage(languageId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Language removed"));
    }

    @PostMapping("/deactivate")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Deactivate the current user's account")
    public ResponseEntity<ApiResponse<Void>> deactivate() {
        profileService.deactivateAccount();
        return ResponseEntity.ok(ApiResponse.ok(null, "Account deactivated"));
    }

    @PostMapping("/profile-picture")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Set the profile picture URL after upload")
    public ResponseEntity<ApiResponse<Void>> setProfilePicture(@RequestBody Map<String, String> body) {
        profileService.updateProfilePicture(body.get("imageUrl"));
        return ResponseEntity.ok(ApiResponse.ok(null, "Profile picture updated"));
    }

    @PostMapping("/interests")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add an interest to the user's profile")
    public ResponseEntity<ApiResponse<Void>> addInterest(@RequestParam String interest) {
        profileService.addInterest(interest);
        return ResponseEntity.ok(ApiResponse.ok(null, "Interest added"));
    }

    @DeleteMapping("/interests/{interest}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove an interest from the user's profile")
    public ResponseEntity<ApiResponse<Void>> removeInterest(@PathVariable String interest) {
        profileService.removeInterest(interest);
        return ResponseEntity.ok(ApiResponse.ok(null, "Interest removed"));
    }
}
