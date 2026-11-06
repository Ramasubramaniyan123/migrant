package com.migrantcommunity.notification.dto;

/** A single in-app notification. */
public record NotificationResponse(String id, String type, String message, boolean read) {
}
