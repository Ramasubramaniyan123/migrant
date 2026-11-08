package com.migrantcommunity.user.repository;

import com.migrantcommunity.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    long countByActive(boolean active);
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByCreatedAtAfter(java.time.Instant after);
    long countByCreatedAtBetween(java.time.Instant start, java.time.Instant end);

    @org.springframework.data.jpa.repository.Query(
            "SELECT FUNCTION('date', u.createdAt), COUNT(u) FROM User u " +
            "WHERE u.createdAt >= :since GROUP BY FUNCTION('date', u.createdAt)")
    List<Object[]> countRegistrationsSince(@org.springframework.data.repository.query.Param("since") java.time.Instant since);

    @org.springframework.data.jpa.repository.Query(
            "SELECT l.name, COUNT(ul) FROM UserLanguage ul JOIN ul.language l GROUP BY l.name")
    List<Object[]> countUsersByLanguage();

    @org.springframework.data.jpa.repository.Query(
            "SELECT DISTINCT u FROM User u " +
            "LEFT JOIN u.profile p " +
            "LEFT JOIN com.migrantcommunity.language.entity.UserLanguage ul ON ul.user = u " +
            "LEFT JOIN ul.language lang " +
            "WHERE (:search IS NULL OR :search = '' " +
            "       OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "       OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "       OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "       OR LOWER(p.hometownCity) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "  AND (:status IS NULL OR u.accountStatus = :status) " +
            "  AND (:city IS NULL OR :city = 'ALL' OR p.currentCity = :city) " +
            "  AND (:language IS NULL OR :language = 'ALL' OR lang.name = :language)")
    org.springframework.data.domain.Page<User> searchForAdmin(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("status") com.migrantcommunity.common.enums.UserStatus status,
            @org.springframework.data.repository.query.Param("city") String city,
            @org.springframework.data.repository.query.Param("language") String language,
            org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query(
            "SELECT DISTINCT p.currentCity FROM Profile p WHERE p.currentCity IS NOT NULL ORDER BY p.currentCity")
    List<String> findDistinctCurrentCities();
}
