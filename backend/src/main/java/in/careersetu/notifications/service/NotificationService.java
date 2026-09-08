package in.careersetu.notifications.service;

import in.careersetu.notifications.entity.AppNotification;
import in.careersetu.notifications.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<AppNotification> getMyNotifications(String recipientEmail) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(recipientEmail);
    }

    public long getUnreadCount(String recipientEmail) {
        return notificationRepository.countByRecipientEmailAndReadStatusFalse(recipientEmail);
    }

    @Transactional
    public AppNotification markAsRead(UUID id) {
        AppNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String recipientEmail) {
        List<AppNotification> list = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(recipientEmail);
        for (AppNotification notif : list) {
            notif.setReadStatus(true);
        }
        notificationRepository.saveAll(list);
    }

    @Transactional
    public AppNotification dispatchNotification(String recipientEmail, String title, String message,
                                               String type, String priority, String actionLink) {
        AppNotification notification = new AppNotification(recipientEmail, title, message, type, priority, actionLink);
        return notificationRepository.save(notification);
    }
}
