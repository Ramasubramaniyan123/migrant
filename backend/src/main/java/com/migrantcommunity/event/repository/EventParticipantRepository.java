package com.migrantcommunity.event.repository;

import com.migrantcommunity.event.entity.EventParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
    Page<EventParticipant> findByEventId(Long eventId, Pageable pageable);
    
    Page<EventParticipant> findByUserId(Long userId, Pageable pageable);
    
    Optional<EventParticipant> findByEventIdAndUserId(Long eventId, Long userId);
    
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
    
    @Query("SELECT COUNT(ep) FROM EventParticipant ep WHERE ep.event.id = :eventId AND ep.status = 'ATTENDING'")
    long countAttendingByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT ep.user.id FROM EventParticipant ep WHERE ep.event.id = :eventId")
    List<Long> findUserIdsByEventId(@Param("eventId") Long eventId);
    
    void deleteByEventIdAndUserId(Long eventId, Long userId);
}
