package com.securevault.controller;

import com.securevault.entity.Notification;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return user.getId();
    }

    // Get all notifications
    @GetMapping
    public List<Notification> getNotifications(
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return notificationService.getUserNotifications(userId);
    }

    // Get unread notifications
    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return notificationService.getUnreadNotifications(userId);
    }

    // Get unread notification count
    @GetMapping("/unread/count")
    public long getUnreadCount(
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return notificationService.getUnreadCount(userId);
    }

    // Mark notification as read
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return notificationService.markAsRead(id, userId);
    }
}