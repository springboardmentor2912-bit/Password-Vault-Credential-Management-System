package com.passwordvault.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class EncryptionService {

    // MUST be exactly 16 characters
    private static final String SECRET_KEY = "PasswordVault16!";

    private SecretKeySpec getKey() {

        return new SecretKeySpec(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                "AES"
        );
    }

    // Encrypt Password
    public String encrypt(String password) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(Cipher.ENCRYPT_MODE, getKey());

            byte[] encrypted = cipher.doFinal(
                    password.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(encrypted);

        } catch (Exception e) {

            throw new RuntimeException("Encryption Failed", e);

        }

    }

    // Decrypt Password
    public String decrypt(String encryptedPassword) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(Cipher.DECRYPT_MODE, getKey());

            byte[] decoded = Base64.getDecoder().decode(encryptedPassword);

            return new String(
                    cipher.doFinal(decoded),
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {

            throw new RuntimeException("Decryption Failed", e);

        }

    }

}