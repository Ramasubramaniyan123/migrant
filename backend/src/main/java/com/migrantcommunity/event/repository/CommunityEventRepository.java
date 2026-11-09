package com.migrantcommunity.event.repository;

import com.migrantcommunity.common.enums.EventStatus;
import com.migrantcommunity.event.entity.CommunityEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface CommunityEventRepository extends JpaRepository<CommunityEvent, Long> {

    /** Row lock used to serialize concurrent registrations for capacity checks. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM CommunityEvent e WHERE e.id = :id")
    Optional<CommunityEvent> findByIdForUpdate(@Param("id") Long id);

    /** Upcoming events in public communities, plus private communities the user belongs to. */
    @Query("SELECT e FROM CommunityEvent e WHERE e.status = 'UPCOMING' "
            + "AND (e.community.publicCommunity = true OR EXISTS ("
            + "  SELECT 1 FROM CommunityMember cm WHERE cm.community = e.community AND cm.user.id = :userId)) "
            + "ORDER BY e.startTime ASC")
    Page<CommunityEvent> findVisibleUpcoming(@Param("userId") Long userId, Pageable pageable);

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
