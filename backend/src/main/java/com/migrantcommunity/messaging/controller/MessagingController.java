package com.migrantcommunity.messaging.controller;

import com.migrantcommunity.messaging.dto.MessagingResponse;
import com.migrantcommunity.messaging.service.MessagingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** REST entry point for messaging endpoints. */
@RestController
@RequestMapping("/api/messaging")
public class MessagingController {

    private final MessagingService messagingService;

    public MessagingController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @GetMapping("/conversations")
    public List<MessagingResponse> listConversations() {
        return messagingService.conversations();
    }

    @PostMapping("/send")
    public MessagingResponse sendMessage(@RequestBody Map<String, String> payload) {
        return messagingService.send(payload.get("conversationId"), payload.get("content"));
    }
}
