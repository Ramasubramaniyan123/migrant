package com.migrantcommunity.admin.controller;

import com.migrantcommunity.common.enums.BroadcastAudience;
import com.migrantcommunity.common.enums.PlatformNotificationType;
import com.migrantcommunity.notification.dto.PlatformNotification;
import com.migrantcommunity.notification.service.AdminNotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/notifications")
public class AdminNotificationController {

    private final AdminNotificationService service;
    public AdminNotificationController(AdminNotificationService service) { this.service = service; }

    @GetMapping
    public List<PlatformNotification> list() { return service.list(); }

    @PostMapping("/broadcast")
    public PlatformNotification broadcast(@RequestBody Map<String, String> body) {
        return service.broadcast(
                body.get("title"),
                body.get("body"),
                PlatformNotificationType.valueOf(body.getOrDefault("type", "ANNOUNCEMENT")),
                BroadcastAudience.valueOf(body.getOrDefault("audience", "ALL"))
        );
    }

    @GetMapping("/history")
    public List<PlatformNotification> history() { return service.history(); }
}
