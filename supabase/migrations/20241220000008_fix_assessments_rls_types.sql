-- Fix RLS policies for assessments table with proper type casting
-- This ensures the predict/run API can insert new assessment records

-- First, ensure the assessments table exists with proper structure
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

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS assessments_owner_select ON assessments;
DROP POLICY IF EXISTS assessments_owner_insert ON assessments;
DROP POLICY IF EXISTS assessments_owner_update ON assessments;
DROP POLICY IF EXISTS assessments_owner_delete ON assessments;
DROP POLICY IF EXISTS assessments_admin_all ON assessments;

-- Create comprehensive RLS policies with proper type casting
CREATE POLICY assessments_owner_select ON assessments
  FOR SELECT USING (
    user_id::text = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY assessments_owner_insert ON assessments
  FOR INSERT WITH CHECK (
    user_id::text = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY assessments_owner_update ON assessments
  FOR UPDATE USING (
    user_id::text = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

CREATE POLICY assessments_owner_delete ON assessments
  FOR DELETE USING (
    user_id::text = auth_clerk_id() OR 
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- Add a general policy for all operations
CREATE POLICY assessments_admin_all ON assessments
  FOR ALL USING (
    auth_role() = 'admin' OR 
    auth_role() = 'service_role'
  );

-- Add comments for documentation
COMMENT ON TABLE assessments IS 'User assessment predictions and results';
COMMENT ON COLUMN assessments.inputs IS 'Input data used for prediction';
COMMENT ON COLUMN assessments.result IS 'Prediction results and scores'; 