package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.securevault.backend.entity.Otp;
import com.securevault.backend.repository.OtpRepository;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    public OtpService(OtpRepository otpRepository,
                      EmailService emailService) {

        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public String generateOtp(String email) {

        Random random = new Random();

        String otp = String.format("%06d", random.nextInt(999999));

        Otp otpEntity = new Otp();

        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setVerified(false);

        otpRepository.save(otpEntity);

        emailService.sendOtpEmail(email, otp);

        return "OTP Sent Successfully";
    }

    public boolean verifyOtp(String email, String otp) {

        Optional<Otp> optionalOtp =
                otpRepository.findTopByEmailOrderByIdDesc(email);

        if (optionalOtp.isEmpty()) {
            return false;
        }

        Otp otpEntity = optionalOtp.get();

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        if (!otpEntity.getOtp().equals(otp)) {
            return false;
        }

        otpEntity.setVerified(true);

        otpRepository.save(otpEntity);

        return true;
    }
}