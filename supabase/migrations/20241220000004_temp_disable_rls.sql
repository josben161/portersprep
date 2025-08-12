-- Temporary fix: Disable RLS on profiles table
-- This allows the application to work while proper policies are being set up
-- WARNING: This is a temporary measure and should be re-enabled with proper policies

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Note: Re-enable RLS after applying the comprehensive fix migration
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 