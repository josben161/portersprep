-- Create comprehensive recommendations system
-- This allows recommenders to be reused across multiple applications

-- 1. Master recommenders table (reusable across applications)
CREATE TABLE IF NOT EXISTS recommenders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  organization TEXT,
  email TEXT,
  phone TEXT,
  relationship TEXT, -- e.g., "Direct Manager", "Professor", "Mentor"
  years_known INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Recommender assignments (links recommenders to specific applications)
CREATE TABLE IF NOT EXISTS recommender_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  recommender_id UUID NOT NULL REFERENCES recommenders(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'requested', 'in_progress', 'completed', 'declined')),
  school_requirements JSONB, -- Store school-specific requirements
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(application_id, recommender_id) -- Prevent duplicate assignments
);

-- 3. Recommendation letters (individual letters for each application)
CREATE TABLE IF NOT EXISTS recommendation_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES recommender_assignments(id) ON DELETE CASCADE,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_recommenders_user_id ON recommenders(user_id);
CREATE INDEX IF NOT EXISTS idx_recommender_assignments_application_id ON recommender_assignments(application_id);
CREATE INDEX IF NOT EXISTS idx_recommender_assignments_recommender_id ON recommender_assignments(recommender_id);
CREATE INDEX IF NOT EXISTS idx_recommender_assignments_status ON recommender_assignments(status);
CREATE INDEX IF NOT EXISTS idx_recommendation_letters_assignment_id ON recommendation_letters(assignment_id);

-- Enable RLS on all tables
ALTER TABLE recommenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommender_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recommenders
CREATE POLICY recommenders_user_select ON recommenders
  FOR SELECT USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY recommenders_user_insert ON recommenders
  FOR INSERT WITH CHECK (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY recommenders_user_update ON recommenders
  FOR UPDATE USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY recommenders_user_delete ON recommenders
  FOR DELETE USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

-- RLS Policies for recommender_assignments
CREATE POLICY assignments_user_select ON recommender_assignments
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY assignments_user_insert ON recommender_assignments
  FOR INSERT WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY assignments_user_update ON recommender_assignments
  FOR UPDATE USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY assignments_user_delete ON recommender_assignments
  FOR DELETE USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

-- RLS Policies for recommendation_letters
CREATE POLICY letters_user_select ON recommendation_letters
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM recommender_assignments WHERE application_id IN (
        SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
      )
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY letters_user_insert ON recommendation_letters
  FOR INSERT WITH CHECK (
    assignment_id IN (
      SELECT id FROM recommender_assignments WHERE application_id IN (
        SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
      )
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY letters_user_update ON recommendation_letters
  FOR UPDATE USING (
    assignment_id IN (
      SELECT id FROM recommender_assignments WHERE application_id IN (
        SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
      )
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY letters_user_delete ON recommendation_letters
  FOR DELETE USING (
    assignment_id IN (
      SELECT id FROM recommender_assignments WHERE application_id IN (
        SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
      )
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

-- Add comments for documentation
COMMENT ON TABLE recommenders IS 'Master list of recommenders that can be reused across applications';
COMMENT ON TABLE recommender_assignments IS 'Links recommenders to specific applications with status tracking';
COMMENT ON TABLE recommendation_letters IS 'Individual recommendation letters for each application';
COMMENT ON COLUMN recommender_assignments.school_requirements IS 'JSON object containing school-specific requirements (format, questions, etc.)';
COMMENT ON COLUMN recommender_assignments.status IS 'Current status of the recommendation request'; 