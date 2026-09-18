package com.securevault.util;

import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class EncryptionUtil {

    private static final String SECRET_KEY = "SecureVaultKey";

    private final SecretKeySpec secretKey;

    public EncryptionUtil() {
        byte[] key = new byte[16];
        byte[] originalKey = SECRET_KEY.getBytes();

        System.arraycopy(originalKey, 0, key, 0,
                Math.min(originalKey.length, key.length));

        secretKey = new SecretKeySpec(key, "AES");
    }

    public String encrypt(String value) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);

            return Base64.getEncoder()
                    .encodeToString(cipher.doFinal(value.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String decrypt(String value) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);

            return new String(
                    cipher.doFinal(Base64.getDecoder().decode(value))
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}