package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.LoginStatus;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.SuspiciousActivityStatus;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.repository.SuspiciousActivityRepository;
import com.securevault.backend.repository.UserRepository;

@Service
public class SuspiciousActivityService {

    private static final int FAILED_LOGIN_THRESHOLD = 5;
    private static final int TIME_WINDOW_MINUTES = 10;

    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final UserRepository userRepository;

    private final SecurityAlertService securityAlertService;
    private final AuditLogService auditLogService;

    // Notification Module
    private final NotificationService notificationService;
    private final EmailService emailService;

    public SuspiciousActivityService(
            LoginActivityRepository loginActivityRepository,
            SuspiciousActivityRepository suspiciousActivityRepository,
            UserRepository userRepository,
            SecurityAlertService securityAlertService,
            AuditLogService auditLogService,
            NotificationService notificationService,
            EmailService emailService) {

        this.loginActivityRepository = loginActivityRepository;
        this.suspiciousActivityRepository = suspiciousActivityRepository;
        this.userRepository = userRepository;

        this.securityAlertService = securityAlertService;
        this.auditLogService = auditLogService;

        // Notification Module
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    // =====================================================
    // Analyze login activities for a user
    // =====================================================

    public SuspiciousActivity analyzeActivity(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime windowStart =
                now.minusMinutes(TIME_WINDOW_MINUTES);

        List<LoginActivity> activities =
                loginActivityRepository
                        .findByEmailOrderByTimestampDesc(email);

        long failedAttempts = activities.stream()
                .filter(activity ->
                        activity.getStatus() == LoginStatus.FAILED)
                .filter(activity ->
                        !activity.getTimestamp()
                                .isBefore(windowStart))
                .count();

        // =====================================================
        // Suspicious activity not detected
        // =====================================================

        if (failedAttempts < FAILED_LOGIN_THRESHOLD) {
            return null;
        }

        // =====================================================
        // Check whether suspicious activity was already
        // created recently for this user
        // =====================================================

        List<SuspiciousActivity> existingActivities =
                suspiciousActivityRepository
                        .findByUserOrderByDetectedAtDesc(user);

        if (!existingActivities.isEmpty()) {

            SuspiciousActivity latest =
                    existingActivities.get(0);

            if (latest.getDetectedAt()
                    .isAfter(windowStart)) {

                return latest;
            }
        }

        // =====================================================
        // Create suspicious activity
        // =====================================================

        SuspiciousActivity suspiciousActivity =
                new SuspiciousActivity();

        suspiciousActivity.setUser(user);

        suspiciousActivity.setActivityType(
                "MULTIPLE_FAILED_LOGINS"
        );

        suspiciousActivity.setDescription(
                failedAttempts
                        + " failed login attempts detected within "
                        + TIME_WINDOW_MINUTES
                        + " minutes"
        );

        suspiciousActivity.setDetectedAt(now);

        suspiciousActivity.setStatus(
                SuspiciousActivityStatus.FLAGGED
        );

        SuspiciousActivity savedActivity =
                suspiciousActivityRepository.save(
                        suspiciousActivity
                );

        // =====================================================
        // Create Security Alert automatically
        // =====================================================

        securityAlertService.createAlert(savedActivity);

        // =====================================================
        // Create Audit Log automatically
        // =====================================================

        auditLogService.createLog(
                user.getId(),
                "SUSPICIOUS_ACTIVITY",
                savedActivity.getDescription()
        );

        // =====================================================
        // NOTIFICATION MODULE
        // =====================================================

        // Create in-app security notification
        notificationService.createNotification(
                user,
                "SECURITY_ALERT",
                "Suspicious Activity Detected",
                "Multiple failed login attempts were detected on your SecureVault account."
        );

        // =====================================================
        // Send security alert email
        // =====================================================

        emailService.sendSecurityAlertEmail(
                user.getEmail(),
                user.getUsername(),
                savedActivity.getDescription()
        );

        return savedActivity;
    }

    // =====================================================
    // Get suspicious activities for a user
    // =====================================================

    public List<SuspiciousActivity>
            getSuspiciousActivities(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return suspiciousActivityRepository
                .findByUserOrderByDetectedAtDesc(user);
    }

    // =====================================================
    // Get all suspicious activities
    // =====================================================

    public List<SuspiciousActivity>
            getAllSuspiciousActivities() {

        return suspiciousActivityRepository
                .findAllByOrderByDetectedAtDesc();
    }
}