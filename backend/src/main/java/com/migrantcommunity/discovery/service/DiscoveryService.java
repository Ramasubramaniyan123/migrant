package com.migrantcommunity.discovery.service;

import com.migrantcommunity.common.util.DistanceCalculator;
import com.migrantcommunity.discovery.dto.DiscoveryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder discovery logic for the prototype. */
@Service
public class DiscoveryService {

    private static final double RADIUS_KM = 25.0;

    /**
     * Returns placeholder suggestions.
     * The real implementation will run a PostGIS proximity query using
     * {@link DistanceCalculator} semantics over the locations table.
     */
    public DiscoveryResponse suggestions() {
        List<String> suggestedUserIds = List.of("usr_002", "usr_003", "usr_004");
        return new DiscoveryResponse(suggestedUserIds.size(), RADIUS_KM, suggestedUserIds);
    }
}
