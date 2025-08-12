-- Fix school_id column type to ensure it's TEXT
-- This migration ensures the school_id column is properly defined as TEXT

-- First, check if the applications table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
        -- Check if school_id column exists and its current type
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'school_id') THEN
            -- If it's UUID, change it to TEXT
            IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'school_id') = 'uuid' THEN
                ALTER TABLE applications ALTER COLUMN school_id TYPE TEXT;
                RAISE NOTICE 'Changed school_id column from UUID to TEXT';
            ELSE
                RAISE NOTICE 'school_id column is already TEXT type';
            END IF;
        ELSE
            -- Add school_id column if it doesn't exist
            ALTER TABLE applications ADD COLUMN school_id TEXT NOT NULL;
            RAISE NOTICE 'Added school_id column as TEXT';
        END IF;
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            school_id TEXT NOT NULL,
            round INTEGER,
            status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'submitted', 'accepted', 'rejected')),
            deadline DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created applications table with TEXT school_id';
    END IF;
END $$;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_school_id ON applications(school_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS applications_user_select ON applications;
DROP POLICY IF EXISTS applications_user_insert ON applications;
DROP POLICY IF EXISTS applications_user_update ON applications;
DROP POLICY IF EXISTS applications_user_delete ON applications;
DROP POLICY IF EXISTS applications_admin_all ON applications;

-- Create RLS policies
CREATE POLICY applications_user_select ON applications
  FOR SELECT USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY applications_user_insert ON applications
  FOR INSERT WITH CHECK (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY applications_user_update ON applications
  FOR UPDATE USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

CREATE POLICY applications_user_delete ON applications
  FOR DELETE USING (user_id::text = auth_clerk_id() OR auth_role() = 'admin' OR auth_role() = 'service_role');

-- Add a general policy for all operations
CREATE POLICY applications_admin_all ON applications
  FOR ALL USING (auth_role() = 'admin' OR auth_role() = 'service_role');

-- Verify the column type
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'school_id'; 