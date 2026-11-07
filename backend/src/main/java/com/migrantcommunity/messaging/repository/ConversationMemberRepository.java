package com.migrantcommunity.messaging.repository;

import com.migrantcommunity.messaging.entity.ConversationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationMemberRepository extends JpaRepository<ConversationMember, Long> {
    
    List<ConversationMember> findByConversationId(Long conversationId);
    
    Optional<ConversationMember> findByConversationIdAndUserId(Long conversationId, Long userId);
    
    boolean existsByConversationIdAndUserId(Long conversationId, Long userId);
    
    @Query("SELECT cm.user.id FROM ConversationMember cm WHERE cm.conversation.id = :conversationId")
    List<Long> findUserIdsByConversationId(@Param("conversationId") Long conversationId);
}
