-- Temporarily disable RLS on anchor_stories table to fix creation issues
-- This is a temporary fix until the proper RLS policies can be applied

-- Disable RLS temporarily
ALTER TABLE anchor_stories DISABLE ROW LEVEL SECURITY;

-- Add comment for tracking
COMMENT ON TABLE anchor_stories IS 'User anchor stories for MBA applications (RLS temporarily disabled)'; 