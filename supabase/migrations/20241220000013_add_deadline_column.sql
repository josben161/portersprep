-- Add deadline column to applications table
-- This migration adds the missing deadline column

-- Add deadline column if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS deadline DATE;

-- Add comment for documentation
COMMENT ON COLUMN applications.deadline IS 'Application deadline date'; 