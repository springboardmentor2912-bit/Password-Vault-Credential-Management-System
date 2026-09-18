package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.entity.SuspiciousActivity;
import com.securevault.entity.User;
import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.LoginActivityRepository;
import com.securevault.repository.SuspiciousActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuspiciousActivityService {

    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final AuditLogRepository auditLogRepository;
    private final SecurityAlertService securityAlertService;

    private static final int FAILED_ATTEMPT_THRESHOLD = 5;
    private static final int TIME_WINDOW_MINUTES = 5;


    public void analyzeLoginActivity(User user) {

        System.out.println("====================================");
        System.out.println("SUSPICIOUS ACTIVITY CHECK STARTED");
        System.out.println("User = " + user.getEmail());

        LocalDateTime timeLimit =
                LocalDateTime.now()
                        .minusMinutes(TIME_WINDOW_MINUTES);

        long failedAttempts =
                loginActivityRepository
                        .countByUserAndStatusAndLoginTimeAfter(
                                user,
                                "FAILED",
                                timeLimit
                        );

        System.out.println(
                "Failed attempts in last "
                        + TIME_WINDOW_MINUTES
                        + " minutes = "
                        + failedAttempts
        );


        /*
         * Trigger the security workflow only when the
         * threshold is reached for the first time.
         *
         * This prevents alerts/emails from being sent
         * repeatedly on the 6th, 7th, 8th... failed attempt.
         */
        if (failedAttempts == FAILED_ATTEMPT_THRESHOLD) {

            System.out.println("🚨 SUSPICIOUS ACTIVITY DETECTED");

            LocalDateTime now = LocalDateTime.now();


            // =====================================================
            // 1. CREATE SUSPICIOUS ACTIVITY
            // =====================================================

            SuspiciousActivity activity =
                    new SuspiciousActivity();

            activity.setUser(user);

            activity.setActivityType(
                    "MULTIPLE_FAILED_LOGINS"
            );

            String activityMessage =
                    failedAttempts
                            + " failed login attempts detected within "
                            + TIME_WINDOW_MINUTES
                            + " minutes.";

            activity.setDescription(activityMessage);

            activity.setDetectedAt(now);

            activity.setStatus("OPEN");

            suspiciousActivityRepository.save(activity);

            System.out.println(
                    "✅ SUSPICIOUS ACTIVITY SAVED"
            );


            // =====================================================
            // 2. CREATE SECURITY ALERT
            //    + IN-APP NOTIFICATION
            //    + EMAIL
            // =====================================================

            securityAlertService.createMultipleFailedLoginAlert(
                    user,
                    failedAttempts
            );

            System.out.println(
                    "🚨 SECURITY ALERT + NOTIFICATION + EMAIL CREATED"
            );


            // =====================================================
            // 3. CREATE AUDIT LOG
            // =====================================================

            AuditLog auditLog =
                    new AuditLog();

            auditLog.setUser(user);

            auditLog.setAction(
                    "SUSPICIOUS_ACTIVITY"
            );

            auditLog.setDescription(
                    activityMessage
            );

            auditLog.setTimestamp(now);

            auditLogRepository.save(auditLog);

            System.out.println(
                    "📋 AUDIT LOG CREATED"
            );


            // =====================================================
            // 4. AUDIT SECURITY ALERT CREATION
            // =====================================================

            AuditLog alertAuditLog =
                    new AuditLog();

            alertAuditLog.setUser(user);

            alertAuditLog.setAction(
                    "SECURITY_ALERT_CREATED"
            );

            alertAuditLog.setDescription(
                    "HIGH severity security alert created for multiple failed login attempts."
            );

            alertAuditLog.setTimestamp(now);

            auditLogRepository.save(alertAuditLog);

            System.out.println(
                    "📋 SECURITY ALERT AUDIT LOG CREATED"
            );

        } else {

            System.out.println(
                    "Normal activity - threshold not reached"
            );
        }


        System.out.println(
                "SUSPICIOUS ACTIVITY CHECK FINISHED"
        );

        System.out.println(
                "===================================="
        );
    }


    // =========================================================
    // GET ALL SUSPICIOUS ACTIVITIES
    // =========================================================

    public List<SuspiciousActivity> getAllSuspiciousActivities() {

        return suspiciousActivityRepository
                .findAllByOrderByDetectedAtDesc();
    }


    // =========================================================
    // GET USER SUSPICIOUS ACTIVITIES
    // =========================================================

    public List<SuspiciousActivity> getUserSuspiciousActivities(
            User user
    ) {

        return suspiciousActivityRepository
                .findByUserOrderByDetectedAtDesc(user);
    }
}