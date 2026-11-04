-- Seed Data for Migrant Community Platform

-- Insert languages
INSERT INTO languages (name, code, native_name) VALUES
('English', 'en', 'English'),
('Spanish', 'es', 'Español'),
('French', 'fr', 'Français'),
('German', 'de', 'Deutsch'),
('Portuguese', 'pt', 'Português'),
('Italian', 'it', 'Italiano'),
('Chinese', 'zh', ''),
('Japanese', 'ja', ''),
('Korean', 'ko', '한국어'),
('Arabic', 'ar', 'العربية'),
('Hindi', 'hi', 'हिन्दी'),
('Bengali', 'bn', 'বাংলা'),
('Russian', 'ru', 'Русский'),
('Turkish', 'tr', 'Türkçe'),
('Polish', 'pl', 'Polski'),
('Dutch', 'nl', 'Nederlands'),
('Swedish', 'sv', 'Svenska'),
('Norwegian', 'no', 'Norsk'),
('Danish', 'da', 'Dansk'),
('Vietnamese', 'vi', 'Tiếng Việt');

-- Note: Users should be created with proper password hashing
-- This is a placeholder structure - actual passwords should be hashed using bcrypt or similar
-- Example users (passwords should be hashed in production)
-- INSERT INTO users (email, password_hash, role, is_active, is_verified) VALUES
-- ('user1@example.com', '$2a$10$hashed_password_here', 'USER', true, true),
-- ('user2@example.com', '$2a$10$hashed_password_here', 'USER', true, true);

-- Example communities
INSERT INTO communities (name, description, language_id, location_country, location_city, is_public, member_count, created_by) VALUES
('Spanish Speakers in London', 'Community for Spanish speakers living in London', 2, 'United Kingdom', 'London', true, 0, 1),
('French Expats in Paris', 'French-speaking community in Paris', 3, 'France', 'Paris', true, 0, 1),
('German Learners', 'Community for people learning German', 4, NULL, NULL, true, 0, 1),
('Portuguese in UK', 'Portuguese speakers in the United Kingdom', 5, 'United Kingdom', NULL, true, 0, 1),
('Chinese Community', 'Chinese language community', 7, NULL, NULL, true, 0, 1);
