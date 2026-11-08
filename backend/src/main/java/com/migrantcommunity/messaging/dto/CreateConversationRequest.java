package com.migrantcommunity.messaging.dto;

import jakarta.validation.constraints.NotNull;

public record CreateConversationRequest(@NotNull Long userId) {
}
