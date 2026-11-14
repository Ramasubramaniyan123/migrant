package com.migrantcommunity.location.service;

import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.location.dto.LocationResponse;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.profile.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Returns the current user's coarsened location for discovery display. */
@Service
@Transactional(readOnly = true)
public class LocationService {

    private final ProfileRepository profileRepository;
    private final CurrentUserProvider currentUserProvider;

    public LocationService(ProfileRepository profileRepository, CurrentUserProvider currentUserProvider) {
        this.profileRepository = profileRepository;
        this.currentUserProvider = currentUserProvider;
    }

    public LocationResponse approximateLocation() {
        Profile profile = profileRepository.findByUser_Id(currentUserProvider.requireUserId())
                .orElse(null);
        if (profile == null || profile.getCurrentLocationLat() == null || profile.getCurrentLocationLng() == null) {
            return new LocationResponse(0, 0, 0, null);
        }
        // Coarsen to ~1km grid to avoid exposing precise coordinates.
        double lat = Math.round(profile.getCurrentLocationLat() * 100.0) / 100.0;
        double lng = Math.round(profile.getCurrentLocationLng() * 100.0) / 100.0;
        return new LocationResponse(lat, lng,
                profile.getLocationAccuracyKm() != null ? profile.getLocationAccuracyKm() : 1.0,
                profile.getCurrentCity());
    }
}
