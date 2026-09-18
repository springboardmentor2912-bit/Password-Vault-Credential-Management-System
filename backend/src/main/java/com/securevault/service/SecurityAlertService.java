package com.securevault.service;

import com.securevault.entity.NotificationType;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.User;
import com.securevault.repository.SecurityAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public List<SecurityAlert> getAllSecurityAlerts() {
        return securityAlertRepository
                .findAllByOrderByCreatedAtDesc();
    }

    public SecurityAlert createMultipleFailedLoginAlert(
            User user,
            long failedAttempts
    ) {

        String alertMessage =
                failedAttempts +
                        " failed login attempts detected within 10 minutes.";

        SecurityAlert alert = SecurityAlert.builder()
                .user(user)
                .alertType("MULTIPLE_FAILED_LOGINS")
                .message(alertMessage)
                .severity("HIGH")
                .createdAt(LocalDateTime.now())
                .status("OPEN")
                .build();

        SecurityAlert savedAlert =
                securityAlertRepository.save(alert);

        // Create in-app notification
        notificationService.createNotification(
                user.getId(),
                NotificationType.MULTIPLE_FAILED_LOGINS,
                "Multiple Failed Login Attempts",
                alertMessage
        );

        // Send email notification
        emailService.sendSecurityAlertNotification(
                user.getEmail(),
                user.getFullName(),
                alertMessage
        );

        return savedAlert;
    }
}