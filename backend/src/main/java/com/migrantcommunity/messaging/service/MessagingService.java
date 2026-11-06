package com.migrantcommunity.messaging.service;

import com.migrantcommunity.messaging.dto.MessagingResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder messaging logic for the prototype. */
@Service
public class MessagingService {

    /**
     * Returns placeholder conversations.
     * The real implementation will read the conversations table from the database.
     */
    public List<MessagingResponse> conversations() {
        return List.of(
                new MessagingResponse("cnv_001", List.of("usr_001", "usr_002"), 2),
                new MessagingResponse("cnv_002", List.of("usr_001", "usr_003"), 0));
    }

    /**
     * Returns the placeholder result of sending a message.
     * The real implementation will persist the message and push it over
     * WebSocket in real time.
     */
    public MessagingResponse send(String conversationId, String content) {
        return new MessagingResponse(conversationId, List.of("usr_001", "usr_002"), 0);
    }
}
