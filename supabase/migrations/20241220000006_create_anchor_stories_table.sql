-- Create anchor_stories table if it doesn't exist
-- This table stores user stories for applications

CREATE TABLE IF NOT EXISTS anchor_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_anchor_stories_user_id ON anchor_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_anchor_stories_created_at ON anchor_stories(created_at);

-- Add RLS policies
ALTER TABLE anchor_stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS anchor_stories_owner_select ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_owner_insert ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_owner_update ON anchor_stories;
DROP POLICY IF EXISTS anchor_stories_owner_delete ON anchor_stories;

-- Create RLS policies
CREATE POLICY anchor_stories_owner_select ON anchor_stories
  FOR SELECT USING (user_id = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY anchor_stories_owner_insert ON anchor_stories
  FOR INSERT WITH CHECK (user_id = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY anchor_stories_owner_update ON anchor_stories
  FOR UPDATE USING (user_id = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY anchor_stories_owner_delete ON anchor_stories
  FOR DELETE USING (user_id = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE anchor_stories IS 'User anchor stories for MBA applications';
COMMENT ON COLUMN anchor_stories.title IS 'Story title';
COMMENT ON COLUMN anchor_stories.summary IS 'Story description/summary';
COMMENT ON COLUMN anchor_stories.tags IS 'Story tags for categorization'; 