-- Add order and published columns to projects table
-- This allows sorting projects and hiding draft projects

-- Add order column for custom sorting (lower number = higher priority)
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Add published column for draft/published status
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS projects_order_idx ON public.projects("order" ASC);
CREATE INDEX IF NOT EXISTS projects_published_idx ON public.projects(published);

-- Create composite index for published + order queries
CREATE INDEX IF NOT EXISTS projects_published_order_idx ON public.projects(published, "order" ASC);

-- Update existing projects to have order based on created_at (oldest = 0, newest = higher)
WITH ordered_projects AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS new_order
  FROM public.projects
)
UPDATE public.projects p
SET "order" = op.new_order
FROM ordered_projects op
WHERE p.id = op.id;

-- Add comments for documentation
COMMENT ON COLUMN public.projects."order" IS 'Sort order for displaying projects (lower number = higher priority/shows first)';
COMMENT ON COLUMN public.projects.published IS 'Whether the project is published (visible to public) or draft (hidden)';

-- Note: All existing projects are set to published=true by default
-- New projects will also default to published=true unless specified otherwise
