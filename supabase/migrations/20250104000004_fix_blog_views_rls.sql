-- Fix RLS policies for blog_views table
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can log blog views" ON public.blog_views;
DROP POLICY IF EXISTS "Users can view their own post views" ON public.blog_views;

-- Allow anyone to insert views (for public tracking)
CREATE POLICY "Public can insert blog views"
  ON public.blog_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to select view counts (for public display)
CREATE POLICY "Public can select blog views"
  ON public.blog_views
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to view detailed analytics of their own posts
CREATE POLICY "Users can view analytics of their own posts"
  ON public.blog_views
  FOR SELECT
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM public.blog_posts WHERE user_id = auth.uid()
    )
  );
