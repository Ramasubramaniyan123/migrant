package com.migrantcommunity.notification.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.notification.dto.NotificationResponse;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Notification management endpoints")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my notifications")
    public ResponseEntity<ApiResponse<PageResult<NotificationResponse>>> getNotifications(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(
            principal.getUser().getId(),
            pageable
        );
        
        return ResponseEntity.ok(ApiResponse.ok(
            PageResult.of(notifications.getContent(), notifications.getNumber(),
                         notifications.getSize(), notifications.getTotalElements()),
            "Notifications retrieved"
        ));
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread notifications")
    public ResponseEntity<ApiResponse<PageResult<NotificationResponse>>> getUnreadNotifications(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        Page<NotificationResponse> notifications = notificationService.getUnreadNotifications(
            principal.getUser().getId(),
            pageable
        );
        
        return ResponseEntity.ok(ApiResponse.ok(
            PageResult.of(notifications.getContent(), notifications.getNumber(),
                         notifications.getSize(), notifications.getTotalElements()),
            "Unread notifications retrieved"
        ));
    }

    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        long count = notificationService.getUnreadCount(principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(count, "Unread count retrieved"));
    }

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        notificationService.markAsRead(notificationId, principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(null, "Notification marked as read"));
    }

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        notificationService.markAllAsRead(principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(null, "All notifications marked as read"));
    }

    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete notification")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        notificationService.deleteNotification(notificationId, principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(null, "Notification deleted"));
    }
}
