-- Update Row Level Security policies for multi-tenant architecture
-- Each user can only manage their own data

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

-- New policies: Public can view published projects from any user
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (published = true);

-- Users can view their own projects (including drafts)
CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- BLOG_POSTS TABLE POLICIES
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "Public can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;

-- New policies: Public can view all blog posts
CREATE POLICY "Public can view blog posts"
  ON public.blog_posts
  FOR SELECT
  TO public
  USING (true);

-- Users can view their own blog posts
CREATE POLICY "Users can view own blog posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own blog posts
CREATE POLICY "Users can insert own blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own blog posts
CREATE POLICY "Users can update own blog posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own blog posts
CREATE POLICY "Users can delete own blog posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- CONTACT_MESSAGES TABLE POLICIES
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can send messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON public.contact_messages;

-- New policies: Anyone can insert messages (public contact form)
CREATE POLICY "Anyone can send messages"
  ON public.contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view messages sent to them
CREATE POLICY "Users can view own messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.projects IS 'Portfolio projects - multi-tenant with user_id isolation';
COMMENT ON TABLE public.blog_posts IS 'Blog posts - multi-tenant with user_id isolation';
COMMENT ON TABLE public.contact_messages IS 'Contact messages - routed to specific user portfolios';

