package com.securevault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    // =========================================================
    // SEND OTP EMAIL
    // =========================================================

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "SecureVault Password Reset OTP"
        );

        message.setText(
                "Hello,\n\n" +
                        "Your OTP for SecureVault password reset is: "
                        + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\n\nDo not share this OTP with anyone." +
                        "\n\nRegards,\nSecureVault Team"
        );

        mailSender.send(message);
    }


    // =========================================================
    // SEND SUCCESSFUL LOGIN EMAIL
    // =========================================================

    public void sendLoginNotification(
            String toEmail,
            String fullName
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "SecureVault - Successful Login Detected"
        );

        message.setText(
                "Hello " + fullName + ",\n\n" +

                        "A successful login was detected on your SecureVault account.\n\n" +

                        "Account: " + toEmail + "\n" +

                        "Date & Time: " +
                        LocalDateTime.now() +
                        "\n\n" +

                        "If this was you, no action is required.\n\n" +

                        "If you do not recognize this login, please secure your account immediately by changing your password.\n\n" +

                        "Regards,\n" +
                        "SecureVault Security Team"
        );

        mailSender.send(message);
    }


    // =========================================================
    // SEND MULTIPLE FAILED LOGIN SECURITY ALERT EMAIL
    // =========================================================

    public void sendSecurityAlertNotification(
            String toEmail,
            String fullName,
            String alertMessage
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "SecureVault - Security Alert"
        );

        message.setText(
                "Hello " + fullName + ",\n\n" +

                        "SecureVault detected suspicious login activity on your account.\n\n" +

                        "Security Alert:\n" +
                        alertMessage + "\n\n" +

                        "Account: " + toEmail + "\n" +

                        "Date & Time: " +
                        LocalDateTime.now() +
                        "\n\n" +

                        "If these login attempts were not made by you, we strongly recommend changing your SecureVault password immediately.\n\n" +

                        "Please review your account security and recent login activity.\n\n" +

                        "Regards,\n" +
                        "SecureVault Security Team"
        );

        mailSender.send(message);
    }


    // =========================================================
    // SEND CREDENTIAL SHARED EMAIL
    // =========================================================

    public void sendCredentialSharedNotification(
            String toEmail,
            String recipientName,
            String ownerName,
            String permission
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "SecureVault - Credential Shared With You"
        );

        message.setText(
                "Hello " + recipientName + ",\n\n" +

                        ownerName +
                        " has shared a credential with you through SecureVault.\n\n" +

                        "Permission: " +
                        permission +
                        "\n\n" +

                        "Account: " +
                        toEmail +
                        "\n\n" +

                        "Date & Time: " +
                        LocalDateTime.now() +
                        "\n\n" +

                        "You can log in to SecureVault to view the shared credential.\n\n" +

                        "For security reasons, the credential password is not included in this email.\n\n" +

                        "Regards,\n" +
                        "SecureVault Security Team"
        );

        mailSender.send(message);
    }


    // =========================================================
    // SEND PASSWORD EXPIRATION EMAIL
    // =========================================================

    public void sendPasswordExpirationNotification(
            String toEmail,
            String fullName,
            long daysSincePasswordChange
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "SecureVault - Password Update Required"
        );

        message.setText(
                "Hello " + fullName + ",\n\n" +

                        "Your SecureVault password has not been changed for "
                        + daysSincePasswordChange
                        + " days.\n\n" +

                        "For better account security, we recommend updating your password.\n\n" +

                        "Account: " + toEmail + "\n" +

                        "Date & Time: " +
                        LocalDateTime.now() +
                        "\n\n" +

                        "Please log in to SecureVault and update your password.\n\n" +

                        "Regards,\n" +
                        "SecureVault Security Team"
        );

        mailSender.send(message);
    }
}