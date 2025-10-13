-- Create blog_posts table
create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.blog_posts enable row level security;

-- RLS Policy: Public can view published posts only
create policy "Public can view published posts"
  on public.blog_posts
  for select
  using (published = true or auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can manage all posts
create policy "Authenticated users can insert posts"
  on public.blog_posts
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update posts"
  on public.blog_posts
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete posts"
  on public.blog_posts
  for delete
  using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index blog_posts_slug_idx on public.blog_posts(slug);
create index blog_posts_created_at_idx on public.blog_posts(created_at desc);
create index blog_posts_published_idx on public.blog_posts(published) where published = true;

-- Function to auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.handle_updated_at();

-- Add comments
comment on table public.blog_posts is 'Blog posts and articles';
comment on column public.blog_posts.slug is 'URL-friendly unique identifier';
comment on column public.blog_posts.published is 'Whether the post is published and visible to public';


