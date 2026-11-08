-- V14: Reconcile user_profiles with JPA entity and add all missing domain tables.

-- 0. Timestamp columns required by JPA entities but missing from earlier migrations.
ALTER TABLE languages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE languages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE user_languages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

-- 1. user_profiles: entity uses user_id as PK (@MapsId) and a PostGIS geography column.
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS id;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_location geometry(Point, 4326);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS discovery_enabled BOOLEAN DEFAULT true;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_city VARCHAR(100);
ALTER TABLE user_profiles ADD PRIMARY KEY (user_id);
-- Backfill geography from legacy lat/lng columns when present.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'user_profiles' AND column_name = 'current_location_lat') THEN
        DROP INDEX IF EXISTS idx_user_profiles_location;
        UPDATE user_profiles
        SET current_location = ST_SetSRID(ST_MakePoint(current_location_lng, current_location_lat), 4326)
        WHERE current_location IS NULL
          AND current_location_lat IS NOT NULL
          AND current_location_lng IS NOT NULL;
        ALTER TABLE user_profiles DROP COLUMN current_location_lat;
        ALTER TABLE user_profiles DROP COLUMN current_location_lng;
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_user_profiles_geo ON user_profiles USING GIST (current_location);

-- 2. Refresh tokens (entity RefreshToken already mapped; table was missing).
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- 3. User sessions (concurrent session tracking).
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_id BIGINT REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);

-- 4. Email verification tokens.
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user ON email_verification_tokens(user_id);

-- 5. Password reset tokens.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);

-- 6. User interests (free-form tags).
CREATE TABLE IF NOT EXISTS user_interests (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, interest)
);
CREATE INDEX IF NOT EXISTS idx_user_interests_user ON user_interests(user_id);

-- 7. User privacy settings (structured counterpart of profile.privacy_settings JSONB).
CREATE TABLE IF NOT EXISTS user_privacy_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    show_hometown BOOLEAN NOT NULL DEFAULT true,
    show_current_city BOOLEAN NOT NULL DEFAULT true,
    show_exact_location BOOLEAN NOT NULL DEFAULT false,
    allow_connection_requests BOOLEAN NOT NULL DEFAULT true,
    allow_direct_messages BOOLEAN NOT NULL DEFAULT true,
    show_online_status BOOLEAN NOT NULL DEFAULT true,
    discoverable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Locations master data (countries / states / cities used by discovery and profiles).
CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('COUNTRY', 'STATE', 'CITY')),
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location geometry(Point, 4326),
    parent_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_geo ON locations USING GIST (location);

-- 9. Community invitations.
CREATE TABLE IF NOT EXISTS community_invitations (
    id BIGSERIAL PRIMARY KEY,
    community_id INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    inviter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    invitee_email VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'REVOKED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(community_id, inviter_id, invitee_id)
);
CREATE INDEX IF NOT EXISTS idx_community_invitations_community ON community_invitations(community_id);
CREATE INDEX IF NOT EXISTS idx_community_invitations_invitee ON community_invitations(invitee_id);

-- 10. Post images (multi-image posts; posts.image_url remains for the primary image).
CREATE TABLE IF NOT EXISTS post_images (
    id BIGSERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_post_images_post ON post_images(post_id);

-- 11. Message read receipts.
CREATE TABLE IF NOT EXISTS message_read_receipts (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(message_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message ON message_read_receipts(message_id);

-- 12. Notification preferences.
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    push_enabled BOOLEAN NOT NULL DEFAULT true,
    connection_requests BOOLEAN NOT NULL DEFAULT true,
    messages BOOLEAN NOT NULL DEFAULT true,
    community_activity BOOLEAN NOT NULL DEFAULT true,
    reactions BOOLEAN NOT NULL DEFAULT true,
    events BOOLEAN NOT NULL DEFAULT true,
    announcements BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. Moderation actions (immutable audit of moderator decisions).
CREATE TABLE IF NOT EXISTS moderation_actions (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES reports(id) ON DELETE SET NULL,
    moderator_id INTEGER REFERENCES administrators(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id BIGINT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_report ON moderation_actions(report_id);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_moderator ON moderation_actions(moderator_id);

-- 14. Content flags (auto/manual flags on content).
CREATE TABLE IF NOT EXISTS content_flags (
    id BIGSERIAL PRIMARY KEY,
    target_type VARCHAR(50) NOT NULL,
    target_id BIGINT NOT NULL,
    flagged_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'REVIEWED', 'DISMISSED', 'ACTIONED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_content_flags_target ON content_flags(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_content_flags_status ON content_flags(status);

-- 15. RBAC tables for administrators.
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS administrator_roles (
    id BIGSERIAL PRIMARY KEY,
    administrator_id INTEGER NOT NULL REFERENCES administrators(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(administrator_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- Seed the built-in roles.
INSERT INTO roles (name, description) VALUES
    ('SUPER_ADMIN', 'Full platform access'),
    ('ADMIN', 'Administrative access'),
    ('MODERATOR', 'Content moderation access'),
    ('SUPPORT', 'User support access'),
    ('ANALYST', 'Analytics and reporting access')
ON CONFLICT (name) DO NOTHING;
