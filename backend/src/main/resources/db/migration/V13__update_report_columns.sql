-- Update reports table with additional columns for improved reporting system
ALTER TABLE reports ADD COLUMN IF NOT EXISTS target_type VARCHAR(50);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS target_id INTEGER;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolution TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update the existing columns to make them nullable since they might not exist in all cases
ALTER TABLE reports ALTER COLUMN reported_user_id DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN reported_post_id DROP NOT NULL;

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
