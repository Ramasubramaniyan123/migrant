package com.migrantcommunity.discovery.dto;

import java.util.List;

/** A discovered user — privacy-safe: no exact coordinates are ever returned. */
public record DiscoveredUser(
        Long userId,
        String displayName,
        String avatarUrl,
        String currentCity,
        String hometownCity,
        String hometownCountry,
        Double distanceKm,
        List<String> languages,
        String matchReason) {
}
