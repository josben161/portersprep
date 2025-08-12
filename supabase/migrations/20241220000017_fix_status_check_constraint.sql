-- Fix status check constraint on applications table
-- This ensures the status column accepts the correct values

-- First, drop the existing constraint if it exists
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the correct check constraint
ALTER TABLE applications ADD CONSTRAINT applications_status_check 
  CHECK (status IN ('planning', 'in_progress', 'submitted', 'accepted', 'rejected'));

-- Set default value if not already set
ALTER TABLE applications ALTER COLUMN status SET DEFAULT 'planning';

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'applications'::regclass 
  AND conname = 'applications_status_check';

-- Show current status values in the table (if any exist)
SELECT DISTINCT status FROM applications; 