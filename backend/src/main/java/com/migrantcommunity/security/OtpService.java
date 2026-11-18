package com.migrantcommunity.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.HexFormat;

/**
 * Keyed hashing for short-lived OTP values. OTPs are low-entropy (6 digits),
 * so they are never stored or compared in plaintext; HMAC-SHA256 keyed with
 * the JWT signing secret keeps them unguessable even if the database leaks.
 */
@Service
public class OtpService {

    private static final String ALGORITHM = "HmacSHA256";

    private final SecretKeySpec key;

    public OtpService(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException("jwt.secret must not be empty. Set JWT_SECRET in your environment.");
        }
        this.key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITHM);
    }

    /** Returns the keyed hash stored in the database for the given OTP. */
    public String hash(String otp) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            mac.init(key);
            return HexFormat.of().formatHex(mac.doFinal(otp.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("OTP hashing unavailable", ex);
        }
    }

    /** Constant-time comparison of a presented OTP against a stored hash. */
    public boolean matches(String otp, String storedHash) {
        String computed = hash(otp);
        return java.security.MessageDigest.isEqual(
                computed.getBytes(StandardCharsets.UTF_8),
                storedHash.getBytes(StandardCharsets.UTF_8));
    }
}
