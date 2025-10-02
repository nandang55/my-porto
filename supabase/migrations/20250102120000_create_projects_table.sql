-- Create projects table for portfolio showcase
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image text,
  demo_url text,
  github_url text,
  tech_stack text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- RLS Policy: Public can view all projects
create policy "Public can view projects"
  on public.projects
  for select
  using (true);

-- RLS Policy: Authenticated users can insert projects
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  with check (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can update projects
create policy "Authenticated users can update projects"
  on public.projects
  for update
  using (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can delete projects
create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  using (auth.role() = 'authenticated');

-- Create index for faster queries
create index projects_created_at_idx on public.projects(created_at desc);

-- Add comments for documentation
comment on table public.projects is 'Portfolio projects showcase';
comment on column public.projects.tech_stack is 'Array of technologies used in the project';

