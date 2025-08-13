-- Fix missing columns in applications table
-- This migration adds any missing columns that might be needed

-- Add created_at column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add updated_at column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add round column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS round INTEGER;

-- Add status column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'planning';

-- Add deadline column if it doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS deadline DATE;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position; 