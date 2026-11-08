package com.migrantcommunity.messaging.websocket;

import com.migrantcommunity.messaging.dto.MessageDto;
import com.migrantcommunity.messaging.service.MessagingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Pushes persisted messages and notifications to connected WebSocket clients.
 * Clients subscribe to /user/queue/messages and /user/queue/notifications.
 */
@Component
public class MessagingWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(MessagingWebSocketHandler.class);

    private final SimpMessagingTemplate messagingTemplate;

    public MessagingWebSocketHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void onMessageSent(MessagingService.MessageSentEvent event) {
        try {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(event.recipientId()), "/queue/messages", event.message());
        } catch (Exception ex) {
            log.warn("Failed to push message over WebSocket: {}", ex.getMessage());
        }
    }
}
