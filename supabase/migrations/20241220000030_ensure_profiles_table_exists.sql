-- Ensure profiles table exists with a simple approach
-- This migration will create the table if it doesn't exist

DO $$
BEGIN
    -- Check if profiles table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- Create profiles table
        CREATE TABLE profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            clerk_user_id TEXT UNIQUE NOT NULL,
            email TEXT,
            name TEXT,
            subscription_tier TEXT DEFAULT 'free',
            resume_key TEXT,
            resume_filename TEXT,
            resume_analysis JSONB,
            years_exp INTEGER,
            industry TEXT,
            goals TEXT,
            gpa NUMERIC(3,2),
            gmat INTEGER,
            undergrad TEXT,
            citizenship TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add indexes
        CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
        CREATE INDEX idx_profiles_email ON profiles(email);
        CREATE INDEX idx_profiles_created_at ON profiles(created_at);

        -- Disable RLS
        ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

        RAISE NOTICE 'Profiles table created successfully';
    ELSE
        RAISE NOTICE 'Profiles table already exists';
    END IF;
END $$;

-- Ensure applications table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
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

        -- Add indexes
        CREATE INDEX idx_applications_user_id ON applications(user_id);
        CREATE INDEX idx_applications_school_id ON applications(school_id);
        CREATE INDEX idx_applications_status ON applications(status);
        CREATE INDEX idx_applications_created_at ON applications(created_at);

        -- Disable RLS
        ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

        RAISE NOTICE 'Applications table created successfully';
    ELSE
        RAISE NOTICE 'Applications table already exists';
    END IF;
END $$;

-- Ensure anchor_stories table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'anchor_stories') THEN
        CREATE TABLE anchor_stories (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            summary TEXT,
            competency_tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add indexes
        CREATE INDEX idx_anchor_stories_user_id ON anchor_stories(user_id);
        CREATE INDEX idx_anchor_stories_created_at ON anchor_stories(created_at);

        -- Disable RLS
        ALTER TABLE anchor_stories DISABLE ROW LEVEL SECURITY;

        RAISE NOTICE 'Anchor stories table created successfully';
    ELSE
        RAISE NOTICE 'Anchor stories table already exists';
    END IF;
END $$;
