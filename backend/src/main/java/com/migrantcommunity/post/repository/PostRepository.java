package com.migrantcommunity.post.repository;

import com.migrantcommunity.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    long countByCreatedAtBetween(java.time.Instant start, java.time.Instant end);

    
    Page<Post> findByCommunityIdOrderByCreatedAtDesc(Long communityId, Pageable pageable);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.community c WHERE c.publicCommunity = true ORDER BY p.createdAt DESC")
    Page<Post> findByPublicCommunityOrderByCreatedAtDesc(Pageable pageable);
    
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.community.id IN :communityIds ORDER BY p.createdAt DESC")
    Page<Post> findByCommunityIdsOrderByCreatedAtDesc(@Param("communityIds") List<Long> communityIds, 
                                                       Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.community.id = :communityId")
    long countByCommunityId(@Param("communityId") Long communityId);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
