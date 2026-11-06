package com.migrantcommunity.admin.controller;

import com.migrantcommunity.audit.dto.AuditLog;
import com.migrantcommunity.audit.service.AdminAuditService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/audit-logs")
public class AdminAuditController {

    private final AdminAuditService service;
    public AdminAuditController(AdminAuditService service) { this.service = service; }

    @GetMapping
    public List<AuditLog> list() { return service.list(); }
}
