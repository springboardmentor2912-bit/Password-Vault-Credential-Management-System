package com.securevault.service;

import com.securevault.entity.Notification;
import com.securevault.entity.NotificationType;
import com.securevault.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Create and save a notification
    public Notification createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message
    ) {

        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .build();

        return notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<Notification> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get unread notifications
    public List<Notification> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // Get unread notification count
    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }

    // Mark notification as read
    public Notification markAsRead(Long notificationId, Long userId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Notification not found"
                        )
                );

        // Make sure one user cannot mark another user's
        // notification as read.
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have permission to access this notification"
            );
        }

        notification.setRead(true);

        return notificationRepository.save(notification);
    }
}
