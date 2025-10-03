-- Add theme color columns to portfolios table
alter table public.portfolios add column if not exists secondary_color text default '#6366f1';
alter table public.portfolios add column if not exists accent_color text default '#f59e0b';
alter table public.portfolios add column if not exists text_primary text default '#1f2937';
alter table public.portfolios add column if not exists text_secondary text default '#6b7280';
alter table public.portfolios add column if not exists bg_light text default '#ffffff';
alter table public.portfolios add column if not exists bg_dark text default '#111827';
alter table public.portfolios add column if not exists cover_image text;
alter table public.portfolios add column if not exists favicon_url text;

-- Add comment
comment on column public.portfolios.theme_color is 'Primary brand color';
comment on column public.portfolios.secondary_color is 'Secondary brand color';
comment on column public.portfolios.accent_color is 'Accent/highlight color';
comment on column public.portfolios.text_primary is 'Primary text color (dark mode)';
comment on column public.portfolios.text_secondary is 'Secondary text color (muted)';
comment on column public.portfolios.bg_light is 'Light background color';
comment on column public.portfolios.bg_dark is 'Dark background color';
comment on column public.portfolios.cover_image is 'Cover/banner image for hero section';
comment on column public.portfolios.favicon_url is 'Custom favicon for browser tab';

