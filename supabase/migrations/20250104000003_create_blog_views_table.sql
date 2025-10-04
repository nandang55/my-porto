-- Create blog_views table to track page views
CREATE TABLE IF NOT EXISTS public.blog_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_ip TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Enable Row Level Security
ALTER TABLE public.blog_views ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert views (for tracking)
CREATE POLICY "Anyone can log blog views"
  ON public.blog_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policy: Authenticated users can view their own post views
CREATE POLICY "Users can view their own post views"
  ON public.blog_views
  FOR SELECT
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM public.blog_posts WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX blog_views_post_id_idx ON public.blog_views(post_id);
CREATE INDEX blog_views_viewed_at_idx ON public.blog_views(viewed_at DESC);
CREATE INDEX blog_views_post_viewed_idx ON public.blog_views(post_id, viewed_at DESC);

-- Add comments
COMMENT ON TABLE public.blog_views IS 'Blog post view tracking with timestamps';
COMMENT ON COLUMN public.blog_views.post_id IS 'Reference to the blog post that was viewed';
COMMENT ON COLUMN public.blog_views.viewed_at IS 'Timestamp when the post was viewed';
COMMENT ON COLUMN public.blog_views.user_ip IS 'IP address of the viewer (optional)';
COMMENT ON COLUMN public.blog_views.user_agent IS 'User agent string (optional)';
COMMENT ON COLUMN public.blog_views.referrer IS 'Referrer URL (optional)';
