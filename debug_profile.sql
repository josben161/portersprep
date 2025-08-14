-- Debug script to check what data exists in profiles table
-- Run this in Supabase SQL Editor to see the current state

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if there are any profiles with data
SELECT 
  id,
  name,
  email,
  subscription_tier,
  resume_key,
  resume_filename,
  goals,
  industry,
  years_exp,
  gpa,
  gmat,
  resume_analysis
FROM profiles 
LIMIT 5;

-- Check if specific columns exist
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'industry'
  ) THEN 'industry column exists' ELSE 'industry column missing' END as industry_status,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'years_exp'
  ) THEN 'years_exp column exists' ELSE 'years_exp column missing' END as years_exp_status,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gpa'
  ) THEN 'gpa column exists' ELSE 'gpa column missing' END as gpa_status,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gmat'
  ) THEN 'gmat column exists' ELSE 'gmat column missing' END as gmat_status,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'goals'
  ) THEN 'goals column exists' ELSE 'goals column missing' END as goals_status;
