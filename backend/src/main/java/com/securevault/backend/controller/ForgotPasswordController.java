package com.securevault.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.dto.ForgotPasswordRequest;
import com.securevault.backend.dto.ResetPasswordRequest;
import com.securevault.backend.dto.VerifyOtpRequest;
import com.securevault.backend.service.AuthService;
import com.securevault.backend.service.OtpService;

@RestController
@RequestMapping("/api/password")
@CrossOrigin("*")
public class ForgotPasswordController {

    private final OtpService otpService;
    private final AuthService authService;

    public ForgotPasswordController(OtpService otpService,
                                    AuthService authService) {
        this.otpService = otpService;
        this.authService = authService;
    }

    @PostMapping("/forgot")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        String response = otpService.generateOtp(request.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        boolean valid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp());

        if (valid) {
            return ResponseEntity.ok("OTP Verified Successfully");
        }

        return ResponseEntity.badRequest()
                .body("Invalid or Expired OTP");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        String response = authService.resetPassword(request);

        return ResponseEntity.ok(response);
    }
}