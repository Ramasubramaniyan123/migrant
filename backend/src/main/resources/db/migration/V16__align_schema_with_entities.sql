-- V16: Align physical column types with JPA entity mappings so that
-- hibernate ddl-auto=validate passes.
--
-- 1. Entity ids are Long (BIGINT) but V1-V13 created SERIAL (INTEGER) primary
--    keys and INTEGER foreign keys. Standardize everything on BIGINT.
-- 2. Entity Instant fields map to TIMESTAMP WITH TIME ZONE, but V1-V13 created
--    plain TIMESTAMP columns.
-- 3. user_profiles.location_accuracy_km is DECIMAL(5,2) but the entity uses
--    Double (float8).

-- ---------------------------------------------------------------------------
-- 1. Primary keys: INTEGER -> BIGINT
-- ---------------------------------------------------------------------------
ALTER TABLE users ALTER COLUMN id TYPE BIGINT;
ALTER TABLE user_profiles ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE user_languages ALTER COLUMN id TYPE BIGINT;
ALTER TABLE connections ALTER COLUMN id TYPE BIGINT;
ALTER TABLE blocks ALTER COLUMN id TYPE BIGINT;
ALTER TABLE communities ALTER COLUMN id TYPE BIGINT;
ALTER TABLE community_members ALTER COLUMN id TYPE BIGINT;
ALTER TABLE posts ALTER COLUMN id TYPE BIGINT;
ALTER TABLE comments ALTER COLUMN id TYPE BIGINT;
ALTER TABLE reactions ALTER COLUMN id TYPE BIGINT;
ALTER TABLE conversations ALTER COLUMN id TYPE BIGINT;
ALTER TABLE conversation_members ALTER COLUMN id TYPE BIGINT;
ALTER TABLE messages ALTER COLUMN id TYPE BIGINT;
ALTER TABLE notifications ALTER COLUMN id TYPE BIGINT;
ALTER TABLE community_events ALTER COLUMN id TYPE BIGINT;
ALTER TABLE event_participants ALTER COLUMN id TYPE BIGINT;
ALTER TABLE reports ALTER COLUMN id TYPE BIGINT;
ALTER TABLE languages ALTER COLUMN id TYPE BIGINT;
ALTER TABLE administrators ALTER COLUMN id TYPE BIGINT;
ALTER TABLE audit_logs ALTER COLUMN id TYPE BIGINT;

-- ---------------------------------------------------------------------------
-- 2. Foreign keys and plain Long columns: INTEGER -> BIGINT
-- ---------------------------------------------------------------------------
ALTER TABLE user_profiles ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE user_languages ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE user_languages ALTER COLUMN language_id TYPE BIGINT;
ALTER TABLE connections ALTER COLUMN requester_id TYPE BIGINT;
ALTER TABLE connections ALTER COLUMN receiver_id TYPE BIGINT;
ALTER TABLE blocks ALTER COLUMN blocker_id TYPE BIGINT;
ALTER TABLE blocks ALTER COLUMN blocked_id TYPE BIGINT;
ALTER TABLE communities ALTER COLUMN language_id TYPE BIGINT;
ALTER TABLE communities ALTER COLUMN created_by TYPE BIGINT;
ALTER TABLE community_members ALTER COLUMN community_id TYPE BIGINT;
ALTER TABLE community_members ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE posts ALTER COLUMN community_id TYPE BIGINT;
ALTER TABLE posts ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE comments ALTER COLUMN post_id TYPE BIGINT;
ALTER TABLE comments ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE comments ALTER COLUMN parent_comment_id TYPE BIGINT;
ALTER TABLE reactions ALTER COLUMN post_id TYPE BIGINT;
ALTER TABLE reactions ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE conversations ALTER COLUMN created_by TYPE BIGINT;
ALTER TABLE conversation_members ALTER COLUMN conversation_id TYPE BIGINT;
ALTER TABLE conversation_members ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE messages ALTER COLUMN conversation_id TYPE BIGINT;
ALTER TABLE messages ALTER COLUMN sender_id TYPE BIGINT;
ALTER TABLE notifications ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE notifications ALTER COLUMN related_id TYPE BIGINT;
ALTER TABLE community_events ALTER COLUMN community_id TYPE BIGINT;
ALTER TABLE community_events ALTER COLUMN organizer_id TYPE BIGINT;
ALTER TABLE event_participants ALTER COLUMN event_id TYPE BIGINT;
ALTER TABLE event_participants ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE reports ALTER COLUMN reporter_id TYPE BIGINT;
ALTER TABLE reports ALTER COLUMN reviewed_by TYPE BIGINT;
ALTER TABLE reports ALTER COLUMN target_id TYPE BIGINT;
ALTER TABLE audit_logs ALTER COLUMN admin_id TYPE BIGINT;
ALTER TABLE audit_logs ALTER COLUMN entity_id TYPE BIGINT;
ALTER TABLE admin_password_reset_tokens ALTER COLUMN administrator_id TYPE BIGINT;
ALTER TABLE moderation_actions ALTER COLUMN moderator_id TYPE BIGINT;
ALTER TABLE content_flags ALTER COLUMN flagged_by TYPE BIGINT;
ALTER TABLE community_invitations ALTER COLUMN community_id TYPE BIGINT;
ALTER TABLE community_invitations ALTER COLUMN inviter_id TYPE BIGINT;
ALTER TABLE community_invitations ALTER COLUMN invitee_id TYPE BIGINT;
ALTER TABLE post_images ALTER COLUMN post_id TYPE BIGINT;
ALTER TABLE refresh_tokens ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE user_sessions ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE email_verification_tokens ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE password_reset_tokens ALTER COLUMN user_id TYPE BIGINT;
ALTER TABLE user_interests ALTER COLUMN user_id TYPE BIGINT;

-- ---------------------------------------------------------------------------
-- 3. Timestamp columns: TIMESTAMP -> TIMESTAMP WITH TIME ZONE
-- ---------------------------------------------------------------------------
ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE connections ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE connections ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE blocks ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE communities ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE communities ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE community_members ALTER COLUMN joined_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE posts ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE posts ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE comments ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE comments ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE conversations ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE conversations ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE conversation_members ALTER COLUMN last_read_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE messages ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE notifications ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ALTER COLUMN reviewed_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE administrators ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE administrators ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE administrators ALTER COLUMN last_login_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE audit_logs ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE community_events ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE community_events ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE community_events ALTER COLUMN start_time TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE community_events ALTER COLUMN end_time TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE event_participants ALTER COLUMN joined_at TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE reactions ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;

-- ---------------------------------------------------------------------------
-- 4. user_profiles.location_accuracy_km: DECIMAL(5,2) -> DOUBLE PRECISION
-- ---------------------------------------------------------------------------
ALTER TABLE user_profiles ALTER COLUMN location_accuracy_km TYPE DOUBLE PRECISION;
