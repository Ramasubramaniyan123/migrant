package com.migrantcommunity.notification.service;

import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.notification.dto.NotificationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder notification logic for the prototype. */
@Service
public class NotificationService {

    /**
     * Returns placeholder notifications.
     * The real implementation will read the notifications table from the database,
     * filtered by the authenticated user.
     */
    public List<NotificationResponse> notifications() {
        return List.of(
                new NotificationResponse("ntf_001", NotificationType.CONNECTION_REQUEST.name(), "You have a new connection request.", false),
                new NotificationResponse("ntf_002", NotificationType.MESSAGE.name(), "You have a new message.", true));
    }
}
