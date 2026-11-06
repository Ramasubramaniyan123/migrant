package com.migrantcommunity.notification.controller;

import com.migrantcommunity.notification.dto.NotificationResponse;
import com.migrantcommunity.notification.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** REST entry point for notification endpoints. */
@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/list")
    public List<NotificationResponse> listNotifications() {
        return notificationService.notifications();
    }
}
