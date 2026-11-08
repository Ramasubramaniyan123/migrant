package com.migrantcommunity.messaging.dto;

import java.time.Instant;
import java.util.List;

public record ConversationSummary(
        Long id,
        List<MemberInfo> members,
        String lastMessage,
        Instant lastMessageAt,
        long unreadCount) {

    public record MemberInfo(Long userId, String displayName, String avatarUrl) {
    }
}
