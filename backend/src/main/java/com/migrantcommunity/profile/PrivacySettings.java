package com.migrantcommunity.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.migrantcommunity.profile.entity.Profile;
import org.springframework.stereotype.Component;

/**
 * Privacy preferences stored as JSON on {@link Profile#getPrivacySettings()}.
 * Mirrors the structured columns in the user_privacy_settings table.
 */
public record PrivacySettings(
        boolean showHometown,
        boolean showCurrentCity,
        boolean showExactLocation,
        boolean allowConnectionRequests,
        boolean allowDirectMessages,
        boolean showOnlineStatus,
        boolean discoverable) {

    public static final PrivacySettings DEFAULTS = new PrivacySettings(
            true, true, false, true, true, true, true);

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static PrivacySettings fromProfile(Profile profile) {
        if (profile == null || profile.getPrivacySettings() == null
                || profile.getPrivacySettings().isBlank()) {
            return DEFAULTS;
        }
        try {
            PrivacySettings settings = MAPPER.readValue(profile.getPrivacySettings(), PrivacySettings.class);
            return settings == null ? DEFAULTS : settings;
        } catch (Exception ex) {
            return DEFAULTS;
        }
    }

    public String toJson() {
        try {
            return MAPPER.writeValueAsString(this);
        } catch (Exception ex) {
            return null;
        }
    }
}
