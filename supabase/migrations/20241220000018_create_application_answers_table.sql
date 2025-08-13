-- Create application_answers table for storing essay responses
-- This table stores user answers to application questions

CREATE TABLE IF NOT EXISTS application_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_application_answers_application_id ON application_answers(application_id);
CREATE INDEX IF NOT EXISTS idx_application_answers_question_id ON application_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_application_answers_created_at ON application_answers(created_at);

-- Enable RLS
ALTER TABLE application_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS application_answers_user_select ON application_answers;
DROP POLICY IF EXISTS application_answers_user_insert ON application_answers;
DROP POLICY IF EXISTS application_answers_user_update ON application_answers;
DROP POLICY IF EXISTS application_answers_user_delete ON application_answers;
DROP POLICY IF EXISTS application_answers_admin_all ON application_answers;

-- Create RLS policies
CREATE POLICY application_answers_user_select ON application_answers
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY application_answers_user_insert ON application_answers
  FOR INSERT WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY application_answers_user_update ON application_answers
  FOR UPDATE USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

CREATE POLICY application_answers_user_delete ON application_answers
  FOR DELETE USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id::text = auth_clerk_id()
    ) OR auth_role() = 'admin' OR auth_role() = 'service_role'
  );

-- Add a general policy for all operations
CREATE POLICY application_answers_admin_all ON application_answers
  FOR ALL USING (auth_role() = 'admin' OR auth_role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE application_answers IS 'User answers to application questions/essays';
COMMENT ON COLUMN application_answers.question_id IS 'Identifier for the question (e.g., essay_0, essay_1)';
COMMENT ON COLUMN application_answers.content IS 'The actual essay content';
COMMENT ON COLUMN application_answers.analysis IS 'AI analysis results stored as JSON'; 