-- Add media support to projects table
-- This migration adds support for multiple images and videos

-- Add new columns for media support
alter table public.projects 
  add column if not exists media jsonb default '[]'::jsonb,
  add column if not exists featured_media text;

-- Update existing records to move image to media array
update public.projects
set media = jsonb_build_array(
  jsonb_build_object(
    'type', 'image',
    'url', image,
    'thumbnail', image,
    'featured', true
  )
)
where image is not null and image != '';

-- Update featured_media from old image column
update public.projects
set featured_media = image
where image is not null and image != '';

-- Add comment for documentation
comment on column public.projects.media is 'Array of media objects (images/videos) with type, url, thumbnail, and featured flag';
comment on column public.projects.featured_media is 'URL of the featured/primary media for the project';

-- Create index for faster queries on media
create index if not exists projects_media_idx on public.projects using gin(media);

-- Note: We keep the old 'image' column for backward compatibility
-- It can be removed in a future migration if needed

