-- Add resume_key column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS resume_key TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_resume_key ON profiles(resume_key);

-- Add comment for documentation
COMMENT ON COLUMN profiles.resume_key IS 'S3 key for uploaded resume/CV file'; 