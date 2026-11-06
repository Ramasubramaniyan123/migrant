package com.migrantcommunity.discovery.dto;

import java.util.List;

/** Suggested users returned by the discovery feed. */
public record DiscoveryResponse(int total, double radiusKm, List<String> suggestedUserIds) {
}
