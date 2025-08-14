-- Add resume_analysis column to profiles table
-- This stores AI-generated analysis of uploaded resumes

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_analysis TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_resume_analysis ON profiles(resume_analysis);

-- Add comment for documentation
COMMENT ON COLUMN profiles.resume_analysis IS 'AI-generated analysis of uploaded resume/CV content';
