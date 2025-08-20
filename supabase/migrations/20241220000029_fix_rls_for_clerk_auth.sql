-- Fix RLS policies to work with Clerk authentication
-- Since we're using Clerk for auth, we need to disable RLS or use service role for all operations

-- Disable RLS on profiles table since we're using Clerk auth
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies since we're disabling RLS
DROP POLICY IF EXISTS profiles_owner_select ON profiles;
DROP POLICY IF EXISTS profiles_owner_insert ON profiles;
DROP POLICY IF EXISTS profiles_owner_update ON profiles;
DROP POLICY IF EXISTS profiles_owner_delete ON profiles;
DROP POLICY IF EXISTS profiles_admin_all ON profiles;

-- Also fix applications table RLS
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop applications policies
DROP POLICY IF EXISTS applications_user_select ON applications;
DROP POLICY IF EXISTS applications_user_insert ON applications;
DROP POLICY IF EXISTS applications_user_update ON applications;
DROP POLICY IF EXISTS applications_user_delete ON applications;
DROP POLICY IF EXISTS applications_admin_all ON applications;

-- Fix anchor_stories table RLS if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'anchor_stories') THEN
        ALTER TABLE anchor_stories DISABLE ROW LEVEL SECURITY;
        
        -- Drop anchor_stories policies
        DROP POLICY IF EXISTS anchor_stories_user_select ON anchor_stories;
        DROP POLICY IF EXISTS anchor_stories_user_insert ON anchor_stories;
        DROP POLICY IF EXISTS anchor_stories_user_update ON anchor_stories;
        DROP POLICY IF EXISTS anchor_stories_user_delete ON anchor_stories;
        DROP POLICY IF EXISTS anchor_stories_admin_all ON anchor_stories;
    END IF;
END $$;

-- Fix recommendations table RLS if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'recommendations') THEN
        ALTER TABLE recommendations DISABLE ROW LEVEL SECURITY;
        
        -- Drop recommendations policies
        DROP POLICY IF EXISTS recommendations_user_select ON recommendations;
        DROP POLICY IF EXISTS recommendations_user_insert ON recommendations;
        DROP POLICY IF EXISTS recommendations_user_update ON recommendations;
        DROP POLICY IF EXISTS recommendations_user_delete ON recommendations;
        DROP POLICY IF EXISTS recommendations_admin_all ON recommendations;
    END IF;
END $$;

-- Fix assessments table RLS if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments') THEN
        ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
        
        -- Drop assessments policies
        DROP POLICY IF EXISTS assessments_user_select ON assessments;
        DROP POLICY IF EXISTS assessments_user_insert ON assessments;
        DROP POLICY IF EXISTS assessments_user_update ON assessments;
        DROP POLICY IF EXISTS assessments_user_delete ON assessments;
        DROP POLICY IF EXISTS assessments_admin_all ON assessments;
    END IF;
END $$;

-- Add comments explaining the RLS approach
COMMENT ON TABLE profiles IS 'User profiles with authentication and application data - RLS disabled, using Clerk auth with service role';
COMMENT ON TABLE applications IS 'User applications to MBA schools - RLS disabled, using Clerk auth with service role';
