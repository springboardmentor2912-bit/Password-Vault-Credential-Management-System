package com.passwordvault.controller;

import com.passwordvault.dto.AuthResponse;
import com.passwordvault.dto.ForgotPasswordRequest;
import com.passwordvault.dto.LoginRequest;
import com.passwordvault.dto.RegisterRequest;
import com.passwordvault.dto.ResetPasswordRequest;
import com.passwordvault.dto.VerifyOtpRequest;
import com.passwordvault.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // Login
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // Send OTP to registered email
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    // Verify OTP
    @PostMapping("/verify-otp")
    public String verifyOTP(@RequestBody VerifyOtpRequest request) {
        return authService.verifyOTP(request);
    }

    // Reset Password
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}