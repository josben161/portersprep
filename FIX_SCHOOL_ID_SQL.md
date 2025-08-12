# Fix School ID Column Type

## Immediate Fix

Run this SQL in your Supabase Dashboard SQL Editor:

```sql
-- Fix school_id column type from UUID to TEXT
ALTER TABLE applications ALTER COLUMN school_id TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'school_id';
```

## What This Does

- Changes the `school_id` column from UUID type to TEXT type
- This allows string values like "hbs", "gsb", "wharton" to be stored
- The error "invalid input syntax for type uuid: 'hbs'" will be resolved

## After Running This

1. Try creating an application again
2. The school_id should now accept string values
3. Application creation should work properly

## If Table Doesn't Exist

If the applications table doesn't exist, run this instead:

```sql
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
``` 