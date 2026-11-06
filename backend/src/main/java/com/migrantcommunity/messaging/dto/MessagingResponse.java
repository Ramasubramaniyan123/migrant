package com.migrantcommunity.messaging.dto;

import java.util.List;

/** A chat conversation summary. */
public record MessagingResponse(String conversationId, List<String> participants, int unreadCount) {
}
