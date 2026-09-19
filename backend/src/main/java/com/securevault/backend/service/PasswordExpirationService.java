package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.Notification;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.UserRepository;

@Service
public class PasswordExpirationService {

    // Password expires after 90 days
    private static final int PASSWORD_EXPIRATION_DAYS = 90;

    // Notify when password has 7 days or less remaining
    private static final int EXPIRATION_WARNING_DAYS = 7;

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public PasswordExpirationService(
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            EmailService emailService) {

        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    // ==========================================
    // AUTOMATIC PASSWORD EXPIRATION CHECK
    // ==========================================

    /*
     * Runs every day at 9:00 AM
     * India Standard Time (Asia/Kolkata).
     */
    @Scheduled(
            cron = "0 0 9 * * *",
            zone = "Asia/Kolkata"
    )
    public void scheduledPasswordExpirationCheck() {

        List<User> users =
                userRepository.findAll();

        for (User user : users) {

            try {

                checkPasswordExpiration(
                        user.getEmail()
                );

            } catch (Exception e) {

                System.err.println(
                        "Password expiration check failed for user: "
                                + user.getEmail()
                                + " - "
                                + e.getMessage()
                );
            }
        }
    }

    // ==========================================
    // CHECK PASSWORD EXPIRATION
    // ==========================================

    public void checkPasswordExpiration(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        List<Credential> credentials =
                credentialRepository.findByUser(user);

        LocalDateTime now =
                LocalDateTime.now();

        for (Credential credential : credentials) {

            LocalDateTime passwordUpdatedAt =
                    credential.getPasswordUpdatedAt();

            /*
             * Existing credentials created before the
             * passwordUpdatedAt field was added may have
             * a null value. Skip them safely.
             */
            if (passwordUpdatedAt == null) {
                continue;
            }

            LocalDateTime expirationDate =
                    passwordUpdatedAt.plusDays(
                            PASSWORD_EXPIRATION_DAYS
                    );

            LocalDateTime warningDate =
                    expirationDate.minusDays(
                            EXPIRATION_WARNING_DAYS
                    );

            // ==========================================
            // PASSWORD EXPIRED
            // ==========================================

            if (!now.isBefore(expirationDate)) {

                String title =
                        "Password Expired";

                String message =
                        "The password for your credential "
                                + credential.getWebsite()
                                + " has expired. Please update it.";

                createNotificationIfNeeded(
                        user,
                        "PASSWORD_EXPIRATION",
                        title,
                        message
                );

            }

            // ==========================================
            // PASSWORD EXPIRING SOON
            // ==========================================

            else if (!now.isBefore(warningDate)) {

                String title =
                        "Password Expiring Soon";

                String message =
                        "The password for your credential "
                                + credential.getWebsite()
                                + " will expire on "
                                + expirationDate
                                + ". Please update it soon.";

                createNotificationIfNeeded(
                        user,
                        "PASSWORD_EXPIRATION",
                        title,
                        message
                );
            }
        }
    }

    // ==========================================
    // CREATE NOTIFICATION + SEND EMAIL
    // ==========================================

    private void createNotificationIfNeeded(
            User user,
            String type,
            String title,
            String message) {

        /*
         * Prevent the scheduled task from creating
         * duplicate notifications and emails every day.
         */
        List<Notification> existingNotifications =
                notificationService.getUserNotifications(
                        user.getEmail()
                );

        boolean alreadyNotified =
                existingNotifications.stream()
                        .anyMatch(notification ->
                                type.equals(
                                        notification.getType()
                                )
                                &&
                                title.equals(
                                        notification.getTitle()
                                )
                                &&
                                message.equals(
                                        notification.getMessage()
                                )
                        );

        if (alreadyNotified) {
            return;
        }

        // ==========================================
        // IN-APP NOTIFICATION
        // ==========================================

        notificationService.createNotification(
                user,
                type,
                title,
                message
        );

        // ==========================================
        // EMAIL NOTIFICATION
        // ==========================================

        boolean expired =
                title.equals("Password Expired");

        emailService.sendPasswordExpirationEmail(
                user.getEmail(),
                user.getUsername(),
                extractWebsite(message),
                expired
        );
    }

    // ==========================================
    // EXTRACT WEBSITE FROM NOTIFICATION MESSAGE
    // ==========================================

    private String extractWebsite(
            String message) {

        String prefix =
                "The password for your credential ";

        String suffixExpired =
                " has expired. Please update it.";

        String suffixWarning =
                " will expire on ";

        if (message.startsWith(prefix)) {

            String remaining =
                    message.substring(
                            prefix.length()
                    );

            if (remaining.endsWith(
                    suffixExpired)) {

                return remaining.substring(
                        0,
                        remaining.length()
                                - suffixExpired.length()
                );
            }

            int warningIndex =
                    remaining.indexOf(
                            suffixWarning
                    );

            if (warningIndex >= 0) {

                return remaining.substring(
                        0,
                        warningIndex
                );
            }
        }

        return "your credential";
    }
}