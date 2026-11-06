package com.migrantcommunity.location.dto;

/** An approximate, privacy-preserving location used for discovery. */
public record LocationResponse(double latitude, double longitude, double accuracyKm, String city) {
}
