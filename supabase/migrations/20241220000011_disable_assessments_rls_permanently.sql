-- Permanently disable RLS on assessments table
-- This ensures admin operations work without any RLS interference

-- Ensure the assessments table exists
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  inputs JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);

-- PERMANENTLY DISABLE RLS - This is the definitive fix
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS assessments_user_select ON assessments;
DROP POLICY IF EXISTS assessments_user_insert ON assessments;
DROP POLICY IF EXISTS assessments_user_update ON assessments;
DROP POLICY IF EXISTS assessments_user_delete ON assessments;
DROP POLICY IF EXISTS assessments_admin_all ON assessments;
DROP POLICY IF EXISTS assessments_owner_select ON assessments;
DROP POLICY IF EXISTS assessments_owner_insert ON assessments;
DROP POLICY IF EXISTS assessments_owner_update ON assessments;
DROP POLICY IF EXISTS assessments_owner_delete ON assessments;

-- Add comments for documentation
COMMENT ON TABLE assessments IS 'User assessment predictions and results - RLS DISABLED for admin operations';
COMMENT ON COLUMN assessments.inputs IS 'Input data used for prediction';
COMMENT ON COLUMN assessments.result IS 'Prediction results and scores';
COMMENT ON COLUMN assessments.user_id IS 'Reference to user profile';

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity = false THEN 'SUCCESS: RLS is DISABLED'
    ELSE 'ERROR: RLS is still ENABLED'
  END as status
FROM pg_tables 
WHERE tablename = 'assessments'; 