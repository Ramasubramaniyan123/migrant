package com.migrantcommunity.community.repository;

import com.migrantcommunity.community.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    
    Page<Community> findByPublicCommunityTrue(Pageable pageable);
    
    Page<Community> findByLanguageId(Long languageId, Pageable pageable);
    
    Page<Community> findByLocationCountry(String country, Pageable pageable);
    
    Page<Community> findByLocationCity(String city, Pageable pageable);
    
    @Query("SELECT c FROM Community c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Community> searchCommunities(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT c FROM Community c WHERE c.publicCommunity = true " +
           "AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Community> searchPublicCommunities(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Community c WHERE c.language.id = :languageId")
    long countByLanguageId(@Param("languageId") Long languageId);
    
    Optional<Community> findByName(String name);
    
    boolean existsByName(String name);

    long countByPublicCommunityTrue();

    @Query("SELECT COALESCE(SUM(c.memberCount), 0) FROM Community c")
    long sumMemberCount();

    @Query("SELECT c.type, COUNT(c) FROM Community c GROUP BY c.type")
    java.util.List<Object[]> countByType();

    @Query("SELECT DISTINCT c FROM Community c " +
           "WHERE (:search IS NULL " +
           "       OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "       OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "  AND (:type IS NULL OR c.type = :type) " +
           "  AND (:city IS NULL OR c.locationCity = :city) " +
           "  AND (:activeOnly = false OR c.publicCommunity = true) " +
           "  AND (:inactiveOnly = false OR c.publicCommunity = false)")
    Page<Community> searchForAdmin(@Param("search") String search,
                                   @Param("type") com.migrantcommunity.common.enums.CommunityType type,
                                   @Param("city") String city,
                                   @Param("activeOnly") boolean activeOnly,
                                   @Param("inactiveOnly") boolean inactiveOnly,
                                   Pageable pageable);
}
