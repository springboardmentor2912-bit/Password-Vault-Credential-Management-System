package com.securevault.service;

import com.securevault.dto.LoginActivityReportResponse;
import com.securevault.dto.PasswordHealthReportResponse;
import com.securevault.entity.LoginActivity;
import com.securevault.entity.User;
import com.securevault.entity.VaultEntry;
import com.securevault.repository.LoginActivityRepository;
import com.securevault.repository.UserRepository;
import com.securevault.util.PasswordStrengthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final UserRepository userRepository;
    private final VaultService vaultService;
    private final LoginActivityRepository loginActivityRepository;


    // ==============================
    // PASSWORD HEALTH REPORT
    // ==============================

    public PasswordHealthReportResponse getPasswordHealthReport(
            String email
    ) {

        // Get the user's actual vault credentials
        List<VaultEntry> entries =
                vaultService.getAllEntries(email);

        long strongPasswords = 0;
        long mediumPasswords = 0;
        long weakPasswords = 0;

        // Analyze every password
        for (VaultEntry entry : entries) {

            String password = entry.getPassword();

            PasswordStrengthUtil.Strength strength =
                    PasswordStrengthUtil.check(password);

            if (strength ==
                    PasswordStrengthUtil.Strength.STRONG) {

                strongPasswords++;

            } else if (strength ==
                    PasswordStrengthUtil.Strength.MEDIUM) {

                mediumPasswords++;

            } else {

                weakPasswords++;
            }
        }

        long totalCredentials = entries.size();

        /*
         * Health score:
         *
         * Strong = 100 points
         * Medium = 60 points
         * Weak   = 20 points
         *
         * The final score is the average
         * across all credentials.
         */

        double healthScore = 0;

        if (totalCredentials > 0) {

            healthScore =
                    (
                            (strongPasswords * 100.0)
                                    + (mediumPasswords * 60.0)
                                    + (weakPasswords * 20.0)
                    )
                            / totalCredentials;
        }

        // Round to 2 decimal places
        healthScore =
                Math.round(healthScore * 100.0) / 100.0;

        return new PasswordHealthReportResponse(
                totalCredentials,
                strongPasswords,
                mediumPasswords,
                weakPasswords,
                healthScore
        );
    }


    // ==============================
    // LOGIN ACTIVITY REPORT
    // ==============================

    public LoginActivityReportResponse getLoginActivityReport(
            String email
    ) {

        // Find the logged-in user
        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        // Get existing login activities from PostgreSQL
        List<LoginActivity> activities =
                loginActivityRepository
                        .findByUserOrderByLoginTimeDesc(user);

        // Total attempts
        long totalAttempts = activities.size();

        // Successful attempts
        long successfulLogins =
                activities.stream()
                        .filter(activity ->
                                "SUCCESS".equalsIgnoreCase(
                                        activity.getStatus()
                                )
                        )
                        .count();

        // Failed attempts
        long failedLogins =
                activities.stream()
                        .filter(activity ->
                                "FAILED".equalsIgnoreCase(
                                        activity.getStatus()
                                )
                        )
                        .count();


        /*
         * Return only the 10 most recent activities.
         *
         * We intentionally do NOT return the complete
         * LoginActivity entity because it contains a
         * User object and we don't want sensitive
         * User information such as password hashes
         * or OTP values exposed in the report API.
         */

        List<Map<String, Object>> recentLoginActivities =
                activities.stream()
                        .limit(10)
                        .map(activity -> {

                            Map<String, Object> item =
                                    new LinkedHashMap<>();

                            item.put(
                                    "email",
                                    activity.getEmail()
                            );

                            item.put(
                                    "status",
                                    activity.getStatus()
                            );

                            item.put(
                                    "loginTime",
                                    activity.getLoginTime()
                            );

                            return item;
                        })
                        .toList();


        return new LoginActivityReportResponse(
                totalAttempts,
                successfulLogins,
                failedLogins,
                recentLoginActivities
        );
    }
}