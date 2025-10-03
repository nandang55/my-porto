-- Create portfolios table for multi-tenant support
-- Each user has their own portfolio with custom slug (e.g., /john, /jane)

CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  custom_domain TEXT UNIQUE,
  theme_color TEXT DEFAULT '#0284c7',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view active portfolios
CREATE POLICY "Public can view active portfolios"
  ON public.portfolios
  FOR SELECT
  USING (is_active = true);

-- RLS Policy: Users can view their own portfolio
CREATE POLICY "Users can view their own portfolio"
  ON public.portfolios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own portfolio
CREATE POLICY "Users can insert their own portfolio"
  ON public.portfolios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own portfolio
CREATE POLICY "Users can update their own portfolio"
  ON public.portfolios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX portfolios_user_id_idx ON public.portfolios(user_id);
CREATE INDEX portfolios_slug_idx ON public.portfolios(slug);
CREATE INDEX portfolios_is_active_idx ON public.portfolios(is_active);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-update
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.portfolios IS 'User portfolios for multi-tenant support';
COMMENT ON COLUMN public.portfolios.slug IS 'Unique URL slug for accessing portfolio (e.g., /john)';
COMMENT ON COLUMN public.portfolios.user_id IS 'Owner of this portfolio (references auth.users)';
COMMENT ON COLUMN public.portfolios.is_active IS 'Whether portfolio is active and visible to public';

