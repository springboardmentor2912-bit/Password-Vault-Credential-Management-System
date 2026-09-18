package com.passwordvault.util;

import java.security.SecureRandom;

public class PasswordGenerator {

    private static final String UPPER =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private static final String LOWER =
            "abcdefghijklmnopqrstuvwxyz";

    private static final String NUMBERS =
            "0123456789";

    private static final String SPECIAL =
            "@#$%&*!?";

    private static final String ALL =
            UPPER + LOWER + NUMBERS + SPECIAL;

    private static final SecureRandom random =
            new SecureRandom();

    public static String generatePassword(int length) {

        if (length < 8) {
            length = 8;
        }

        if (length > 32) {
            length = 32;
        }

        StringBuilder password = new StringBuilder();

        password.append(
                UPPER.charAt(random.nextInt(UPPER.length()))
        );

        password.append(
                LOWER.charAt(random.nextInt(LOWER.length()))
        );

        password.append(
                NUMBERS.charAt(random.nextInt(NUMBERS.length()))
        );

        password.append(
                SPECIAL.charAt(random.nextInt(SPECIAL.length()))
        );

        for (int i = 4; i < length; i++) {

            password.append(
                    ALL.charAt(random.nextInt(ALL.length()))
            );

        }

        return password.toString();
    }
}