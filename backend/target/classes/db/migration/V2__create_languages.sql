-- Languages table (Available languages)
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    native_name VARCHAR(100)
);

-- User-language relationships
CREATE TABLE user_languages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50),
    is_primary BOOLEAN DEFAULT false,
    UNIQUE(user_id, language_id)
);

-- Create indexes
CREATE INDEX idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX idx_user_languages_language_id ON user_languages(language_id);
