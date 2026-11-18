package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.entity.AdminRevokedToken;
import com.migrantcommunity.admin.repository.AdminRevokedTokenRepository;
import com.migrantcommunity.common.enums.AdminRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class AdminJwtService {

    private final SecretKey signingKey;
    private final long expirationMillis;
    private final AdminRevokedTokenRepository revokedTokenRepository;

    public AdminJwtService(
            @Value("${jwt.secret}") String configuredSecret,
            @Value("${jwt.expiration:900000}") long expirationMillis,
            AdminRevokedTokenRepository revokedTokenRepository) {
        if (expirationMillis <= 0) {
            throw new IllegalArgumentException("JWT expiration must be positive");
        }
        this.expirationMillis = expirationMillis;
        this.signingKey = createSigningKey(configuredSecret);
        this.revokedTokenRepository = revokedTokenRepository;
    }

    public String issueToken(String email, AdminRole role) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .claim("tokenUse", "admin")
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plusMillis(expirationMillis)))
                .signWith(signingKey)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Transactional(readOnly = true)
    public boolean isRevoked(String tokenId) {
        return tokenId != null && revokedTokenRepository.existsByJti(tokenId);
    }

    /** Revokes a token until its natural expiry; expired rows are purged. */
    @Transactional
    public void revoke(String token) {
        Claims claims = parse(token);
        Instant expiresAt = claims.getExpiration() != null
                ? claims.getExpiration().toInstant()
                : Instant.now().plusMillis(expirationMillis);
        revokedTokenRepository.save(new AdminRevokedToken(claims.getId(), expiresAt));
        revokedTokenRepository.deleteExpired(Instant.now());
    }

    private SecretKey createSigningKey(String configuredSecret) {
        if (configuredSecret == null || configuredSecret.isBlank()) {
            throw new IllegalArgumentException(
                    "jwt.secret must not be empty. Set JWT_SECRET in your environment.");
        }
        byte[] keyBytes = configuredSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                    "jwt.secret must be at least 32 bytes (256 bits). Current length: "
                    + keyBytes.length + " bytes.");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
