-- Allow authenticated users to view other users' published projects (for public tenant pages)
-- This is needed for logged-in users to view public portfolio pages of other tenants

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Users can only view own projects" ON public.projects;

-- Create a better policy: Authenticated users can view their own projects OR any published project
CREATE POLICY "Authenticated can view own and published projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR published = true
  );

-- Note: This single policy replaces two separate policies with OR logic:
-- - Authenticated users can see their OWN projects (draft or published) -> auth.uid() = user_id
-- - Authenticated users can see OTHER USERS' published projects -> published = true
-- - This allows logged-in users to:
--   1. Manage their own projects in admin panel (including drafts)
--   2. Browse other people's public portfolios (published only)

COMMENT ON POLICY "Authenticated can view own and published projects" ON public.projects 
  IS 'Allows authenticated users to view their own projects (all) and other users published projects';

