package com.securevault.service;

import com.securevault.entity.NotificationType;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class PasswordExpirationService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    // Password is considered old after 90 days.
    private static final long PASSWORD_EXPIRATION_DAYS = 90;

    public void checkPasswordExpiration(User user) {

        if (user.getPasswordUpdatedAt() == null) {
            return;
        }

        long daysSincePasswordChange =
                ChronoUnit.DAYS.between(
                        user.getPasswordUpdatedAt(),
                        LocalDateTime.now()
                );

        if (daysSincePasswordChange >= PASSWORD_EXPIRATION_DAYS) {

            String message =
                    "Your SecureVault password has not been changed for "
                            + daysSincePasswordChange
                            + " days. Please update your password.";

            // Create in-app notification
            notificationService.createNotification(
                    user.getId(),
                    NotificationType.PASSWORD_EXPIRATION,
                    "Password Update Required",
                    message
            );

            // Send email notification
            emailService.sendPasswordExpirationNotification(
                    user.getEmail(),
                    user.getFullName(),
                    daysSincePasswordChange
            );
        }
    }
}