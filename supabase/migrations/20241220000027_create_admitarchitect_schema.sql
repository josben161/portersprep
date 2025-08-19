-- Create the Admitarchitect schema
CREATE SCHEMA IF NOT EXISTS "Admitarchitect";

-- Move existing tables to the Admitarchitect schema
-- First, create the tables in the new schema with the correct structure

-- Create profiles table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL UNIQUE,
  email text NOT NULL,
  name text,
  subscription_tier text NOT NULL DEFAULT 'free'::text CHECK (subscription_tier = ANY (ARRAY['free'::text, 'plus'::text, 'pro'::text])),
  stripe_customer_id text,
  resume_key text,
  resume_filename text,
  years_exp integer,
  industry text,
  goals text,
  gpa numeric,
  gmat integer,
  undergrad text,
  citizenship text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Create applications table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  school_id text NOT NULL,
  school_name text NOT NULL,
  round text,
  target_year integer,
  status text NOT NULL DEFAULT 'planning'::text CHECK (status = ANY (ARRAY['planning'::text, 'drafting'::text, 'submitted'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES "Admitarchitect".profiles(id)
);

-- Create anchor_stories table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".anchor_stories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  competency_tags text[] DEFAULT '{}'::text[],
  impact_score integer,
  usage_counts jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT anchor_stories_pkey PRIMARY KEY (id),
  CONSTRAINT anchor_stories_user_id_fkey FOREIGN KEY (user_id) REFERENCES "Admitarchitect".profiles(id)
);

-- Create assessments table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  inputs jsonb NOT NULL,
  result jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT assessments_pkey PRIMARY KEY (id),
  CONSTRAINT assessments_user_id_fkey FOREIGN KEY (user_id) REFERENCES "Admitarchitect".profiles(id)
);

-- Create job_queue table in Admitarchitect schema
CREATE SEQUENCE IF NOT EXISTS "Admitarchitect".job_queue_id_seq;
CREATE TABLE IF NOT EXISTS "Admitarchitect".job_queue (
  id bigint NOT NULL DEFAULT nextval('"Admitarchitect".job_queue_id_seq'::regclass),
  job_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued'::text CHECK (status = ANY (ARRAY['queued'::text, 'running'::text, 'done'::text, 'failed'::text])),
  attempts integer NOT NULL DEFAULT 0,
  result jsonb,
  error text,
  scheduled_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT job_queue_pkey PRIMARY KEY (id)
);

-- Create recommenders table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".recommenders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  relationship text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT recommenders_pkey PRIMARY KEY (id),
  CONSTRAINT recommenders_user_id_fkey FOREIGN KEY (user_id) REFERENCES "Admitarchitect".profiles(id)
);

-- Create recommender_assignments table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".recommender_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recommender_id uuid NOT NULL,
  application_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'invited'::text CHECK (status = ANY (ARRAY['invited'::text, 'drafting'::text, 'submitted'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT recommender_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT recommender_assignments_recommender_id_fkey FOREIGN KEY (recommender_id) REFERENCES "Admitarchitect".recommenders(id),
  CONSTRAINT recommender_assignments_application_id_fkey FOREIGN KEY (application_id) REFERENCES "Admitarchitect".applications(id)
);

-- Create recommender_packets table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".recommender_packets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL,
  content_md text,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT recommender_packets_pkey PRIMARY KEY (id),
  CONSTRAINT recommender_packets_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES "Admitarchitect".recommender_assignments(id)
);

-- Create application_questions table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".application_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['short'::text, 'long'::text])),
  title text NOT NULL,
  prompt text NOT NULL,
  word_limit integer,
  source_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT application_questions_pkey PRIMARY KEY (id),
  CONSTRAINT application_questions_application_id_fkey FOREIGN KEY (application_id) REFERENCES "Admitarchitect".applications(id)
);

-- Create application_answers table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".application_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL,
  question_id uuid NOT NULL,
  archetype text,
  title text,
  content_format text NOT NULL DEFAULT 'pm'::text CHECK (content_format = ANY (ARRAY['md'::text, 'pm'::text])),
  content_pm jsonb,
  content_md text,
  content_text_cache text,
  word_count integer NOT NULL DEFAULT 0,
  content_s3_key text,
  liveblocks_room_id text,
  lineage jsonb,
  rubric jsonb,
  analysis_status text NOT NULL DEFAULT 'idle'::text CHECK (analysis_status = ANY (ARRAY['idle'::text, 'queued'::text, 'running'::text, 'done'::text, 'failed'::text])),
  last_analysis jsonb,
  analyzed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT application_answers_pkey PRIMARY KEY (id),
  CONSTRAINT application_answers_application_id_fkey FOREIGN KEY (application_id) REFERENCES "Admitarchitect".applications(id),
  CONSTRAINT application_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES "Admitarchitect".application_questions(id)
);

-- Create shared_links table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".shared_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resource_type text NOT NULL CHECK (resource_type = 'answer'::text),
  answer_id uuid,
  permission text NOT NULL CHECK (permission = ANY (ARRAY['comment'::text, 'edit'::text, 'view'::text])),
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT shared_links_pkey PRIMARY KEY (id),
  CONSTRAINT shared_links_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES "Admitarchitect".application_answers(id)
);

-- Create stripe_event_log table in Admitarchitect schema
CREATE TABLE IF NOT EXISTS "Admitarchitect".stripe_event_log (
  id text NOT NULL,
  type text,
  received_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT stripe_event_log_pkey PRIMARY KEY (id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON "Admitarchitect".profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON "Admitarchitect".applications(user_id);
CREATE INDEX IF NOT EXISTS idx_anchor_stories_user_id ON "Admitarchitect".anchor_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON "Admitarchitect".assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_recommenders_user_id ON "Admitarchitect".recommenders(user_id);
CREATE INDEX IF NOT EXISTS idx_application_questions_application_id ON "Admitarchitect".application_questions(application_id);
CREATE INDEX IF NOT EXISTS idx_application_answers_application_id ON "Admitarchitect".application_answers(application_id);
CREATE INDEX IF NOT EXISTS idx_application_answers_question_id ON "Admitarchitect".application_answers(question_id);

-- Disable RLS on all tables for now (can be enabled later with proper policies)
ALTER TABLE "Admitarchitect".profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".anchor_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".job_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".recommenders DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".recommender_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".recommender_packets DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".application_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".application_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".shared_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Admitarchitect".stripe_event_log DISABLE ROW LEVEL SECURITY;
