package com.migrantcommunity.moderation.dto;

import com.migrantcommunity.common.enums.ReportTargetType;

public record ModerationAction(
        String id,
        String reportId,
        String adminId,
        String adminName,
        String action,
        ReportTargetType targetType,
        String targetId,
        String reason,
        String createdAt
) {}