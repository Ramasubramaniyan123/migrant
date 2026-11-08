package com.migrantcommunity.connection.repository;

import com.migrantcommunity.common.enums.ConnectionStatus;
import com.migrantcommunity.connection.entity.Connection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    long countByCreatedAtBetween(java.time.Instant start, java.time.Instant end);
    long countByStatus(com.migrantcommunity.common.enums.ConnectionStatus status);

    
    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId) AND c.status = :status")
    Page<Connection> findByUserIdAndStatus(@Param("userId") Long userId, 
                                           @Param("status") ConnectionStatus status, 
                                           Pageable pageable);
    
    @Query("SELECT c FROM Connection c WHERE c.requester.id = :userId AND c.status = :status")
    Page<Connection> findByRequesterIdAndStatus(@Param("userId") Long userId, 
                                                @Param("status") ConnectionStatus status, 
                                                Pageable pageable);
    
    @Query("SELECT c FROM Connection c WHERE c.receiver.id = :userId AND c.status = :status")
    Page<Connection> findByReceiverIdAndStatus(@Param("userId") Long userId, 
                                               @Param("status") ConnectionStatus status, 
                                               Pageable pageable);
    
    @Query("SELECT c FROM Connection c WHERE ((c.requester.id = :user1Id AND c.receiver.id = :user2Id) " +
           "OR (c.requester.id = :user2Id AND c.receiver.id = :user1Id))")
    Optional<Connection> findByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    @Query("SELECT c FROM Connection c WHERE ((c.requester.id = :user1Id AND c.receiver.id = :user2Id) " +
           "OR (c.requester.id = :user2Id AND c.receiver.id = :user1Id)) AND c.status = :status")
    Optional<Connection> findByUsersAndStatus(@Param("user1Id") Long user1Id, 
                                              @Param("user2Id") Long user2Id, 
                                              @Param("status") ConnectionStatus status);
    
    @Query("SELECT COUNT(c) FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId) AND c.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ConnectionStatus status);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Connection c " +
           "WHERE ((c.requester.id = :user1Id AND c.receiver.id = :user2Id) " +
           "OR (c.requester.id = :user2Id AND c.receiver.id = :user1Id)) AND c.status = 'ACCEPTED'")
    boolean areUsersConnected(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    boolean existsByRequesterIdAndReceiverId(Long requesterId, Long receiverId);
}
