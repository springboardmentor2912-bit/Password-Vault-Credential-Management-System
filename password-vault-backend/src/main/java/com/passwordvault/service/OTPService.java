package com.passwordvault.service;

import com.passwordvault.entity.Otp;
import com.passwordvault.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    public String generateOTP() {

        Random random = new Random();

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);
    }

    public void sendOTP(String email) {

        String otp = generateOTP();

        Optional<Otp> existingOtp = otpRepository.findByEmail(email);

        if (existingOtp.isPresent()) {
            otpRepository.delete(existingOtp.get());
        }

        Otp otpEntity = new Otp();

        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpEntity);

        emailService.sendOTP(email, otp);
    }

    public boolean verifyOTP(String email, String otp) {

        Optional<Otp> optionalOtp = otpRepository.findByEmail(email);

        if (optionalOtp.isEmpty()) {
            return false;
        }

        Otp savedOtp = optionalOtp.get();

        if (savedOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(savedOtp);
            return false;
        }

        if (!savedOtp.getOtp().equals(otp)) {
            return false;
        }

        otpRepository.delete(savedOtp);

        return true;
    }

}