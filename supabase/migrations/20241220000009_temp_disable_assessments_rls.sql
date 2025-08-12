-- Temporarily disable RLS on assessments table to get predictions working
-- This is a temporary fix until we can properly configure RLS policies

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

-- Temporarily disable RLS to allow admin operations
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE assessments IS 'User assessment predictions and results';
COMMENT ON COLUMN assessments.inputs IS 'Input data used for prediction';
COMMENT ON COLUMN assessments.result IS 'Prediction results and scores'; 