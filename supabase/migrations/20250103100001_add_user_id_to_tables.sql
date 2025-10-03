-- Add user_id to existing tables for multi-tenant support
-- Links data to specific users/portfolios

-- Add user_id to projects table
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to blog_posts table
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to contact_messages table (optional - for tracking which portfolio received message)
ALTER TABLE public.contact_messages 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS blog_posts_user_id_idx ON public.blog_posts(user_id);
CREATE INDEX IF NOT EXISTS contact_messages_user_id_idx ON public.contact_messages(user_id);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS projects_user_published_order_idx 
  ON public.projects(user_id, published, "order" ASC);
CREATE INDEX IF NOT EXISTS blog_posts_user_created_idx 
  ON public.blog_posts(user_id, created_at DESC);

-- Add comments
COMMENT ON COLUMN public.projects.user_id IS 'Owner of this project (references auth.users)';
COMMENT ON COLUMN public.blog_posts.user_id IS 'Author of this blog post (references auth.users)';
COMMENT ON COLUMN public.contact_messages.user_id IS 'Portfolio owner who received this message (references auth.users)';

-- Note: Existing data will have NULL user_id
-- They can be assigned to users manually or via admin interface
-- Or set a default user for migration

