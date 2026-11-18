-- V19: notification_preferences.user_id was created as INTEGER in V14 but the
-- NotificationPreference entity maps it as Long (BIGINT). V16 aligned the
-- other user_id columns but missed this table. Align it so that
-- hibernate ddl-auto=validate passes.
ALTER TABLE notification_preferences ALTER COLUMN user_id TYPE BIGINT;
