package com.securevault.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.dto.LoginActivityReportResponse;
import com.securevault.backend.dto.LoginActivityResponse;
import com.securevault.backend.dto.PasswordHealthResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.utils.AESUtil;

@Service
public class ReportService {

    private final CredentialRepository credentialRepository;

    private final UserRepository userRepository;

    private final LoginActivityService loginActivityService;


    public ReportService(
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            LoginActivityService loginActivityService) {

        this.credentialRepository = credentialRepository;

        this.userRepository = userRepository;

        this.loginActivityService = loginActivityService;
    }


    // ==========================================
    // PASSWORD HEALTH REPORT
    // ==========================================

    public PasswordHealthResponse getPasswordHealthReport(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        List<Credential> credentials =
                credentialRepository.findByUser(user);


        long totalCredentials =
                credentials.size();

        long strongPasswords = 0;

        long mediumPasswords = 0;

        long weakPasswords = 0;


        // Check password strength
        for (Credential credential : credentials) {

            try {

                String encryptedPassword =
                        credential.getPassword();

                String password =
                        AESUtil.decrypt(
                                encryptedPassword
                        );


                String strength =
                        checkPasswordStrength(password);


                if (strength.equals("Strong")) {

                    strongPasswords++;

                }
                else if (strength.equals("Medium")) {

                    mediumPasswords++;

                }
                else {

                    weakPasswords++;

                }

            }
            catch (Exception e) {

                // If password cannot be decrypted,
                // consider it weak for reporting.

                weakPasswords++;

            }

        }


        // ==========================================
        // CALCULATE PERCENTAGES
        // ==========================================

        double strongPercentage = 0;

        double mediumPercentage = 0;

        double weakPercentage = 0;


        if (totalCredentials > 0) {

            strongPercentage =
                    (strongPasswords * 100.0)
                    / totalCredentials;

            mediumPercentage =
                    (mediumPasswords * 100.0)
                    / totalCredentials;

            weakPercentage =
                    (weakPasswords * 100.0)
                    / totalCredentials;

        }


        // ==========================================
        // CALCULATE HEALTH SCORE
        // ==========================================

        /*
         * Strong = 100 points
         * Medium = 60 points
         * Weak = 20 points
         */

        double healthScore = 0;


        if (totalCredentials > 0) {

            healthScore =
                    (
                        (strongPasswords * 100.0)
                        +
                        (mediumPasswords * 60.0)
                        +
                        (weakPasswords * 20.0)
                    )
                    / totalCredentials;

        }


        // Round values to 2 decimal places

        strongPercentage =
                Math.round(strongPercentage * 100.0)
                / 100.0;

        mediumPercentage =
                Math.round(mediumPercentage * 100.0)
                / 100.0;

        weakPercentage =
                Math.round(weakPercentage * 100.0)
                / 100.0;

        healthScore =
                Math.round(healthScore * 100.0)
                / 100.0;


        return new PasswordHealthResponse(

                totalCredentials,

                strongPasswords,

                mediumPasswords,

                weakPasswords,

                strongPercentage,

                mediumPercentage,

                weakPercentage,

                healthScore

        );

    }


    // ==========================================
    // PASSWORD STRENGTH CHECKER
    // ==========================================

    private String checkPasswordStrength(
            String password) {

        int score = 0;


        if (password == null) {

            return "Weak";

        }


        if (password.length() >= 8) {

            score++;

        }


        if (password.matches(
                ".*[A-Z].*")) {

            score++;

        }


        if (password.matches(
                ".*[a-z].*")) {

            score++;

        }


        if (password.matches(
                ".*[0-9].*")) {

            score++;

        }


        if (password.matches(
                ".*[@#$%&*!?].*")) {

            score++;

        }


        if (score <= 2) {

            return "Weak";

        }
        else if (score <= 4) {

            return "Medium";

        }
        else {

            return "Strong";

        }

    }


    // ==========================================
    // LOGIN ACTIVITY REPORT
    // ==========================================

    public LoginActivityReportResponse
            getLoginActivityReport(
                    String email) {

        // ==========================================
        // VALIDATE USER
        // ==========================================

        userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // ==========================================
        // GET LOGIN ACTIVITIES
        // ==========================================

        List<LoginActivityResponse>
                activities =
                loginActivityService
                        .getLoginActivities(email);


        long totalAttempts =
                activities.size();


        long successfulLogins = 0;

        long failedLogins = 0;


        for (LoginActivityResponse activity
                : activities) {

            if (activity.getStatus()
                    .equalsIgnoreCase("SUCCESS")) {

                successfulLogins++;

            }
            else if (activity.getStatus()
                    .equalsIgnoreCase("FAILED")) {

                failedLogins++;

            }

        }


        // ==========================================
        // CALCULATE LOGIN PERCENTAGES
        // ==========================================

        double successfulPercentage = 0;

        double failedPercentage = 0;


        if (totalAttempts > 0) {

            successfulPercentage =
                    (successfulLogins * 100.0)
                    / totalAttempts;

            failedPercentage =
                    (failedLogins * 100.0)
                    / totalAttempts;

        }


        successfulPercentage =
                Math.round(
                        successfulPercentage * 100.0
                ) / 100.0;


        failedPercentage =
                Math.round(
                        failedPercentage * 100.0
                ) / 100.0;


        // ==========================================
        // RECENT LOGIN ACTIVITIES
        // ==========================================

        // Show only 10 recent activities

        List<LoginActivityResponse>
                recentActivities =
                activities.stream()
                        .limit(10)
                        .toList();


        // ==========================================
        // RETURN REPORT
        // ==========================================

        return new LoginActivityReportResponse(

                totalAttempts,

                successfulLogins,

                failedLogins,

                successfulPercentage,

                failedPercentage,

                recentActivities

        );

    }

}