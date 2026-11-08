package com.migrantcommunity.admin.service;

import com.migrantcommunity.common.enums.AdminRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminJwtService {

    private final SecretKey signingKey;
    private final long expirationMillis;
    private final Set<String> revokedTokenIds = ConcurrentHashMap.newKeySet();

    public AdminJwtService(
            @Value("${jwt.secret:}") String configuredSecret,
            @Value("${jwt.expiration:86400000}") long expirationMillis) {
        if (expirationMillis <= 0) {
            throw new IllegalArgumentException("JWT expiration must be positive");
        }
        this.expirationMillis = expirationMillis;
        this.signingKey = createSigningKey(configuredSecret);
    }

    public String issueToken(String email, AdminRole role) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(issuedAt.plusMillis(expirationMillis)))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isRevoked(String tokenId) {
        return revokedTokenIds.contains(tokenId);
    }

    public void revoke(String token) {
        Claims claims = parse(token);
        revokedTokenIds.add(claims.getId());
    }

    private SecretKey createSigningKey(String configuredSecret) {
        byte[] keyBytes;
        if (configuredSecret == null || configuredSecret.isBlank()) {
            keyBytes = new byte[32];
            new SecureRandom().nextBytes(keyBytes);
        } else {
            keyBytes = configuredSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        }
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret must contain at least 32 bytes");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
