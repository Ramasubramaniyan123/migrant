package com.migrantcommunity.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import com.migrantcommunity.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMillis;
    private final long refreshExpirationMillis;

    public JwtService(@Value("${jwt.secret:}") String configuredSecret,
                      @Value("${jwt.expiration:86400000}") long expirationMillis,
                      @Value("${jwt.refresh-expiration:604800000}") long refreshExpirationMillis) {
        this.expirationMillis = expirationMillis;
        this.refreshExpirationMillis = refreshExpirationMillis;
        this.signingKey = createSigningKey(configuredSecret);
    }

    public String issueAccessToken(User user) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(issuedAt.plusMillis(expirationMillis)))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String issueRefreshToken(User user) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("type", "refresh")
                .claim("userId", user.getId())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(issuedAt.plusMillis(refreshExpirationMillis)))
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

    private SecretKey createSigningKey(String configuredSecret) {
        byte[] keyBytes;
        if (configuredSecret == null || configuredSecret.isBlank()) {
            keyBytes = new byte[32];
            new SecureRandom().nextBytes(keyBytes);
        } else {
            keyBytes = configuredSecret.getBytes(StandardCharsets.UTF_8);
        }
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret must contain at least 32 bytes");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
