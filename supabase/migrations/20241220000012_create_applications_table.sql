-- Create applications table if it doesn't exist
-- This table stores user applications to schools

CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  round INTEGER,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'submitted', 'accepted', 'rejected')),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_school_id ON applications(school_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS applications_user_select ON applications;
DROP POLICY IF EXISTS applications_user_insert ON applications;
DROP POLICY IF EXISTS applications_user_update ON applications;
DROP POLICY IF EXISTS applications_user_delete ON applications;
DROP POLICY IF EXISTS applications_admin_all ON applications;

-- Create RLS policies
CREATE POLICY applications_user_select ON applications
  FOR SELECT USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY applications_user_insert ON applications
  FOR INSERT WITH CHECK (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY applications_user_update ON applications
  FOR UPDATE USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY applications_user_delete ON applications
  FOR DELETE USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

-- Add a general policy for all operations
CREATE POLICY applications_admin_all ON applications
  FOR ALL USING (auth_role() = 'admin' OR auth_role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE applications IS 'User applications to MBA schools';
COMMENT ON COLUMN applications.school_id IS 'Reference to school ID from schools data';
COMMENT ON COLUMN applications.round IS 'Application round (1, 2, 3)';
COMMENT ON COLUMN applications.status IS 'Application status';
COMMENT ON COLUMN applications.deadline IS 'Application deadline date'; 