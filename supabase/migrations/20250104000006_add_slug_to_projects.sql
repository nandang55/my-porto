-- Add slug column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for slug
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);

-- Add comment
COMMENT ON COLUMN public.projects.slug IS 'URL-friendly identifier for project detail pages';

-- Update existing projects to have slugs based on title
UPDATE public.projects 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug unique
ALTER TABLE public.projects ADD CONSTRAINT projects_slug_unique UNIQUE (slug);
