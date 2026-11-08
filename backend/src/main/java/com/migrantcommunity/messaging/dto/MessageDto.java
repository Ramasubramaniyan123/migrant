package com.migrantcommunity.messaging.dto;

import java.time.Instant;

public record MessageDto(
        Long id,
        Long conversationId,
        Long senderId,
        String senderName,
        String content,
        boolean read,
        Instant createdAt) {
}
