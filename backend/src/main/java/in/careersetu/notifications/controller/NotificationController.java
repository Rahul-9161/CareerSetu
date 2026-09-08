package in.careersetu.notifications.controller;

import in.careersetu.common.security.CareerSetuPrincipal;
import in.careersetu.notifications.entity.AppNotification;
import in.careersetu.notifications.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "In-app notifications and user alert updates")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/my")
    @Operation(summary = "Get notifications for logged-in user")
    public ResponseEntity<List<AppNotification>> getMyNotifications(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        String email = principal != null ? principal.email() : "student@careersetu.in";
        return ResponseEntity.ok(notificationService.getMyNotifications(email));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        String email = principal != null ? principal.email() : "student@careersetu.in";
        long unread = notificationService.getUnreadCount(email);
        return ResponseEntity.ok(Map.of("unreadCount", unread));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<AppNotification> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @AuthenticationPrincipal CareerSetuPrincipal principal) {
        String email = principal != null ? principal.email() : "student@careersetu.in";
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
