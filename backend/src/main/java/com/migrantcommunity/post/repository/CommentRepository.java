package com.migrantcommunity.post.repository;

import com.migrantcommunity.post.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    Page<Comment> findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId, Pageable pageable);
    
    List<Comment> findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);
    
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    long countByPostId(@Param("postId") Long postId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
