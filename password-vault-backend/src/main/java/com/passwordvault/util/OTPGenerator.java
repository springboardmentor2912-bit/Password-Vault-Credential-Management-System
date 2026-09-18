package com.passwordvault.util;

import java.util.Random;

public class OTPGenerator {

    private static final Random RANDOM = new Random();

    public static String generateOtp() {
        int otp = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }
}
