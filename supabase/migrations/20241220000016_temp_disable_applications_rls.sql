-- Temporarily disable RLS on applications table
-- This will allow the admin client to insert applications without RLS issues

-- Disable RLS on applications table
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS applications_user_select ON applications;
DROP POLICY IF EXISTS applications_user_insert ON applications;
DROP POLICY IF EXISTS applications_user_update ON applications;
DROP POLICY IF EXISTS applications_user_delete ON applications;
DROP POLICY IF EXISTS applications_admin_all ON applications;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'applications';

-- Add a comment explaining why RLS is disabled
COMMENT ON TABLE applications IS 'User applications to MBA schools (RLS temporarily disabled for admin client access)'; 