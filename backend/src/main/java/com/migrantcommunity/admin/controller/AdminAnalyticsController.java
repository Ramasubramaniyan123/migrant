package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.dto.CityDistribution;
import com.migrantcommunity.admin.dto.EngagementMetrics;
import com.migrantcommunity.admin.dto.LanguageDistribution;
import com.migrantcommunity.admin.dto.TimeSeriesPoint;
import com.migrantcommunity.admin.service.AdminAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/analytics")
public class AdminAnalyticsController {

    private final AdminAnalyticsService service;
    public AdminAnalyticsController(AdminAnalyticsService service) { this.service = service; }

    @GetMapping("/users")
    public List<TimeSeriesPoint> users() { return service.userGrowth(); }

    @GetMapping("/languages")
    public List<LanguageDistribution> languages() { return service.languages(); }

    @GetMapping("/locations")
    public List<CityDistribution> locations() { return service.locations(); }

    @GetMapping("/engagement")
    public EngagementMetrics engagement() { return service.engagement(); }
}
