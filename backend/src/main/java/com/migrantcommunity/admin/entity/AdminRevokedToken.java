package com.migrantcommunity.admin.entity;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * Revoked admin JWT IDs (jti). Persisted so logout survives restarts and works
 * across instances. Rows are garbage-collected once the token would have expired.
 */
@Entity
@Table(name = "admin_revoked_tokens")
public class AdminRevokedToken {

    @Id
    @Column(length = 64)
    private String jti;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public AdminRevokedToken() {
    }

    public AdminRevokedToken(String jti, Instant expiresAt) {
        this.jti = jti;
        this.expiresAt = expiresAt;
    }

    public String getJti() { return jti; }
    public void setJti(String jti) { this.jti = jti; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
}
