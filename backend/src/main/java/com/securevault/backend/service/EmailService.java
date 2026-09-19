package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${MAIL_USERNAME:}")
    private String senderEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";


    // ==========================================
    // Common Brevo Email Sender
    // ==========================================

    private void sendBrevoEmail(
            String toEmail,
            String subject,
            String textContent) {

        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            throw new RuntimeException(
                    "BREVO_API_KEY is not configured"
            );
        }

        if (senderEmail == null || senderEmail.isBlank()) {
            throw new RuntimeException(
                    "MAIL_USERNAME is not configured"
            );
        }

        HttpHeaders headers = new HttpHeaders();

        headers.set(
                "api-key",
                brevoApiKey
        );

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.setAccept(
                java.util.List.of(
                        MediaType.APPLICATION_JSON
                )
        );


        // Sender information
        Map<String, String> sender =
                new HashMap<>();

        sender.put(
                "name",
                "SecureVault"
        );

        sender.put(
                "email",
                senderEmail
        );


        // Recipient information
        Map<String, String> recipient =
                new HashMap<>();

        recipient.put(
                "email",
                toEmail
        );


        // Brevo request body
        Map<String, Object> requestBody =
                new HashMap<>();

        requestBody.put(
                "sender",
                sender
        );

        requestBody.put(
                "to",
                java.util.List.of(recipient)
        );

        requestBody.put(
                "subject",
                subject
        );

        requestBody.put(
                "textContent",
                textContent
        );


        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(
                        requestBody,
                        headers
                );


        // Send email using Brevo HTTPS API
        restTemplate.postForEntity(
                BREVO_API_URL,
                request,
                String.class
        );
    }


    // ==========================================
    // Password Reset OTP Email
    // ==========================================

    public void sendOtpEmail(
            String toEmail,
            String otp) {

        String subject =
                "SecureVault Password Reset OTP";

        String textContent =
                "Your SecureVault password reset OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for a limited time."
                        + "\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email.";

        try {

            sendBrevoEmail(
                    toEmail,
                    subject,
                    textContent
            );

            System.out.println(
                    "OTP email sent successfully to: "
                            + toEmail
            );

        } catch (RuntimeException e) {

            System.err.println(
                    "OTP email failed: "
                            + e.getMessage()
            );

            // OTP process should report the failure
            throw new RuntimeException(
                    "Failed to send OTP email",
                    e
            );
        }
    }


    // ==========================================
    // Successful Login Notification Email
    // ==========================================

    public void sendLoginNotificationEmail(
            String toEmail,
            String username) {

        LocalDateTime loginTime =
                LocalDateTime.now();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "dd-MM-yyyy HH:mm:ss"
                );

        String formattedTime =
                loginTime.format(formatter);


        String subject =
                "SecureVault - New Login Detected";

        String textContent =
                "Hello " + username + ",\n\n"
                        + "New login detected on your SecureVault account.\n\n"
                        + "Account: " + toEmail + "\n"
                        + "Login Date & Time: "
                        + formattedTime
                        + "\n\n"
                        + "If this login was not performed by you, "
                        + "please secure your account immediately."
                        + "\n\n"
                        + "Regards,\n"
                        + "SecureVault Security Team";


        try {

            sendBrevoEmail(
                    toEmail,
                    subject,
                    textContent
            );

            System.out.println(
                    "Login notification email sent successfully to: "
                            + toEmail
            );

        } catch (RuntimeException e) {

            System.err.println(
                    "Login notification email failed: "
                            + e.getMessage()
            );

            // Do not stop the login process
        }
    }


    // ==========================================
    // Security Alert Email
    // ==========================================

    public void sendSecurityAlertEmail(
            String toEmail,
            String username,
            String description) {

        LocalDateTime alertTime =
                LocalDateTime.now();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "dd-MM-yyyy HH:mm:ss"
                );

        String formattedTime =
                alertTime.format(formatter);


        String subject =
                "SecureVault - Security Alert";

        String textContent =
                "Hello " + username + ",\n\n"
                        + "Suspicious activity was detected "
                        + "on your SecureVault account.\n\n"
                        + "Security Event: "
                        + description
                        + "\n\n"
                        + "Date & Time: "
                        + formattedTime
                        + "\n"
                        + "Account: "
                        + toEmail
                        + "\n\n"
                        + "If this activity was not performed by you, "
                        + "please secure your account immediately "
                        + "and change your password.\n\n"
                        + "Regards,\n"
                        + "SecureVault Security Team";


        try {

            sendBrevoEmail(
                    toEmail,
                    subject,
                    textContent
            );

            System.out.println(
                    "Security alert email sent successfully to: "
                            + toEmail
            );

        } catch (RuntimeException e) {

            System.err.println(
                    "Security alert email failed: "
                            + e.getMessage()
            );

            // Do not stop the security detection process
        }
    }


    // ==========================================
    // Credential Sharing Notification Email
    // ==========================================

    public void sendCredentialShareEmail(
            String toEmail,
            String recipientUsername,
            String ownerUsername,
            String permission) {

        String subject =
                "SecureVault - Credential Shared With You";

        String textContent =
                "Hello " + recipientUsername + ",\n\n"
                        + "A credential has been shared with you "
                        + "on your SecureVault account.\n\n"
                        + "Shared by: "
                        + ownerUsername
                        + "\n"
                        + "Permission: "
                        + permission
                        + "\n\n"
                        + "For security reasons, the credential password "
                        + "is not included in this email.\n\n"
                        + "Please log in to SecureVault to access the "
                        + "shared credential.\n\n"
                        + "Regards,\n"
                        + "SecureVault Security Team";


        try {

            sendBrevoEmail(
                    toEmail,
                    subject,
                    textContent
            );

            System.out.println(
                    "Credential sharing email sent successfully to: "
                            + toEmail
            );

        } catch (RuntimeException e) {

            System.err.println(
                    "Credential sharing email failed: "
                            + e.getMessage()
            );

            // Do not stop the credential sharing process
        }
    }


    // ==========================================
    // Password Expiration Notification Email
    // ==========================================

    public void sendPasswordExpirationEmail(
            String toEmail,
            String username,
            String website,
            boolean expired) {

        String subject;
        String textContent;


        // ==========================================
        // Password Already Expired
        // ==========================================

        if (expired) {

            subject =
                    "SecureVault - Password Expired";

            textContent =
                    "Hello " + username + ",\n\n"
                            + "The password for your credential "
                            + website
                            + " has expired.\n\n"
                            + "Please log in to SecureVault and "
                            + "update your password as soon as possible.\n\n"
                            + "For security reasons, your password "
                            + "is not included in this email.\n\n"
                            + "Regards,\n"
                            + "SecureVault Security Team";
        }


        // ==========================================
        // Password Expiring Soon
        // ==========================================

        else {

            subject =
                    "SecureVault - Password Expiring Soon";

            textContent =
                    "Hello " + username + ",\n\n"
                            + "The password for your credential "
                            + website
                            + " will expire soon.\n\n"
                            + "Please log in to SecureVault and "
                            + "update your password before it expires.\n\n"
                            + "For security reasons, your password "
                            + "is not included in this email.\n\n"
                            + "Regards,\n"
                            + "SecureVault Security Team";
        }


        try {

            sendBrevoEmail(
                    toEmail,
                    subject,
                    textContent
            );

            System.out.println(
                    "Password expiration email sent successfully to: "
                            + toEmail
            );

        } catch (RuntimeException e) {

            System.err.println(
                    "Password expiration email failed: "
                            + e.getMessage()
            );

            // Do not stop the application process
        }
    }
}