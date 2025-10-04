-- Create project_views table to track project page views
CREATE TABLE IF NOT EXISTS public.project_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_ip TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Enable Row Level Security
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert views (for tracking)
CREATE POLICY "Public can insert project views"
  ON public.project_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policy: Anyone can select view counts (for public display)
CREATE POLICY "Public can select project views"
  ON public.project_views
  FOR SELECT
  TO public
  USING (true);

-- RLS Policy: Authenticated users can view detailed analytics of their own projects
CREATE POLICY "Users can view analytics of their own projects"
  ON public.project_views
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX project_views_project_id_idx ON public.project_views(project_id);
CREATE INDEX project_views_viewed_at_idx ON public.project_views(viewed_at DESC);
CREATE INDEX project_views_project_viewed_idx ON public.project_views(project_id, viewed_at DESC);

-- Add comments
COMMENT ON TABLE public.project_views IS 'Project view tracking with timestamps';
COMMENT ON COLUMN public.project_views.project_id IS 'Reference to the project that was viewed';
COMMENT ON COLUMN public.project_views.viewed_at IS 'Timestamp when the project was viewed';
COMMENT ON COLUMN public.project_views.user_ip IS 'IP address of the viewer (optional)';
COMMENT ON COLUMN public.project_views.user_agent IS 'User agent string (optional)';
COMMENT ON COLUMN public.project_views.referrer IS 'Referrer URL (optional)';
