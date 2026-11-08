package com.migrantcommunity.messaging.repository;

import com.migrantcommunity.messaging.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT c FROM Conversation c JOIN c.members cm WHERE cm.user.id = :userId ORDER BY c.updatedAt DESC")
    Page<Conversation> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT c FROM Conversation c JOIN c.members cm1 JOIN c.members cm2 " +
           "WHERE cm1.user.id = :user1Id AND cm2.user.id = :user2Id " +
           "AND (SELECT COUNT(cm) FROM ConversationMember cm WHERE cm.conversation = c) = 2")
    Optional<Conversation> findDirectConversationBetweenUsers(@Param("user1Id") Long user1Id, 
                                                              @Param("user2Id") Long user2Id);
    
    @Query("SELECT COUNT(c) FROM Conversation c JOIN c.members cm WHERE cm.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
