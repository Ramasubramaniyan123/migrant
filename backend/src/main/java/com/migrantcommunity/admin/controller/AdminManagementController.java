package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.dto.Administrator;
import com.migrantcommunity.admin.service.AdminAuthService;
import com.migrantcommunity.common.enums.AdminRole;
import com.migrantcommunity.common.enums.AdminStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/administrators")
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
public class AdminManagementController {

    private final AdminAuthService service;
    public AdminManagementController(AdminAuthService service) { this.service = service; }

    @GetMapping
    public List<Administrator> list() { return service.listAdmins(); }

    @PostMapping
    public Administrator create(@RequestBody Map<String, String> body) {
        return service.createAdmin(body.get("name"), body.get("email"), AdminRole.valueOf(body.get("role")));
    }

    @PatchMapping("/{id}/role")
    public Administrator updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        return service.updateAdminRole(id, AdminRole.valueOf(body.get("role")));
    }

    @PatchMapping("/{id}/status")
    public Administrator updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return service.updateAdminStatus(id, AdminStatus.valueOf(body.get("status")));
    }
}
