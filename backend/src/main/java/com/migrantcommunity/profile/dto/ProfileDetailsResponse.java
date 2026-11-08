package com.migrantcommunity.profile.dto;

import com.migrantcommunity.profile.PrivacySettings;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** Full profile view for the owning user. */
public record ProfileDetailsResponse(
        Long userId,
        String email,
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        String gender,
        String bio,
        String profilePictureUrl,
        String hometownCountry,
        String hometownCity,
        Double latitude,
        Double longitude,
        Double locationAccuracyKm,
        boolean discoveryEnabled,
        PrivacySettings privacy,
        List<UserLanguageInfo> languages,
        List<String> interests,
        Instant createdAt,
        Instant updatedAt) {

    public record UserLanguageInfo(Long languageId, String code, String name,
                                   String proficiency, boolean primary) {
    }
}
