-- Add resume_filename column to profiles table
-- This stores the original filename of uploaded resumes

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_filename TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_resume_filename ON profiles(resume_filename);

-- Add comment for documentation
COMMENT ON COLUMN profiles.resume_filename IS 'Original filename of uploaded resume/CV file'; 