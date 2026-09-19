package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.entity.Notification;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.NotificationRepository;
import com.securevault.backend.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // Create notification using email
    // =====================================================

    public Notification createNotification(
            String email,
            String type,
            String title,
            String message) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return createNotification(
                user,
                type,
                title,
                message
        );
    }

    // =====================================================
    // Create notification using User
    // =====================================================

    public Notification createNotification(
            User user,
            String type,
            String title,
            String message) {

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setType(type);

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        notification.setRead(false);

        return notificationRepository.save(
                notification
        );
    }

    // =====================================================
    // Get all notifications for a user
    // =====================================================

    public List<Notification> getUserNotifications(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    // =====================================================
    // Get unread notifications
    // =====================================================

    public List<Notification> getUnreadNotifications(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(
                        user
                );
    }

    // =====================================================
    // Get unread notification count
    // =====================================================

    public long getUnreadCount(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .countByUserAndIsReadFalse(user);
    }

    // =====================================================
    // Mark notification as read
    // =====================================================

    public Notification markAsRead(
            Long notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setRead(true);

        return notificationRepository.save(
                notification
        );
    }
}