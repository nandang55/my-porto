-- Create landing_pages table for website builder
create table if not exists public.landing_pages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  content jsonb not null default '[]'::jsonb,
  is_active boolean default false not null,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better performance
create index landing_pages_user_id_idx on public.landing_pages(user_id);
create index landing_pages_slug_idx on public.landing_pages(slug);
create index landing_pages_is_active_idx on public.landing_pages(is_active);

-- Enable RLS
alter table public.landing_pages enable row level security;

-- RLS Policies
-- Users can view their own landing pages
create policy "Users can view their own landing pages"
  on public.landing_pages
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own landing pages
create policy "Users can insert their own landing pages"
  on public.landing_pages
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own landing pages
create policy "Users can update their own landing pages"
  on public.landing_pages
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own landing pages
create policy "Users can delete their own landing pages"
  on public.landing_pages
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Public can view active landing pages by slug
create policy "Public can view active landing pages"
  on public.landing_pages
  for select
  using (is_active = true);

-- Add comment
comment on table public.landing_pages is 'Landing pages created with the website builder';
comment on column public.landing_pages.content is 'JSON array of page components and their configurations';
comment on column public.landing_pages.slug is 'URL slug for the landing page';
