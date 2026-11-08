package com.migrantcommunity.discovery.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.discovery.dto.DiscoveredUser;
import com.migrantcommunity.discovery.repository.DiscoveryRepository;
import com.migrantcommunity.discovery.repository.DiscoveryRow;
import com.migrantcommunity.language.entity.UserLanguage;
import com.migrantcommunity.language.repository.UserLanguageRepository;
import com.migrantcommunity.profile.PrivacySettings;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.profile.repository.ProfileRepository;
import com.migrantcommunity.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DiscoveryService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final double DEFAULT_RADIUS_KM = 50.0;
    private static final double MAX_RADIUS_KM = 500.0;

    private final DiscoveryRepository discoveryRepository;
    private final ProfileRepository profileRepository;
    private final UserLanguageRepository userLanguageRepository;
    private final CurrentUserProvider currentUserProvider;

    public DiscoveryService(DiscoveryRepository discoveryRepository,
                            ProfileRepository profileRepository,
                            UserLanguageRepository userLanguageRepository,
                            CurrentUserProvider currentUserProvider) {
        this.discoveryRepository = discoveryRepository;
        this.profileRepository = profileRepository;
        this.userLanguageRepository = userLanguageRepository;
        this.currentUserProvider = currentUserProvider;
    }

    /**
     * Privacy-aware people discovery. Never returns exact coordinates — only
     * the rounded distance in kilometres and fields permitted by each user's
     * privacy settings. Blocked users and non-discoverable profiles are excluded
     * in SQL.
     */
    public Page<DiscoveredUser> discover(Double radiusKm, Double latitude, Double longitude,
                                         String hometownCity, String currentCity,
                                         Long languageId, String interest,
                                         int page, int size) {
        User me = currentUserProvider.requireUser();
        Profile myProfile = profileRepository.findByUserId(me.getId()).orElse(null);

        double[] center = resolveCenter(myProfile, latitude, longitude);
        double radius = radiusKm != null ? radiusKm : DEFAULT_RADIUS_KM;
        if (radius <= 0 || radius > MAX_RADIUS_KM) {
            throw new BadRequestException("radiusKm must be between 0 and " + (int) MAX_RADIUS_KM);
        }
        boolean spatial = center != null;
        double lat = spatial ? center[0] : 0;
        double lng = spatial ? center[1] : 0;

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));

        List<DiscoveryRow> rows = discoveryRepository.search(
                me.getId(), lat, lng, spatial, radius * 1000.0,
                hometownCity, currentCity, languageId, interest, pageable);
        long total = discoveryRepository.countSearch(
                me.getId(), lat, lng, spatial, radius * 1000.0,
                hometownCity, currentCity, languageId, interest);

        Map<Long, List<String>> languagesByUser = rows.isEmpty() ? Map.of()
                : userLanguageRepository
                        .findAllByUserIdIn(rows.stream().map(DiscoveryRow::getUserId).toList())
                        .stream()
                        .collect(Collectors.groupingBy(
                                ul -> ul.getUser().getId(),
                                Collectors.mapping(ul -> ul.getLanguage().getName(), Collectors.toList())));

        List<DiscoveredUser> items = rows.stream()
                .map(row -> toDiscoveredUser(row, languagesByUser.getOrDefault(row.getUserId(), List.of())))
                .toList();
        return new PageImpl<>(items, pageable, total);
    }

    /** Hometown-based matching: people sharing the requester's hometown. */
    public Page<DiscoveredUser> discoverByHometown(String hometownCity, int page, int size) {
        User me = currentUserProvider.requireUser();
        Profile myProfile = profileRepository.findByUserId(me.getId()).orElse(null);
        String city = hometownCity != null && !hometownCity.isBlank()
                ? hometownCity
                : (myProfile != null ? myProfile.getHometownCity() : null);
        if (city == null || city.isBlank()) {
            throw new BadRequestException("hometownCity is required");
        }
        double[] center = myProfile != null && myProfile.getCurrentLocation() != null
                ? new double[]{myProfile.getCurrentLocation().getY(), myProfile.getCurrentLocation().getX()}
                : null;
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
        List<DiscoveryRow> rows = discoveryRepository.search(
                me.getId(),
                center != null ? center[0] : 0, center != null ? center[1] : 0,
                center != null, Double.MAX_VALUE / 4,
                city, null, null, null, pageable);
        long total = discoveryRepository.countSearch(
                me.getId(),
                center != null ? center[0] : 0, center != null ? center[1] : 0,
                center != null, Double.MAX_VALUE / 4,
                city, null, null, null);
        Map<Long, List<String>> languagesByUser = rows.isEmpty() ? Map.of()
                : userLanguageRepository
                        .findAllByUserIdIn(rows.stream().map(DiscoveryRow::getUserId).toList())
                        .stream()
                        .collect(Collectors.groupingBy(
                                ul -> ul.getUser().getId(),
                                Collectors.mapping(ul -> ul.getLanguage().getName(), Collectors.toList())));
        List<DiscoveredUser> items = rows.stream()
                .map(row -> toDiscoveredUser(row, languagesByUser.getOrDefault(row.getUserId(), List.of())))
                .toList();
        return new PageImpl<>(items, pageable, total);
    }

    private double[] resolveCenter(Profile myProfile, Double latitude, Double longitude) {
        if (latitude != null && longitude != null) {
            return new double[]{latitude, longitude};
        }
        if (myProfile != null && myProfile.getCurrentLocation() != null) {
            return new double[]{myProfile.getCurrentLocation().getY(), myProfile.getCurrentLocation().getX()};
        }
        return null;
    }

    private DiscoveredUser toDiscoveredUser(DiscoveryRow row, List<String> languages) {
        PrivacySettings privacy = parsePrivacy(row.getPrivacySettings());
        String name = row.getDisplayName() == null || row.getDisplayName().isBlank()
                ? "Member" : row.getDisplayName().trim();
        return new DiscoveredUser(
                row.getUserId(),
                name,
                row.getAvatarUrl(),
                privacy.showCurrentCity() ? row.getCurrentCity() : null,
                privacy.showHometown() ? row.getHometownCity() : null,
                privacy.showHometown() ? row.getHometownCountry() : null,
                row.getDistanceKm(),
                languages,
                matchReason(row));
    }

    private PrivacySettings parsePrivacy(String json) {
        if (json == null || json.isBlank()) {
            return PrivacySettings.DEFAULTS;
        }
        try {
            JsonNode node = MAPPER.readTree(json);
            return new PrivacySettings(
                    node.path("showHometown").asBoolean(true),
                    node.path("showCurrentCity").asBoolean(true),
                    node.path("showExactLocation").asBoolean(false),
                    node.path("allowConnectionRequests").asBoolean(true),
                    node.path("allowDirectMessages").asBoolean(true),
                    node.path("showOnlineStatus").asBoolean(true),
                    node.path("discoverable").asBoolean(true));
        } catch (Exception ex) {
            return PrivacySettings.DEFAULTS;
        }
    }

    private String matchReason(DiscoveryRow row) {
        if (row.getHometownCity() != null && !row.getHometownCity().isBlank()) {
            return "HOMETOWN";
        }
        if (row.getDistanceKm() != null && row.getDistanceKm() <= 25) {
            return "NEARBY";
        }
        return "DISCOVERED";
    }
}
