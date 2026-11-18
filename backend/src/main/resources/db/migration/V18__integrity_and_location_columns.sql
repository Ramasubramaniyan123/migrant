-- V18: Restore profile lat/lng columns expected by JPA
-- and enforce connection-pair uniqueness in either direction.

-- 1. user_profiles.current_location_lat/lng were dropped in V14 while the
--    Profile entity still maps them. Restore the columns.
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_location_lat DOUBLE PRECISION;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_location_lng DOUBLE PRECISION;

CREATE INDEX IF NOT EXISTS idx_user_profiles_lat_lng
    ON user_profiles (current_location_lat, current_location_lng);

-- 2. A pair of users may only have one connection row regardless of direction.
--    Drop duplicate rows keeping the earliest accepted (else earliest) record.
DELETE FROM connections a
USING connections b
WHERE a.id > b.id
  AND LEAST(a.requester_id, a.receiver_id) = LEAST(b.requester_id, b.receiver_id)
  AND GREATEST(a.requester_id, a.receiver_id) = GREATEST(b.requester_id, b.receiver_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_connections_user_pair
    ON connections (LEAST(requester_id, receiver_id), GREATEST(requester_id, receiver_id));

-- 3. Constrain community membership roles at the database.
ALTER TABLE community_members DROP CONSTRAINT IF EXISTS chk_community_member_role;
ALTER TABLE community_members
    ADD CONSTRAINT chk_community_member_role
    CHECK (role IN ('OWNER', 'MODERATOR', 'MEMBER'));

-- 4. Constrain user account status values.
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_account_status;
ALTER TABLE users
    ADD CONSTRAINT chk_users_account_status
    CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED'));
