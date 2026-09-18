package com.passwordvault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ==========================
    // Send OTP
    // ==========================

    public void sendOTP(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Password Vault - OTP Verification"
        );

        message.setText(
                "Hello,\n\n"
                        + "Your Password Vault OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for 5 minutes."
                        + "\n\n"
                        + "Do not share this OTP with anyone."
                        + "\n\n"
                        + "Thank you,\n"
                        + "Password Vault"
        );

        mailSender.send(message);
    }

    // ==========================
    // Send Credential Sharing Email
    // ==========================

    public void sendSharingEmail(
            String recipientEmail,
            String ownerEmail,
            String website,
            String permission) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(recipientEmail);

        message.setSubject(
                "Password Vault - Credential Shared With You"
        );

        message.setText(
                "Hello,\n\n"
                        + ownerEmail
                        + " has shared a credential with you "
                        + "in Password Vault.\n\n"
                        + "Website: "
                        + website
                        + "\n"
                        + "Permission: "
                        + permission
                        + "\n\n"
                        + "Please log in to your Password Vault "
                        + "account to access the shared credential."
                        + "\n\n"
                        + "Thank you,\n"
                        + "Password Vault"
        );

        mailSender.send(message);
    }
}