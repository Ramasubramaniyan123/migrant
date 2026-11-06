package com.migrantcommunity.admin.dto;

import java.util.List;

public record DashboardOverview(
        DashboardStatistics statistics,
        List<TimeSeriesPoint> userGrowth,
        List<LanguageDistribution> languageDistribution,
        List<CityDistribution> cityDistribution,
        List<ActivityItem> recentActivity,
        List<com.migrantcommunity.moderation.dto.Report> pendingReports
) {}