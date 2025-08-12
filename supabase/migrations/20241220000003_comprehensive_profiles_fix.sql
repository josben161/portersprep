-- Comprehensive fix for profiles table
-- This migration ensures the table structure and RLS policies are correct

-- 1. Ensure resume_key column exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS resume_key TEXT;

-- 2. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_resume_key ON profiles(resume_key);

-- 3. Drop all existing RLS policies to start fresh
DROP POLICY IF EXISTS profiles_owner_select ON profiles;
DROP POLICY IF EXISTS profiles_owner_insert ON profiles;
DROP POLICY IF EXISTS profiles_owner_update ON profiles;
DROP POLICY IF EXISTS profiles_owner_upsert ON profiles;
DROP POLICY IF EXISTS profiles_owner_delete ON profiles;

-- 4. Create comprehensive RLS policies that allow admin operations
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

-- 5. Add a general policy for all operations
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL USING (
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- 6. Add comments for documentation
COMMENT ON COLUMN profiles.resume_key IS 'S3 key for uploaded resume/CV file';
COMMENT ON TABLE profiles IS 'User profiles with authentication and application data'; 