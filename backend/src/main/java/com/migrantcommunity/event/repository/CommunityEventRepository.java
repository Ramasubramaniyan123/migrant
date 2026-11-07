package com.migrantcommunity.event.repository;

import com.migrantcommunity.common.enums.EventStatus;
import com.migrantcommunity.event.entity.CommunityEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface CommunityEventRepository extends JpaRepository<CommunityEvent, Long> {
    
    Page<CommunityEvent> findByCommunityIdOrderByStartTimeAsc(Long communityId, Pageable pageable);
    
    Page<CommunityEvent> findByStatusOrderByStartTimeAsc(EventStatus status, Pageable pageable);
    
    @Query("SELECT e FROM CommunityEvent e WHERE e.community.id = :communityId " +
           "AND e.startTime >= :now AND e.status = 'UPCOMING' ORDER BY e.startTime ASC")
    Page<CommunityEvent> findUpcomingEventsByCommunityId(@Param("communityId") Long communityId,
                                                          @Param("now") Instant now,
                                                          Pageable pageable);
    
    @Query("SELECT COUNT(e) FROM CommunityEvent e WHERE e.community.id = :communityId")
    long countByCommunityId(@Param("communityId") Long communityId);
    
    @Query("SELECT COUNT(e) FROM CommunityEvent e WHERE e.organizer.id = :organizerId")
    long countByOrganizerId(@Param("organizerId") Long organizerId);
}
