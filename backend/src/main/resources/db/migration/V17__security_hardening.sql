-- V17: Security hardening.
--
-- 1. admin_revoked_tokens: persists revoked admin JWT IDs (jti) so logout and
--    revocation survive application restarts and work across instances.
--    Previously revocation was held in an in-memory Set and was lost on restart.
-- 2. password_reset_tokens.token now stores a keyed HMAC-SHA256 hash of the OTP
--    instead of the plaintext 6-digit code. Existing rows contain plaintext
--    OTPs which expire within 2 minutes, so no data migration is required;
--    any pre-existing plaintext value simply fails verification.

CREATE TABLE IF NOT EXISTS admin_revoked_tokens (
    jti VARCHAR(64) PRIMARY KEY,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_revoked_tokens_expires ON admin_revoked_tokens(expires_at);
