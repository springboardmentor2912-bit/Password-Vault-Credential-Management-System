package com.securevault.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.dto.NotificationResponse;
import com.securevault.backend.entity.Notification;
import com.securevault.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    // Convert Notification entity to safe response
    private NotificationResponse toResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getCreatedAt(),
                notification.isRead()
        );
    }

    // Create notification
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @RequestParam String email,
            @RequestParam String type,
            @RequestParam String title,
            @RequestParam String message) {

        Notification notification =
                notificationService.createNotification(
                        email,
                        type,
                        title,
                        message
                );

        return ResponseEntity.ok(toResponse(notification));
    }

    // Get all notifications
    @GetMapping("/{email}")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @PathVariable String email) {

        List<NotificationResponse> response =
                notificationService.getUserNotifications(email)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // Get unread notifications
    @GetMapping("/{email}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @PathVariable String email) {

        List<NotificationResponse> response =
                notificationService.getUnreadNotifications(email)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // Get unread notification count
    @GetMapping("/{email}/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable String email) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(email)
        );
    }

    // Mark notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id) {

        Notification notification =
                notificationService.markAsRead(id);

        return ResponseEntity.ok(toResponse(notification));
    }
}