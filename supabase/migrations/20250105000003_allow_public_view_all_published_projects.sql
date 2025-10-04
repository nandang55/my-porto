-- Allow public (anyone) to view published projects
-- This restores the original behavior where anyone can view published projects

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anonymous can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only view own projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can view own and published projects" ON public.projects;

-- Policy 1: Public (anyone - authenticated or not) can view all published projects
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (published = true);

-- Policy 2: Authenticated users can view their own projects (including drafts)
CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Note: These two policies work together with OR logic:
-- 1. Anyone (logged in or not) can see published projects
-- 2. Logged-in users can also see their own draft projects
-- 
-- This allows:
-- - Public users: view all published projects (for public portfolios)
-- - Authenticated users: view all published projects + their own drafts (for admin panel)

COMMENT ON POLICY "Public can view published projects" ON public.projects 
  IS 'Allows anyone to view published projects on public portfolio pages';
  
COMMENT ON POLICY "Users can view own projects" ON public.projects 
  IS 'Allows authenticated users to view and manage their own projects including drafts';

