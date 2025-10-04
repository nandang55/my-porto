-- Fix RLS policy for blog_posts to only show published posts to public
-- This ensures draft posts are only visible to authenticated owners

-- Drop existing public policy
DROP POLICY IF EXISTS "Public can view blog posts" ON public.blog_posts;

-- Create new policy: Public can ONLY view published posts
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  TO public
  USING (published = true);

-- Add comment
COMMENT ON POLICY "Public can view published blog posts" ON public.blog_posts 
IS 'Public users can only view blog posts that are published. Draft posts are hidden.';
