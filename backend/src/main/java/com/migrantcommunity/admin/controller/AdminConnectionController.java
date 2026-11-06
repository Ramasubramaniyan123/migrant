package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.service.AdminConnectionService;
import com.migrantcommunity.connection.dto.ConnectionResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/connections")
public class AdminConnectionController {

    private final AdminConnectionService service;
    public AdminConnectionController(AdminConnectionService service) { this.service = service; }

    @GetMapping
    public List<ConnectionResponse> list() { return service.list(); }

    @GetMapping("/analytics")
    public Map<String, Object> analytics() { return service.stats(); }
}
