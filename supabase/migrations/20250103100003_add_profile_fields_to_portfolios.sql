-- Add comprehensive profile fields to portfolios table
-- For complete professional portfolio

-- Add profile fields
ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS skills TEXT[],
  ADD COLUMN IF NOT EXISTS languages TEXT[],
  ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS resume_url TEXT,
  ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS hourly_rate TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- Create index for username searches
CREATE INDEX IF NOT EXISTS portfolios_username_idx ON public.portfolios(username);

-- Add constraints
ALTER TABLE public.portfolios
  ADD CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_-]{3,30}$'),
  ADD CONSTRAINT availability_status_check CHECK (availability_status IN ('available', 'busy', 'unavailable'));

-- Add comments
COMMENT ON COLUMN public.portfolios.username IS 'Display username (can have uppercase, different from slug)';
COMMENT ON COLUMN public.portfolios.title IS 'Professional title/role (e.g., Senior Developer)';
COMMENT ON COLUMN public.portfolios.company IS 'Current company/employer';
COMMENT ON COLUMN public.portfolios.years_experience IS 'Years of professional experience';
COMMENT ON COLUMN public.portfolios.skills IS 'Array of professional skills';
COMMENT ON COLUMN public.portfolios.languages IS 'Array of spoken languages';
COMMENT ON COLUMN public.portfolios.education IS 'Array of education objects (degree, school, year)';
COMMENT ON COLUMN public.portfolios.certifications IS 'Array of certification objects (name, issuer, year)';
COMMENT ON COLUMN public.portfolios.resume_url IS 'URL to downloadable resume/CV';
COMMENT ON COLUMN public.portfolios.availability_status IS 'Current availability: available, busy, unavailable';
COMMENT ON COLUMN public.portfolios.hourly_rate IS 'Hourly rate for freelance work (e.g., $50/hr)';
COMMENT ON COLUMN public.portfolios.timezone IS 'User timezone (e.g., America/New_York)';
COMMENT ON COLUMN public.portfolios.meta_title IS 'SEO meta title for portfolio page';
COMMENT ON COLUMN public.portfolios.meta_description IS 'SEO meta description for portfolio page';
COMMENT ON COLUMN public.portfolios.meta_keywords IS 'SEO keywords array';

