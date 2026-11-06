package com.migrantcommunity.moderation.dto;

import com.migrantcommunity.common.enums.ReportCategory;
import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.common.enums.ReportTargetType;

public record Report(
        String id,
        ReportTargetType targetType,
        String targetId,
        String targetPreview,
        String reporterId,
        String reporterName,
        ReportCategory category,
        String description,
        ReportStatus status,
        String priority,
        String assignedTo,
        String createdAt,
        String resolvedAt,
        String resolution
) {}