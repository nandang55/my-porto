-- Fix RLS policies for projects to ensure users only see their own projects in admin panel
-- Public can still view all published projects on public pages

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;

-- New policy: Anonymous users can view all published projects
CREATE POLICY "Anonymous can view published projects"
  ON public.projects
  FOR SELECT
  TO anon
  USING (published = true);

-- New policy: Authenticated users can only view their own projects
-- This ensures admin panel only shows user's own projects
CREATE POLICY "Users can only view own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Note: This change ensures that:
-- 1. Public/anonymous users can view all published projects (for public portfolio pages)
-- 2. Authenticated/logged-in users can ONLY see their own projects (for admin panel, landing page builder, etc.)
-- 3. Users cannot see other users' projects even if published when they are logged in

COMMENT ON POLICY "Anonymous can view published projects" ON public.projects 
  IS 'Allows public access to view all published projects on public portfolio pages';
COMMENT ON POLICY "Users can only view own projects" ON public.projects 
  IS 'Restricts authenticated users to only view and manage their own projects';

