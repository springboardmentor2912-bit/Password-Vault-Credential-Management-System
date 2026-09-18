package com.securevault.service;

import com.securevault.dto.AuthResponse;
import com.securevault.dto.LoginRequest;
import com.securevault.dto.RegisterRequest;
import com.securevault.dto.ForgotPasswordRequest;
import com.securevault.dto.VerifyOtpRequest;
import com.securevault.dto.ResetPasswordRequest;
import com.securevault.dto.ProfileResponse;
import com.securevault.dto.UpdateProfileRequest;

import com.securevault.entity.LoginActivity;
import com.securevault.entity.NotificationType;
import com.securevault.entity.User;

import com.securevault.repository.LoginActivityRepository;
import com.securevault.repository.UserRepository;

import com.securevault.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final LoginActivityRepository loginActivityRepository;
    private final SuspiciousActivityService suspiciousActivityService;
    private final NotificationService notificationService;
    private final PasswordExpirationService passwordExpirationService;


    // =========================================================
    // REGISTER
    // =========================================================

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .build();

        userRepository.save(user);

        String token =
                jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);


        // -----------------------------------------------------
        // USER NOT FOUND
        // -----------------------------------------------------

        if (user == null) {

            LoginActivity activity =
                    LoginActivity.builder()
                            .email(request.getEmail())
                            .status("FAILED")
                            .loginTime(LocalDateTime.now())
                            .build();

            loginActivityRepository.save(activity);

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }


        // -----------------------------------------------------
        // WRONG PASSWORD
        // -----------------------------------------------------

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            LoginActivity activity =
                    LoginActivity.builder()
                            .user(user)
                            .email(user.getEmail())
                            .status("FAILED")
                            .loginTime(LocalDateTime.now())
                            .build();

            loginActivityRepository.save(activity);

            // Check for suspicious activity
            suspiciousActivityService.analyzeLoginActivity(user);

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }


        // -----------------------------------------------------
        // SUCCESSFUL LOGIN
        // -----------------------------------------------------

        LoginActivity activity =
                LoginActivity.builder()
                        .user(user)
                        .email(user.getEmail())
                        .status("SUCCESS")
                        .loginTime(LocalDateTime.now())
                        .build();

        loginActivityRepository.save(activity);


        // -----------------------------------------------------
        // CREATE IN-APP LOGIN NOTIFICATION
        // -----------------------------------------------------

        notificationService.createNotification(
                user.getId(),
                NotificationType.SUCCESSFUL_LOGIN,
                "Successful Login",
                "A successful login was detected for your SecureVault account."
        );


        // -----------------------------------------------------
        // SEND LOGIN EMAIL
        // -----------------------------------------------------

        emailService.sendLoginNotification(
                user.getEmail(),
                user.getFullName()
        );


        // -----------------------------------------------------
        // CHECK PASSWORD EXPIRATION
        // -----------------------------------------------------

        passwordExpirationService.checkPasswordExpiration(user);


        // -----------------------------------------------------
        // GENERATE JWT TOKEN
        // -----------------------------------------------------

        String token =
                jwtUtil.generateToken(user.getEmail());


        // -----------------------------------------------------
        // RETURN LOGIN RESPONSE
        // -----------------------------------------------------

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public String forgotPassword(
            ForgotPasswordRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Email not found"
                        )
                );

        String otp =
                String.valueOf(
                        100000 +
                                new Random().nextInt(900000)
                );

        user.setOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        userRepository.save(user);


        // Send OTP through email
        emailService.sendOtp(
                user.getEmail(),
                otp
        );

        return "OTP generated successfully";
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    public String verifyOtp(
            VerifyOtpRequest request
    ) {

        User user =
                userRepository
                        .findByEmailAndOtp(
                                request.getEmail(),
                                request.getOtp()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid OTP"
                                )
                        );

        if (user.getOtpExpiry()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }

        return "OTP verified successfully";
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public String resetPassword(
            ResetPasswordRequest request
    ) {

        User user =
                userRepository
                        .findByEmailAndOtp(
                                request.getEmail(),
                                request.getOtp()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid OTP"
                                )
                        );

        if (user.getOtpExpiry()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }


        // -----------------------------------------------------
        // UPDATE PASSWORD
        // -----------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        // -----------------------------------------------------
        // UPDATE PASSWORD CHANGE DATE
        // -----------------------------------------------------

        user.setPasswordUpdatedAt(
                LocalDateTime.now()
        );


        // -----------------------------------------------------
        // CLEAR OTP
        // -----------------------------------------------------

        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return "Password reset successfully";
    }


    // =========================================================
    // GET PROFILE
    // =========================================================

    public ProfileResponse getProfile(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    public ProfileResponse updateProfile(
            String currentEmail,
            UpdateProfileRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(currentEmail)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        userRepository.save(user);

        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}