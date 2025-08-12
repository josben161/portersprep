-- Add all missing columns to profiles table
-- This ensures all profile fields are available

-- Add resume_key column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_key TEXT;

-- Add goals column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals TEXT;

-- Add industry column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry TEXT;

-- Add years_exp column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_exp INTEGER;

-- Add gpa column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2);

-- Add gmat column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gmat INTEGER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_resume_key ON profiles(resume_key);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON profiles(industry);

-- Add comments for documentation
COMMENT ON COLUMN profiles.resume_key IS 'S3 key for uploaded resume/CV file';
COMMENT ON COLUMN profiles.goals IS 'User career goals and objectives';
COMMENT ON COLUMN profiles.industry IS 'User industry/field';
COMMENT ON COLUMN profiles.years_exp IS 'Years of work experience';
COMMENT ON COLUMN profiles.gpa IS 'Undergraduate GPA';
COMMENT ON COLUMN profiles.gmat IS 'GMAT score'; 