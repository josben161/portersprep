-- Fix anchor_stories RLS policies to allow admin operations
-- This migration ensures that the admin client can properly bypass RLS

-- Drop existing policies
DROP POLICY IF EXISTS anchor_stories_owner_select ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_owner_insert ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_owner_update ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_owner_delete ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_admin_all ON anchor_stories;

-- Create RLS policies that allow admin operations
CREATE POLICY anchor_stories_owner_select ON anchor_stories
  FOR SELECT USING (
    user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY anchor_stories_owner_insert ON anchor_stories
  FOR INSERT WITH CHECK (
    user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY anchor_stories_owner_update ON anchor_stories
  FOR UPDATE USING (
    user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY anchor_stories_owner_delete ON anchor_stories
  FOR DELETE USING (
    user_id = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- Add a general policy for all operations by admin/service_role
CREATE POLICY anchor_stories_admin_all ON anchor_stories
  FOR ALL USING (
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  ); 