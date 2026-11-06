package com.migrantcommunity.audit.dto;

public record AuditLog(
        String id,
        String adminId,
        String adminName,
        String adminRole,
        String action,
        String targetType,
        String targetId,
        String details,
        String ipAddress,
        String result,
        String createdAt
) {}