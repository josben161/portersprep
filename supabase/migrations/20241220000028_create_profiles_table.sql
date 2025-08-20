-- Create profiles table if it doesn't exist
-- This table stores user profile information

CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  resume_key TEXT,
  resume_filename TEXT,
  resume_analysis JSONB,
  years_exp INTEGER,
  industry TEXT,
  goals TEXT,
  gpa NUMERIC(3,2),
  gmat INTEGER,
  undergrad TEXT,
  citizenship TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS profiles_owner_select ON profiles;
DROP POLICY IF EXISTS profiles_owner_insert ON profiles;
DROP POLICY IF EXISTS profiles_owner_update ON profiles;
DROP POLICY IF EXISTS profiles_owner_delete ON profiles;
DROP POLICY IF EXISTS profiles_admin_all ON profiles;

-- Create RLS policies that allow admin operations
CREATE POLICY profiles_owner_select ON profiles
  FOR SELECT USING (
    clerk_user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY profiles_owner_insert ON profiles
  FOR INSERT WITH CHECK (
    clerk_user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY profiles_owner_update ON profiles
  FOR UPDATE USING (
    clerk_user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY profiles_owner_delete ON profiles
  FOR DELETE USING (
    clerk_user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- Add a general policy for all operations by admin/service_role
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL USING (
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with authentication and application data';
COMMENT ON COLUMN profiles.clerk_user_id IS 'Clerk authentication user ID';
COMMENT ON COLUMN profiles.email IS 'User email address';
COMMENT ON COLUMN profiles.name IS 'User display name';
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier (free, plus, pro)';
COMMENT ON COLUMN profiles.resume_key IS 'S3 key for uploaded resume/CV file';
COMMENT ON COLUMN profiles.resume_filename IS 'Original filename of uploaded resume';
COMMENT ON COLUMN profiles.resume_analysis IS 'AI analysis results of resume';
