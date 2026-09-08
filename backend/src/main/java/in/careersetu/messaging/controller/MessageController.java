package in.careersetu.messaging.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.messaging.dto.MessageDtos;
import in.careersetu.messaging.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@Tag(name = "Messaging", description = "Direct student, recruiter, and mentor conversation threads")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get all conversation threads for logged-in user")
    public ResponseEntity<List<MessageDtos.ConversationSummary>> getConversations(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        return ResponseEntity.ok(messageService.getUserConversations(principal.userId()));
    }

    @GetMapping("/thread/{conversationId}")
    @Operation(summary = "Get full message thread for a conversation")
    public ResponseEntity<List<MessageDtos.MessageResponse>> getThread(
            @PathVariable String conversationId) {
        return ResponseEntity.ok(messageService.getConversationMessages(conversationId));
    }

    @PostMapping("/send")
    @Operation(summary = "Send a direct message")
    public ResponseEntity<MessageDtos.MessageResponse> sendMessage(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @RequestBody MessageDtos.SendMessageRequest req) {
        return ResponseEntity.ok(messageService.sendMessage(principal.userId(), req));
    }

    @PatchMapping("/read/{conversationId}")
    @Operation(summary = "Mark conversation thread as read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal CareerSetuPrincipal principal,
            @PathVariable String conversationId) {
        messageService.markAsRead(conversationId, principal.userId());
        return ResponseEntity.ok().build();
    }
}
