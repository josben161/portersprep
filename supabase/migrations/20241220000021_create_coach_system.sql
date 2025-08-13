-- Create coach system tables
-- This migration adds support for The Admit Coach AI assistant

-- Coach conversations table
CREATE TABLE IF NOT EXISTS coach_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach memory table for storing user insights and preferences
CREATE TABLE IF NOT EXISTS coach_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('preference', 'insight', 'progress', 'goal')),
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_coach_conversations_user_id ON coach_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_conversations_created_at ON coach_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_coach_memory_user_id ON coach_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_memory_type ON coach_memory(memory_type);

-- Row Level Security policies
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_memory ENABLE ROW LEVEL SECURITY;

-- Coach conversations policies
CREATE POLICY "Users can view their own conversations" ON coach_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON coach_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON coach_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Coach memory policies
CREATE POLICY "Users can view their own memory" ON coach_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory" ON coach_memory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory" ON coach_memory
  FOR UPDATE USING (auth.uid() = user_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coach_conversations_updated_at 
  BEFORE UPDATE ON coach_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_memory_updated_at 
  BEFORE UPDATE ON coach_memory 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 