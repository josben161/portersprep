-- Comprehensive fix for assessments table and RLS policies
-- This migration ensures the table structure and RLS policies are correct

-- 1. Drop the assessments table completely and recreate it
DROP TABLE IF EXISTS assessments CASCADE;

-- 2. Create the assessments table with proper structure
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  inputs JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add indexes for better performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);

-- 4. Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- 5. Create comprehensive RLS policies that work with both user and admin access
-- Policy for users to see their own assessments
CREATE POLICY assessments_user_select ON assessments
  FOR SELECT USING (
    user_id::text = auth_clerk_id()
  );

-- Policy for users to insert their own assessments
CREATE POLICY assessments_user_insert ON assessments
  FOR INSERT WITH CHECK (
    user_id::text = auth_clerk_id()
  );

-- Policy for users to update their own assessments
CREATE POLICY assessments_user_update ON assessments
  FOR UPDATE USING (
    user_id::text = auth_clerk_id()
  );

-- Policy for users to delete their own assessments
CREATE POLICY assessments_user_delete ON assessments
  FOR DELETE USING (
    user_id::text = auth_clerk_id()
  );

-- Policy for admin/service role to do everything
CREATE POLICY assessments_admin_all ON assessments
  FOR ALL USING (
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- 6. Add comments for documentation
COMMENT ON TABLE assessments IS 'User assessment predictions and results';
COMMENT ON COLUMN assessments.inputs IS 'Input data used for prediction';
COMMENT ON COLUMN assessments.result IS 'Prediction results and scores';
COMMENT ON COLUMN assessments.user_id IS 'Reference to user profile';

-- 7. Create a function to verify RLS is working
CREATE OR REPLACE FUNCTION verify_assessments_rls()
RETURNS TEXT AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments') THEN
    RETURN 'ERROR: assessments table does not exist';
  END IF;
  
  -- Check if RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'assessments' AND rowsecurity = true
  ) THEN
    RETURN 'ERROR: RLS is not enabled on assessments table';
  END IF;
  
  -- Check if policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assessments' AND policyname = 'assessments_admin_all'
  ) THEN
    RETURN 'ERROR: admin policy does not exist';
  END IF;
  
  RETURN 'SUCCESS: assessments table and RLS policies are properly configured';
END;
$$ LANGUAGE plpgsql;

-- 8. Run the verification
SELECT verify_assessments_rls(); 