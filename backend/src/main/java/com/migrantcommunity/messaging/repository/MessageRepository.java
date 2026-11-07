package com.migrantcommunity.messaging.repository;

import com.migrantcommunity.messaging.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    Page<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.conversation.id = :conversationId " +
           "AND m.sender.id != :userId " +
           "AND m.read = false")
    long countUnreadMessages(@Param("conversationId") Long conversationId, 
                            @Param("userId") Long userId);
    
    @Query("SELECT COUNT(m) FROM Message m JOIN m.conversation c JOIN c.members cm " +
           "WHERE cm.user.id = :userId AND m.sender.id != :userId AND m.read = false")
    long countAllUnreadMessagesForUser(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC")
    Page<Message> findLatestMessagesByConversationId(@Param("conversationId") Long conversationId, 
                                                     Pageable pageable);
}
