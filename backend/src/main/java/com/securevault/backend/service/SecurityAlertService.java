package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.SecurityAlertRepository;
import com.securevault.backend.repository.UserRepository;

@Service
public class SecurityAlertService {

    private static final int ALERT_WINDOW_MINUTES = 10;

    private final SecurityAlertRepository securityAlertRepository;
    private final UserRepository userRepository;

    public SecurityAlertService(
            SecurityAlertRepository securityAlertRepository,
            UserRepository userRepository) {

        this.securityAlertRepository = securityAlertRepository;
        this.userRepository = userRepository;
    }

    // Create security alert from suspicious activity
    public SecurityAlert createAlert(
            SuspiciousActivity suspiciousActivity) {

        User user = suspiciousActivity.getUser();

        LocalDateTime windowStart =
                LocalDateTime.now()
                        .minusMinutes(ALERT_WINDOW_MINUTES);

        // Check for a recently created alert of the
        // same type for this user
        List<SecurityAlert> existingAlerts =
                securityAlertRepository
                        .findByUserOrderByCreatedAtDesc(user);

        for (SecurityAlert existingAlert : existingAlerts) {

            if (existingAlert.getAlertType()
                    .equals(suspiciousActivity.getActivityType())
                    && existingAlert.getCreatedAt()
                    .isAfter(windowStart)) {

                // Return existing alert instead of
                // creating a duplicate
                return existingAlert;
            }
        }

        // Create new security alert
        SecurityAlert alert =
                new SecurityAlert();

        alert.setUser(user);

        alert.setAlertType(
                suspiciousActivity.getActivityType()
        );

        alert.setMessage(
                suspiciousActivity.getDescription()
        );

        alert.setSeverity("HIGH");

        alert.setCreatedAt(
                LocalDateTime.now()
        );

        alert.setStatus("UNREAD");

        return securityAlertRepository.save(alert);
    }

    // Get security alerts for a specific user
    public List<SecurityAlert> getAlerts(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return securityAlertRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    // Get all security alerts
    public List<SecurityAlert> getAllAlerts() {

        return securityAlertRepository
                .findAllByOrderByCreatedAtDesc();
    }
}