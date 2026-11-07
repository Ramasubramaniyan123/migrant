package com.migrantcommunity.notification.dto;

import com.migrantcommunity.common.enums.NotificationType;

import java.time.Instant;

public record NotificationResponse(
    Long id,
    NotificationType type,
    String title,
    String content,
    Long relatedId,
    boolean read,
    Instant createdAt
) {}
