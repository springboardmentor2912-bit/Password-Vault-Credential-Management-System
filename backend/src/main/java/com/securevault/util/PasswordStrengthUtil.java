package com.securevault.util;

public final class PasswordStrengthUtil {

    private PasswordStrengthUtil() {
    }

    public enum Strength {
        STRONG,
        MEDIUM,
        WEAK
    }

    public static Strength check(String password) {

        if (password == null || password.isEmpty()) {
            return Strength.WEAK;
        }

        int score = 0;

        // Length check
        if (password.length() >= 8) {
            score++;
        }

        // Uppercase check
        if (password.matches(".*[A-Z].*")) {
            score++;
        }

        // Lowercase check
        if (password.matches(".*[a-z].*")) {
            score++;
        }

        // Number check
        if (password.matches(".*\\d.*")) {
            score++;
        }

        // Special character check
        if (password.matches(".*[^A-Za-z0-9].*")) {
            score++;
        }

        // Strong = all 5 conditions satisfied
        if (score == 5) {
            return Strength.STRONG;
        }

        // Medium = at least 2 conditions satisfied
        if (score >= 2) {
            return Strength.MEDIUM;
        }

        // Otherwise weak
        return Strength.WEAK;
    }
}