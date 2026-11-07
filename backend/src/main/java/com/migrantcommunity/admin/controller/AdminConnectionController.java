package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.service.AdminConnectionService;
import com.migrantcommunity.connection.dto.ConnectionResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/admin/connections")
public class AdminConnectionController {

    private final AdminConnectionService service;
    public AdminConnectionController(AdminConnectionService service) { this.service = service; }

    @GetMapping
    public org.springframework.data.domain.Page<ConnectionResponse> list(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.list(pageable);
    }

    @GetMapping("/analytics")
    public Map<String, Object> analytics() { return service.stats(); }
}
