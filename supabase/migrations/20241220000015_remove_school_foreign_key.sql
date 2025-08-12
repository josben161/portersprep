-- Remove foreign key constraint on school_id
-- Since we're using JSON file school IDs, not database school UUIDs

-- First, check if the foreign key constraint exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'applications_school_id_fkey' 
        AND table_name = 'applications'
    ) THEN
        -- Drop the foreign key constraint
        ALTER TABLE applications DROP CONSTRAINT applications_school_id_fkey;
        RAISE NOTICE 'Dropped foreign key constraint applications_school_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign key constraint applications_school_id_fkey does not exist';
    END IF;
END $$;

-- Ensure school_id is TEXT type (in case it was changed back)
ALTER TABLE applications ALTER COLUMN school_id TYPE TEXT;

-- Verify the column type
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'school_id';

-- List any remaining foreign key constraints on applications table
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='applications'; 