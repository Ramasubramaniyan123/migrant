package com.migrantcommunity.admin.dto;

public record DashboardStatistics(
        long totalUsers,
        long activeUsers,
        long newRegistrationsToday,
        long newRegistrationsThisWeek,
        long totalCommunities,
        long activeCommunities,
        long totalConnections,
        long pendingReports,
        long pendingModeration,
        long totalPosts,
        long totalMessages
) {}