package com.securevault.backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.dto.SecurityAnalyticsResponse;
import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.LoginStatus;
import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.AuditLogRepository;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.repository.SecurityAlertRepository;
import com.securevault.backend.repository.SuspiciousActivityRepository;
import com.securevault.backend.repository.UserRepository;

@Service
public class SecurityAnalyticsService {

    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public SecurityAnalyticsService(
            LoginActivityRepository loginActivityRepository,
            SuspiciousActivityRepository suspiciousActivityRepository,
            SecurityAlertRepository securityAlertRepository,
            AuditLogRepository auditLogRepository,
            UserRepository userRepository) {

        this.loginActivityRepository = loginActivityRepository;
        this.suspiciousActivityRepository =
                suspiciousActivityRepository;
        this.securityAlertRepository =
                securityAlertRepository;
        this.auditLogRepository =
                auditLogRepository;
        this.userRepository = userRepository;
    }

    // Get security analytics for a specific user
    public SecurityAnalyticsResponse getAnalytics(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Get login activities
        List<LoginActivity> loginActivities =
                loginActivityRepository
                        .findByUserOrderByTimestampDesc(user);

        long totalLogins =
                loginActivities.size();

        long successfulLogins =
                loginActivities.stream()
                        .filter(activity ->
                                activity.getStatus()
                                        == LoginStatus.SUCCESS)
                        .count();

        long failedLogins =
                loginActivities.stream()
                        .filter(activity ->
                                activity.getStatus()
                                        == LoginStatus.FAILED)
                        .count();

        // Get suspicious activities
        List<SuspiciousActivity> suspiciousActivities =
                suspiciousActivityRepository
                        .findByUserOrderByDetectedAtDesc(user);

        // Get security alerts
        List<SecurityAlert> securityAlerts =
                securityAlertRepository
                        .findByUserOrderByCreatedAtDesc(user);

        // Get audit logs
        List<AuditLog> auditLogs =
                auditLogRepository
                        .findByUserOrderByTimestampDesc(user);

        // Create recent activity list
        List<SecurityAnalyticsResponse.RecentActivity>
                recentActivities = new ArrayList<>();

        // Add login activities
        for (LoginActivity activity : loginActivities) {

            String description;

            if (activity.getStatus()
                    == LoginStatus.SUCCESS) {

                description =
                        "User logged in successfully";

            } else {

                description =
                        "Failed login attempt detected";
            }

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            "LOGIN_" +
                                    activity.getStatus().name(),
                            description,
                            activity.getTimestamp().toString()
                    )
            );
        }

        // Add suspicious activities
        for (SuspiciousActivity activity :
                suspiciousActivities) {

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            activity.getActivityType(),
                            activity.getDescription(),
                            activity.getDetectedAt().toString()
                    )
            );
        }

        // Add security alerts
        for (SecurityAlert alert : securityAlerts) {

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            "SECURITY_ALERT",
                            alert.getMessage(),
                            alert.getCreatedAt().toString()
                    )
            );
        }

        // Add audit logs
        for (AuditLog log : auditLogs) {

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            log.getAction(),
                            log.getDescription(),
                            log.getTimestamp().toString()
                    )
            );
        }

        // Sort all activities by newest first
        recentActivities.sort(
                Comparator.comparing(
                        SecurityAnalyticsResponse
                                .RecentActivity::getTimestamp
                ).reversed()
        );

        // Display only latest 10 activities
        if (recentActivities.size() > 10) {

            recentActivities =
                    new ArrayList<>(
                            recentActivities.subList(0, 10)
                    );
        }

        return new SecurityAnalyticsResponse(
                totalLogins,
                successfulLogins,
                failedLogins,
                suspiciousActivities.size(),
                securityAlerts.size(),
                auditLogs.size(),
                recentActivities
        );
    }

    // Get analytics for all users
    public SecurityAnalyticsResponse getAllAnalytics() {

        List<LoginActivity> loginActivities =
                loginActivityRepository
                        .findAllByOrderByTimestampDesc();

        long totalLogins =
                loginActivities.size();

        long successfulLogins =
                loginActivities.stream()
                        .filter(activity ->
                                activity.getStatus()
                                        == LoginStatus.SUCCESS)
                        .count();

        long failedLogins =
                loginActivities.stream()
                        .filter(activity ->
                                activity.getStatus()
                                        == LoginStatus.FAILED)
                        .count();

        List<SuspiciousActivity> suspiciousActivities =
                suspiciousActivityRepository
                        .findAllByOrderByDetectedAtDesc();

        List<SecurityAlert> securityAlerts =
                securityAlertRepository
                        .findAllByOrderByCreatedAtDesc();

        List<AuditLog> auditLogs =
                auditLogRepository
                        .findAllByOrderByTimestampDesc();

        List<SecurityAnalyticsResponse.RecentActivity>
                recentActivities = new ArrayList<>();

        // Login activities
        for (LoginActivity activity : loginActivities) {

            String description =
                    activity.getStatus()
                            == LoginStatus.SUCCESS
                    ? "User logged in successfully"
                    : "Failed login attempt detected";

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            "LOGIN_" +
                                    activity.getStatus().name(),
                            description,
                            activity.getTimestamp().toString()
                    )
            );
        }

        // Suspicious activities
        for (SuspiciousActivity activity :
                suspiciousActivities) {

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            activity.getActivityType(),
                            activity.getDescription(),
                            activity.getDetectedAt().toString()
                    )
            );
        }

        // Security alerts
        for (SecurityAlert alert : securityAlerts) {

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            "SECURITY_ALERT",
                            alert.getMessage(),
                            alert.getCreatedAt().toString()
                    )
            );
        }

        // Audit logs
        for (AuditLog log : auditLogs) {

            recentActivities.add(
                    new SecurityAnalyticsResponse.RecentActivity(
                            log.getAction(),
                            log.getDescription(),
                            log.getTimestamp().toString()
                    )
            );
        }

        // Sort newest first
        recentActivities.sort(
                Comparator.comparing(
                        SecurityAnalyticsResponse
                                .RecentActivity::getTimestamp
                ).reversed()
        );

        // Latest 10 activities
        if (recentActivities.size() > 10) {

            recentActivities =
                    new ArrayList<>(
                            recentActivities.subList(0, 10)
                    );
        }

        return new SecurityAnalyticsResponse(
                totalLogins,
                successfulLogins,
                failedLogins,
                suspiciousActivities.size(),
                securityAlerts.size(),
                auditLogs.size(),
                recentActivities
        );
    }
}