package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.entity.LoginActivity;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.SuspiciousActivity;
import com.securevault.entity.User;
import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.LoginActivityRepository;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SuspiciousActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityAnalyticsService {

    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final AuditLogRepository auditLogRepository;

    public SecurityAnalyticsData getAnalytics(User user) {

        long totalLogins =
                loginActivityRepository.countByUser(user);

        long successfulLogins =
                loginActivityRepository.countByUserAndStatus(
                        user,
                        "SUCCESS"
                );

        long failedLogins =
                loginActivityRepository.countByUserAndStatus(
                        user,
                        "FAILED"
                );

        long suspiciousActivities =
                suspiciousActivityRepository.countByUser(user);

        long securityAlerts =
                securityAlertRepository.countByUser(user);

        List<LoginActivityResponse> loginActivities =
                loginActivityRepository
                        .findByUserOrderByLoginTimeDesc(user)
                        .stream()
                        .map(activity -> new LoginActivityResponse(
                                activity.getId(),
                                activity.getEmail(),
                                activity.getStatus(),
                                activity.getLoginTime()
                        ))
                        .toList();

        List<SuspiciousActivityResponse> suspiciousActivityList =
                suspiciousActivityRepository
                        .findByUserOrderByDetectedAtDesc(user)
                        .stream()
                        .map(activity -> new SuspiciousActivityResponse(
                                activity.getId(),
                                activity.getActivityType(),
                                activity.getDescription(),
                                activity.getDetectedAt(),
                                activity.getStatus()
                        ))
                        .toList();

        List<SecurityAlertResponse> securityAlertList =
                securityAlertRepository
                        .findByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(alert -> new SecurityAlertResponse(
                                alert.getId(),
                                alert.getAlertType(),
                                alert.getMessage(),
                                alert.getSeverity(),
                                alert.getCreatedAt(),
                                alert.getStatus()
                        ))
                        .toList();

        List<AuditLogResponse> auditLogList =
                auditLogRepository
                        .findByUserOrderByTimestampDesc(user)
                        .stream()
                        .map(log -> new AuditLogResponse(
                                log.getId(),
                                log.getAction(),
                                log.getDescription(),
                                log.getTimestamp()
                        ))
                        .toList();

        return new SecurityAnalyticsData(
                totalLogins,
                successfulLogins,
                failedLogins,
                suspiciousActivities,
                securityAlerts,
                loginActivities,
                suspiciousActivityList,
                securityAlertList,
                auditLogList
        );
    }

    public record SecurityAnalyticsData(
            long totalLogins,
            long successfulLogins,
            long failedLogins,
            long suspiciousActivities,
            long securityAlerts,
            List<LoginActivityResponse> recentLoginActivities,
            List<SuspiciousActivityResponse> recentSuspiciousActivities,
            List<SecurityAlertResponse> recentSecurityAlerts,
            List<AuditLogResponse> recentAuditLogs
    ) {
    }

    public record LoginActivityResponse(
            Long id,
            String email,
            String status,
            LocalDateTime loginTime
    ) {
    }

    public record SuspiciousActivityResponse(
            Long id,
            String activityType,
            String description,
            LocalDateTime detectedAt,
            String status
    ) {
    }

    public record SecurityAlertResponse(
            Long id,
            String alertType,
            String message,
            String severity,
            LocalDateTime createdAt,
            String status
    ) {
    }

    public record AuditLogResponse(
            Long id,
            String action,
            String description,
            LocalDateTime timestamp
    ) {
    }
}