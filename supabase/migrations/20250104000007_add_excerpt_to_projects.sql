-- Add excerpt column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add comment
COMMENT ON COLUMN public.projects.excerpt IS 'Short description/excerpt for project cards and listings';

-- Update existing projects to have excerpt from description (first 200 chars)
UPDATE public.projects 
SET excerpt = CASE 
  WHEN description IS NOT NULL THEN 
    CASE 
      WHEN LENGTH(REGEXP_REPLACE(description, '<[^>]*>', '', 'g')) > 200 
      THEN LEFT(REGEXP_REPLACE(description, '<[^>]*>', '', 'g'), 200) || '...'
      ELSE REGEXP_REPLACE(description, '<[^>]*>', '', 'g')
    END
  ELSE NULL
END
WHERE excerpt IS NULL;
