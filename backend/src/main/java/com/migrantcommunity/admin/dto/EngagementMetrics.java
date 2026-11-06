package com.migrantcommunity.admin.dto;

public record EngagementMetrics(
        long dailyActiveUsers,
        long weeklyActiveUsers,
        long monthlyActiveUsers,
        double avgPostsPerUser,
        double avgConnectionsPerUser,
        double retentionDay7,
        double retentionDay30
) {}