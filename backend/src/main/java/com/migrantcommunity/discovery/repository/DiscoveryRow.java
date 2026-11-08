package com.migrantcommunity.discovery.repository;

/** Projection for the native discovery query. */
public interface DiscoveryRow {
    Long getUserId();
    String getDisplayName();
    String getAvatarUrl();
    String getCurrentCity();
    String getHometownCity();
    String getHometownCountry();
    String getPrivacySettings();
    Double getDistanceKm();
}
