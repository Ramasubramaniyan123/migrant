package com.migrantcommunity.discovery.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * PostGIS-backed discovery queries over user_profiles.current_location
 * (geometry(Point,4326), queried as geography for metric distances).
 */
public interface DiscoveryRepository extends Repository<DiscoveryRow, Void> {

    String FILTERS = """
            AND u.id <> :userId
            AND u.active = true
            AND p.discovery_enabled = true
            AND (:hometownCity IS NULL OR LOWER(p.hometown_city) = LOWER(:hometownCity))
            AND (:currentCity IS NULL OR LOWER(p.current_city) = LOWER(:currentCity))
            AND (:languageId IS NULL OR EXISTS (
                    SELECT 1 FROM user_languages ul
                    WHERE ul.user_id = u.id AND ul.language_id = :languageId))
            AND (:interest IS NULL OR EXISTS (
                    SELECT 1 FROM user_interests ui
                    WHERE ui.user_id = u.id AND LOWER(ui.interest) = LOWER(:interest)))
            AND NOT EXISTS (
                    SELECT 1 FROM blocks b
                    WHERE (b.blocker_id = :userId AND b.blocked_id = u.id)
                       OR (b.blocker_id = u.id AND b.blocked_id = :userId))
            """;

    @Query(value = """
            SELECT u.id AS userId,
                   TRIM(BOTH ' ' FROM CONCAT(COALESCE(p.first_name, ''), ' ', COALESCE(p.last_name, ''))) AS displayName,
                   p.profile_picture_url AS avatarUrl,
                   p.current_city AS currentCity,
                   p.hometown_city AS hometownCity,
                   p.hometown_country AS hometownCountry,
                   p.privacy_settings AS privacySettings,
                   CASE WHEN p.current_location IS NULL THEN NULL
                        ELSE ROUND(ST_Distance(p.current_location::geography,
                              ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography) / 1000.0, 1)
                   END AS distanceKm
            FROM users u
            JOIN user_profiles p ON p.user_id = u.id
            WHERE (:spatial = false
                   OR (p.current_location IS NOT NULL
                       AND ST_DWithin(p.current_location::geography,
                           ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                           :radiusMeters)))
            """ + FILTERS + """
            ORDER BY distanceKm ASC NULLS LAST, u.id ASC
            """, nativeQuery = true)
    List<DiscoveryRow> search(
            @Param("userId") Long userId,
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("spatial") boolean spatial,
            @Param("radiusMeters") double radiusMeters,
            @Param("hometownCity") String hometownCity,
            @Param("currentCity") String currentCity,
            @Param("languageId") Long languageId,
            @Param("interest") String interest,
            Pageable pageable);

    @Query(value = """
            SELECT COUNT(*)
            FROM users u
            JOIN user_profiles p ON p.user_id = u.id
            WHERE (:spatial = false
                   OR (p.current_location IS NOT NULL
                       AND ST_DWithin(p.current_location::geography,
                           ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                           :radiusMeters)))
            """ + FILTERS, nativeQuery = true)
    long countSearch(
            @Param("userId") Long userId,
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("spatial") boolean spatial,
            @Param("radiusMeters") double radiusMeters,
            @Param("hometownCity") String hometownCity,
            @Param("currentCity") String currentCity,
            @Param("languageId") Long languageId,
            @Param("interest") String interest);
}
