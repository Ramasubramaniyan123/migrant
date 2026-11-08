-- V15: Persist admin-portal state that was previously held in memory.

-- Community classification used by the admin portal.
ALTER TABLE communities ADD COLUMN IF NOT EXISTS community_type VARCHAR(30);
ALTER TABLE communities ADD COLUMN IF NOT EXISTS hometown VARCHAR(100);
UPDATE communities SET community_type = 'LANGUAGE' WHERE language_id IS NOT NULL AND community_type IS NULL;
UPDATE communities SET community_type = 'HOMETOWN' WHERE community_type IS NULL;

-- Avatar URL on administrator accounts.
ALTER TABLE administrators ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Audit log outcome column (SUCCESS/FAILURE) required by the audit DTO.
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS result VARCHAR(20);

-- Report priority + denormalized target preview for the moderation queue.
ALTER TABLE reports ADD COLUMN IF NOT EXISTS priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE reports ADD COLUMN IF NOT EXISTS target_preview VARCHAR(500);

-- Admin-facing account lifecycle status on users.
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';
UPDATE users SET account_status = 'SUSPENDED' WHERE is_active = false AND account_status = 'ACTIVE';
UPDATE users SET account_status = 'PENDING_VERIFICATION'
    WHERE is_verified = false AND is_active = true AND account_status = 'ACTIVE';

-- Languages can be deactivated without deleting them.
ALTER TABLE languages ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Locations may represent localities beneath a city.
ALTER TABLE locations DROP CONSTRAINT IF EXISTS locations_type_check;
ALTER TABLE locations ADD CONSTRAINT locations_type_check
    CHECK (type IN ('COUNTRY', 'STATE', 'CITY', 'LOCALITY'));

-- Platform-wide settings edited from the admin portal.
CREATE TABLE IF NOT EXISTS platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Broadcast / announcement records sent from the admin portal.
CREATE TABLE IF NOT EXISTS platform_notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    type VARCHAR(50) NOT NULL,
    audience VARCHAR(50) NOT NULL,
    sent_by VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    recipient_count BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'SENT'
);
CREATE INDEX IF NOT EXISTS idx_platform_notifications_sent_at ON platform_notifications(sent_at);

-- Password reset tokens for admin portal accounts.
CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    administrator_id INTEGER NOT NULL REFERENCES administrators(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_reset_tokens_admin ON admin_password_reset_tokens(administrator_id);

-- Seed default platform settings.
INSERT INTO platform_settings (key, value) VALUES
    ('platformName', '"Migrant Community Platform"'),
    ('maintenanceMode', 'false'),
    ('allowRegistrations', 'true')
ON CONFLICT (key) DO NOTHING;
