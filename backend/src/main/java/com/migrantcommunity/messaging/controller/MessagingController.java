package com.migrantcommunity.messaging.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.messaging.dto.ConversationSummary;
import com.migrantcommunity.messaging.dto.CreateConversationRequest;
import com.migrantcommunity.messaging.dto.MessageDto;
import com.migrantcommunity.messaging.dto.SendMessageRequest;
import com.migrantcommunity.messaging.service.MessagingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** REST entry point for messaging endpoints. */
@RestController
@RequestMapping("/v1/messaging")
@Tag(name = "Messaging", description = "One-to-one messaging")
public class MessagingController {

    private final MessagingService messagingService;

    public MessagingController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @GetMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<ConversationSummary>>> conversations(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ConversationSummary> page = messagingService.conversations(pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Conversations retrieved"));
    }

    @PostMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ConversationSummary>> createConversation(
            @Valid @RequestBody CreateConversationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                messagingService.createConversation(request.userId()), "Conversation ready"));
    }

    @GetMapping("/conversations/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<MessageDto>>> history(
            @PathVariable Long id, @PageableDefault(size = 50) Pageable pageable) {
        Page<MessageDto> page = messagingService.history(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Messages retrieved"));
    }

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MessageDto>> send(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                messagingService.send(request.conversationId(), request.content()), "Message sent"));
    }

    @PostMapping("/conversations/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        messagingService.markRead(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Marked as read"));
    }

    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.ok(messagingService.totalUnreadCount(), "Unread count"));
    }
}
