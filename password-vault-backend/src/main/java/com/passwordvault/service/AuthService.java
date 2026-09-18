package com.passwordvault.service;

import com.passwordvault.config.JwtService;
import com.passwordvault.dto.AuthResponse;
import com.passwordvault.dto.ForgotPasswordRequest;
import com.passwordvault.dto.LoginRequest;
import com.passwordvault.dto.RegisterRequest;
import com.passwordvault.dto.ResetPasswordRequest;
import com.passwordvault.dto.VerifyOtpRequest;
import com.passwordvault.entity.LoginHistory;
import com.passwordvault.entity.Otp;
import com.passwordvault.entity.User;
import com.passwordvault.repository.LoginHistoryRepository;
import com.passwordvault.repository.OtpRepository;
import com.passwordvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Login history repository
    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    private final Set<String> otpVerifiedEmails = new HashSet<>();


    // =====================================================
    // REGISTER
    // =====================================================

    public AuthResponse register(RegisterRequest request) {

        if (request == null ||
                request.getName() == null ||
                request.getEmail() == null ||
                request.getPassword() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid registration details."
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered."
            );
        }

        User user = new User();

        user.setName(request.getName());

        user.setEmail(
                request.getEmail().trim().toLowerCase()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        userRepository.save(user);

        String token =
                jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "User registered successfully."
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    public AuthResponse login(LoginRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getPassword() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid login request."
            );
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // -------------------------------------------------
        // Find user
        // -------------------------------------------------

        Optional<User> optionalUser =
                userRepository.findByEmail(email);


        // -------------------------------------------------
        // Email not registered
        // -------------------------------------------------

        if (optionalUser.isEmpty()) {

            // Save FAILED login history
            loginHistoryRepository.save(
                    new LoginHistory(
                            email,
                            "FAILED"
                    )
            );

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }


        User user = optionalUser.get();


        // -------------------------------------------------
        // Check password
        // -------------------------------------------------

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            // Save FAILED login history
            loginHistoryRepository.save(
                    new LoginHistory(
                            email,
                            "FAILED"
                    )
            );

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }


        // -------------------------------------------------
        // Successful login
        // -------------------------------------------------

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // Save SUCCESS login history
        loginHistoryRepository.save(
                new LoginHistory(
                        user.getEmail(),
                        "SUCCESS"
                )
        );


        return new AuthResponse(
                token,
                "Login successful."
        );
    }


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    public String forgotPassword(
            ForgotPasswordRequest request) {

        if (request == null ||
                request.getEmail() == null) {

            return "Invalid request.";
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        Optional<User> optionalUser =
                userRepository.findByEmail(email);


        if (optionalUser.isEmpty()) {

            return "Email not registered.";
        }


        // Generate 6 digit OTP
        String otp =
                String.valueOf(
                        (int) (
                                100000 +
                                Math.random() * 900000
                        )
                );


        // Delete previous OTP
        otpRepository.deleteByEmail(email);


        // Create OTP entity
        Otp otpEntity = new Otp();

        otpEntity.setEmail(email);

        otpEntity.setOtp(otp);

        otpEntity.setExpiryTime(
                LocalDateTime.now()
                        .plusMinutes(5)
        );


        otpRepository.save(otpEntity);


        // Send OTP to email
        emailService.sendOTP(
                email,
                otp
        );


        return "OTP sent successfully.";
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    public String verifyOTP(
            VerifyOtpRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getOtp() == null) {

            return "Invalid request.";
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        Optional<Otp> optionalOtp =
                otpRepository.findByEmail(email);


        if (optionalOtp.isEmpty()) {

            return "Invalid OTP.";
        }


        Otp savedOtp =
                optionalOtp.get();


        // Check expiry
        if (savedOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            otpRepository.delete(savedOtp);

            return "OTP expired.";
        }


        // Check OTP
        if (!savedOtp.getOtp()
                .equals(request.getOtp())) {

            return "Invalid OTP.";
        }


        // OTP is correct
        otpRepository.delete(savedOtp);


        otpVerifiedEmails.add(email);


        return "OTP verified successfully.";
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    public String resetPassword(
            ResetPasswordRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getPassword() == null) {

            return "Invalid request.";
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // Check OTP verification
        if (!otpVerifiedEmails.remove(email)) {

            return "Verify OTP first.";
        }


        // Find user
        Optional<User> optionalUser =
                userRepository.findByEmail(email);


        if (optionalUser.isEmpty()) {

            return "User not found.";
        }


        User user =
                optionalUser.get();


        // Update password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        userRepository.save(user);


        return "Password reset successfully.";
    }
}