-- Givio Database Schema
-- Phase 2: User Profiles and Core Tables
-- Run this in Supabase SQL Editor

-- ============================================
-- EXTENSION: Enable pgvector for AI embeddings
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- TABLE: User Profiles
-- ============================================
-- This table stores additional user information beyond auth.users
-- It's automatically populated when a new user signs up

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TABLE: Recipients (People you're buying gifts for)
-- ============================================
CREATE TABLE IF NOT EXISTS public.recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT, -- e.g., "friend", "parent", "sibling", "colleague"
  birth_date DATE,
  interests JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  notes TEXT,
  embedding vector(1536), -- For AI-powered matching
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipients
CREATE POLICY "Users can view their own recipients"
  ON public.recipients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create recipients"
  ON public.recipients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipients"
  ON public.recipients
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipients"
  ON public.recipients
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON public.recipients(user_id);

-- ============================================
-- TABLE: Occasions (Events to give gifts for)
-- ============================================
CREATE TABLE IF NOT EXISTS public.occasions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.recipients(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Birthday", "Christmas", "Anniversary"
  date DATE,
  recurring BOOLEAN DEFAULT FALSE,
  reminder_days INTEGER DEFAULT 7,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for occasions
CREATE POLICY "Users can view their own occasions"
  ON public.occasions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create occasions"
  ON public.occasions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own occasions"
  ON public.occasions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own occasions"
  ON public.occasions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_occasions_user_id ON public.occasions(user_id);
CREATE INDEX IF NOT EXISTS idx_occasions_recipient_id ON public.occasions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_occasions_date ON public.occasions(date);

-- ============================================
-- TABLE: Gift Ideas (Saved or recommended gifts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.gift_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.recipients(id) ON DELETE SET NULL,
  occasion_id UUID REFERENCES public.occasions(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  url TEXT,
  image_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'idea', -- 'idea', 'purchased', 'given'
  sentiment_score FLOAT,
  ai_reasoning TEXT, -- Why AI recommended this
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.gift_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gift_ideas
CREATE POLICY "Users can view their own gift ideas"
  ON public.gift_ideas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create gift ideas"
  ON public.gift_ideas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gift ideas"
  ON public.gift_ideas
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gift ideas"
  ON public.gift_ideas
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gift_ideas_user_id ON public.gift_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_gift_ideas_recipient_id ON public.gift_ideas(recipient_id);
CREATE INDEX IF NOT EXISTS idx_gift_ideas_status ON public.gift_ideas(status);

-- ============================================
-- TABLE: Gift Trends (Trending gift data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.gift_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  season TEXT,
  trends JSONB DEFAULT '[]',
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Gift trends are public/cached data, no RLS needed
-- But we'll still enable it for consistency
ALTER TABLE public.gift_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gift trends are readable by authenticated users"
  ON public.gift_trends
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipients_updated_at
  BEFORE UPDATE ON public.recipients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_occasions_updated_at
  BEFORE UPDATE ON public.occasions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_ideas_updated_at
  BEFORE UPDATE ON public.gift_ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- FUNCTION: Vector similarity search for gifts
-- ============================================
CREATE OR REPLACE FUNCTION public.match_gifts(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    gift_ideas.id,
    gift_ideas.name,
    gift_ideas.description,
    gift_ideas.category,
    1 - (gift_ideas.embedding <=> query_embedding) AS similarity
  FROM public.gift_ideas
  WHERE 
    gift_ideas.embedding IS NOT NULL
    AND 1 - (gift_ideas.embedding <=> query_embedding) > match_threshold
  ORDER BY gift_ideas.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================
-- FUNCTION: Vector search for recipient matching
-- ============================================
CREATE OR REPLACE FUNCTION public.match_recipients(
  query_embedding vector(1536),
  target_user_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  relationship TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    recipients.id,
    recipients.name,
    recipients.relationship,
    1 - (recipients.embedding <=> query_embedding) AS similarity
  FROM public.recipients
  WHERE 
    recipients.user_id = target_user_id
    AND recipients.embedding IS NOT NULL
  ORDER BY recipients.embedding <=> query_embedding
  LIMIT match_count;
$$;
