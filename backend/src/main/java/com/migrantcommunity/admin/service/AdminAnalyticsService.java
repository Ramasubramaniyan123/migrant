package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.CityDistribution;
import com.migrantcommunity.admin.dto.EngagementMetrics;
import com.migrantcommunity.admin.dto.LanguageDistribution;
import com.migrantcommunity.admin.dto.TimeSeriesPoint;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAnalyticsService {

    public List<TimeSeriesPoint> userGrowth() {
        return List.of(
                new TimeSeriesPoint("2025-01-01", 4600, 1700, 1100, 5500),
                new TimeSeriesPoint("2025-01-02", 4620, 1715, 1110, 5525),
                new TimeSeriesPoint("2025-01-03", 4645, 1730, 1120, 5550)
        );
    }

    public List<LanguageDistribution> languages() {
        return List.of(
                new LanguageDistribution("Hindi", 1820, 38.4),
                new LanguageDistribution("Tamil", 620, 13.1),
                new LanguageDistribution("Telugu", 540, 11.4)
        );
    }

    public List<CityDistribution> locations() {
        return List.of(
                new CityDistribution("Mumbai", 1520, 32.0),
                new CityDistribution("Delhi", 980, 20.7)
        );
    }

    public EngagementMetrics engagement() {
        return new EngagementMetrics(1820, 3200, 4100, 2.4, 5.1, 42.5, 28.3);
    }
}
