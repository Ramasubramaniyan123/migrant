package com.migrantcommunity.post.repository;

import com.migrantcommunity.post.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    
    Optional<Reaction> findByPostIdAndUserId(Long postId, Long userId);
    
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    
    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post.id = :postId")
    long countByPostId(@Param("postId") Long postId);
    
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
