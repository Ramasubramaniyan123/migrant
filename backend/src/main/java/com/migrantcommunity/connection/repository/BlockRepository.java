package com.migrantcommunity.connection.repository;

import com.migrantcommunity.connection.entity.Block;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    
    Page<Block> findByBlockerId(Long blockerId, Pageable pageable);
    
    Optional<Block> findByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
    
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Block b " +
           "WHERE (b.blocker.id = :user1Id AND b.blocked.id = :user2Id) " +
           "OR (b.blocker.id = :user2Id AND b.blocked.id = :user1Id)")
    boolean isBlockedBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    boolean existsByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
    
    @Query("SELECT b.blocked.id FROM Block b WHERE b.blocker.id = :userId")
    List<Long> findBlockedUserIdsByBlockerId(@Param("userId") Long userId);
    
    void deleteByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
}
