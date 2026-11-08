package com.migrantcommunity.profile.dto;

import jakarta.validation.constraints.NotNull;

public record PrivacySettingsRequest(
        @NotNull Boolean showHometown,
        @NotNull Boolean showCurrentCity,
        @NotNull Boolean showExactLocation,
        @NotNull Boolean allowConnectionRequests,
        @NotNull Boolean allowDirectMessages,
        @NotNull Boolean showOnlineStatus,
        @NotNull Boolean discoverable) {
}
