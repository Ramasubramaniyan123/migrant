package com.migrantcommunity.admin.controller;

import com.migrantcommunity.admin.service.AdminSettingsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/admin/settings")
public class AdminSettingsController {

    private final AdminSettingsService service;
    public AdminSettingsController(AdminSettingsService service) { this.service = service; }

    @GetMapping
    public Map<String, Object> get() { return service.get(); }

    @PutMapping
    public Map<String, Object> update(@RequestBody Map<String, Object> body) { return service.update(body); }
}
