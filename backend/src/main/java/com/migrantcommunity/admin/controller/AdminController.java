package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.dto.AdminResponse;
import com.migrantcommunity.admin.service.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for admin dashboard endpoints. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public AdminResponse statistics() {
        return adminService.statistics();
    }
}
