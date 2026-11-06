package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.dto.DashboardOverview;
import com.migrantcommunity.admin.dto.DashboardStatistics;
import com.migrantcommunity.admin.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/admin/dashboard")
public class AdminDashboardController {

    private final DashboardService service;
    public AdminDashboardController(DashboardService service) { this.service = service; }

    @GetMapping("/overview")
    public DashboardOverview overview() { return service.getOverview(); }

    @GetMapping("/statistics")
    public DashboardStatistics statistics() { return service.getStatistics(); }
}
