# Immediate Fix for Foreign Key Constraint Error

## The Problem
The error shows that there's a foreign key constraint trying to link `applications.school_id` (TEXT) to `schools.id` (UUID), but we're using string school IDs from JSON files, not database UUIDs.

## Run This SQL in Supabase Dashboard

```sql
-- Remove the foreign key constraint that's causing the error
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_school_id_fkey;

-- Ensure school_id is TEXT type
ALTER TABLE applications ALTER COLUMN school_id TYPE TEXT;

-- Verify the fix worked
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'school_id';
```

## What This Does

1. **Removes Foreign Key** - Drops the constraint linking to schools table
2. **Ensures TEXT Type** - Makes sure school_id accepts string values
3. **Allows JSON IDs** - Now accepts "hbs", "gsb", "wharton" etc.

## After Running This

1. Try creating an application again
2. Select any school (Harvard, Stanford, etc.)
3. Application should create successfully ✅

## Why This Works

- We're using JSON file school data, not database school records
- The foreign key constraint was unnecessary
- String school IDs work perfectly for our use case 