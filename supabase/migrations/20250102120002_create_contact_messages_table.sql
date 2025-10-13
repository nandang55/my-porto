-- Create contact_messages table for contact form submissions
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.contact_messages enable row level security;

-- RLS Policy: Anyone can insert messages (for contact form)
create policy "Anyone can send messages"
  on public.contact_messages
  for insert
  with check (true);

-- RLS Policy: Only authenticated users can view messages
create policy "Authenticated users can view messages"
  on public.contact_messages
  for select
  using (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can update messages (mark as read)
create policy "Authenticated users can update messages"
  on public.contact_messages
  for update
  using (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can delete messages
create policy "Authenticated users can delete messages"
  on public.contact_messages
  for delete
  using (auth.role() = 'authenticated');

-- Create indexes for better query performance
create index contact_messages_created_at_idx on public.contact_messages(created_at desc);
create index contact_messages_read_idx on public.contact_messages(read) where read = false;

-- Add comments
comment on table public.contact_messages is 'Contact form submissions from website visitors';
comment on column public.contact_messages.read is 'Whether the message has been read by admin';


