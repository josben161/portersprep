-- Fix RLS policies for profiles table to allow admin operations
-- Drop existing policies
DROP POLICY IF EXISTS profiles_owner_select ON profiles;
DROP POLICY IF EXISTS profiles_owner_insert ON profiles;
DROP POLICY IF EXISTS profiles_owner_update ON profiles;

-- Create new policies that allow admin operations
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

-- Also allow upsert operations
CREATE POLICY profiles_owner_upsert ON profiles
  FOR ALL USING (
    clerk_user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  ); 