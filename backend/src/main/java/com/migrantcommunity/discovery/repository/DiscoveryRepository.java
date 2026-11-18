package com.migrantcommunity.discovery.repository;

import com.migrantcommunity.user.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Discovery queries over user_profiles.current_location_lat/lng.
 * Distances are computed with the haversine formula in plain PostgreSQL.
 */
public interface DiscoveryRepository extends Repository<User, Long> {

    // Haversine distance in kilometres between the profile coordinates and the
    // supplied centre point. Returns NULL when the profile has no coordinates.
    String DISTANCE_KM = """
            CASE WHEN p.current_location_lat IS NULL OR p.current_location_lng IS NULL THEN NULL
                 ELSE ROUND((6371.0088 * 2 * ASIN(LEAST(1.0, SQRT(
                     POWER(SIN(RADIANS(p.current_location_lat - :latitude) / 2), 2)
                     + COS(RADIANS(:latitude)) * COS(RADIANS(p.current_location_lat))
                     * POWER(SIN(RADIANS(p.current_location_lng - :longitude) / 2), 2)
                 ))))::numeric, 1)::double precision
            END
            """;

    // Same haversine distance in metres, used for the radius filter.
    String DISTANCE_M = """
            6371.0088 * 2 * ASIN(LEAST(1.0, SQRT(
                POWER(SIN(RADIANS(p.current_location_lat - :latitude) / 2), 2)
                + COS(RADIANS(:latitude)) * COS(RADIANS(p.current_location_lat))
                * POWER(SIN(RADIANS(p.current_location_lng - :longitude) / 2), 2)
            ))) * 1000.0
            """;

    String FILTERS = """
            AND u.id <> :userId
            AND u.is_active = true
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
            """ + DISTANCE_KM + """
            AS distanceKm
            FROM users u
            JOIN user_profiles p ON p.user_id = u.id
            WHERE (:spatial = false
                   OR (p.current_location_lat IS NOT NULL
                       AND p.current_location_lng IS NOT NULL
                       AND """ + " " + DISTANCE_M + " " + """
                       <= :radiusMeters))
            """ + FILTERS + """
            ORDER BY distanceKm ASC NULLS LAST, u.id ASC
            LIMIT :limit OFFSET :offset
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
            @Param("limit") int limit,
            @Param("offset") long offset);

    @Query(value = """
            SELECT COUNT(*)
            FROM users u
            JOIN user_profiles p ON p.user_id = u.id
            WHERE (:spatial = false
                   OR (p.current_location_lat IS NOT NULL
                       AND p.current_location_lng IS NOT NULL
                       AND """ + " " + DISTANCE_M + " " + """
                       <= :radiusMeters))
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
