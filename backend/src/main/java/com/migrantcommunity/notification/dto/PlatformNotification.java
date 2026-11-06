package com.migrantcommunity.notification.dto;

import com.migrantcommunity.common.enums.BroadcastAudience;
import com.migrantcommunity.common.enums.PlatformNotificationType;

public record PlatformNotification(
        String id,
        String title,
        String body,
        PlatformNotificationType type,
        BroadcastAudience audience,
        String sentBy,
        String sentAt,
        long recipientCount,
        String status
) {}