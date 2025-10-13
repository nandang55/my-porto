# Supabase Migration Guide

Panduan lengkap menggunakan Supabase CLI untuk database migrations (mirip Laravel Artisan).

## 🚀 Setup Supabase CLI

### 1. Install Supabase CLI

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows (dengan Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Via NPM (semua platform):**
```bash
npm install -g supabase
```

### 2. Login ke Supabase

```bash
supabase login
```

Ini akan membuka browser untuk authentication.

### 3. Initialize Project

```bash
cd bagdja-porto
supabase init
```

Ini akan membuat folder `supabase/` dengan struktur:
```
supabase/
├── config.toml           # Configuration
├── seed.sql              # Seed data
└── migrations/           # Migration files (auto-generated)
```

### 4. Link ke Project Supabase

```bash
supabase link --project-ref your-project-ref
```

Project ref bisa dilihat di Supabase Dashboard URL atau Settings > General.

---

## 📝 Membuat Migrations

### Perintah Dasar (Mirip Laravel Artisan)

| Laravel | Supabase CLI |
|---------|--------------|
| `php artisan make:migration` | `supabase migration new` |
| `php artisan migrate` | `supabase db push` |
| `php artisan migrate:rollback` | `supabase migration repair` |
| `php artisan db:seed` | `supabase db seed` |

### Contoh: Membuat Migration

```bash
# Buat migration baru
supabase migration new create_projects_table

# File akan dibuat di: supabase/migrations/YYYYMMDDHHMMSS_create_projects_table.sql
```

### Contoh: Isi Migration File

**supabase/migrations/20250102_create_projects_table.sql**
```sql
-- Create projects table
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

-- RLS Policies
create policy "Public can view projects"
  on public.projects
  for select
  using (true);

create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update projects"
  on public.projects
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  using (auth.role() = 'authenticated');

-- Indexes
create index if not exists projects_created_at_idx on public.projects(created_at desc);

-- Comments
comment on table public.projects is 'Portfolio projects';
```

### Apply Migration

```bash
# Push migration ke database
supabase db push

# Atau jika ingin apply ke remote database
supabase db push --linked
```

---

## 📚 Complete Migration Setup untuk Portfolio

Saya buatkan migration files untuk semua tables di portfolio Anda:

### Migration 1: Create Projects Table

```bash
supabase migration new create_projects_table
```

File: `supabase/migrations/20250102120000_create_projects_table.sql`
```sql
-- Create projects table
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

-- Enable RLS
alter table public.projects enable row level security;

-- RLS Policies
create policy "Public can view projects" on public.projects
  for select using (true);

create policy "Authenticated users can manage projects" on public.projects
  for all using (auth.role() = 'authenticated');

-- Indexes
create index projects_created_at_idx on public.projects(created_at desc);
```

### Migration 2: Create Blog Posts Table

```bash
supabase migration new create_blog_posts_table
```

File: `supabase/migrations/20250102120001_create_blog_posts_table.sql`
```sql
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

-- Enable RLS
alter table public.blog_posts enable row level security;

-- RLS Policies
create policy "Public can view published posts" on public.blog_posts
  for select using (published = true or auth.role() = 'authenticated');

create policy "Authenticated users can manage posts" on public.blog_posts
  for all using (auth.role() = 'authenticated');

-- Indexes
create index blog_posts_slug_idx on public.blog_posts(slug);
create index blog_posts_created_at_idx on public.blog_posts(created_at desc);
create index blog_posts_published_idx on public.blog_posts(published) where published = true;

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.handle_updated_at();
```

### Migration 3: Create Contact Messages Table

```bash
supabase migration new create_contact_messages_table
```

File: `supabase/migrations/20250102120002_create_contact_messages_table.sql`
```sql
-- Create contact_messages table
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- RLS Policies
create policy "Anyone can insert messages" on public.contact_messages
  for insert with check (true);

create policy "Authenticated users can view messages" on public.contact_messages
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update messages" on public.contact_messages
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete messages" on public.contact_messages
  for delete using (auth.role() = 'authenticated');

-- Indexes
create index contact_messages_created_at_idx on public.contact_messages(created_at desc);
create index contact_messages_read_idx on public.contact_messages(read) where read = false;
```

### Migration 4: Create Seed Data

File: `supabase/seed.sql`
```sql
-- Seed data untuk development

-- Sample Projects
insert into public.projects (title, description, image, demo_url, github_url, tech_stack) values
  (
    'E-Commerce Platform',
    'Full-stack e-commerce platform with payment integration, shopping cart, and admin dashboard.',
    'https://via.placeholder.com/600x400',
    'https://demo.example.com',
    'https://github.com/yourusername/ecommerce',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe']
  ),
  (
    'Task Management App',
    'Collaborative task management with real-time updates and team features.',
    'https://via.placeholder.com/600x400',
    'https://demo.example.com',
    'https://github.com/yourusername/taskapp',
    ARRAY['React', 'Supabase', 'TailwindCSS']
  ),
  (
    'Analytics Dashboard',
    'Real-time analytics dashboard with charts and data visualization.',
    'https://via.placeholder.com/600x400',
    'https://demo.example.com',
    'https://github.com/yourusername/dashboard',
    ARRAY['Next.js', 'Chart.js', 'PostgreSQL']
  );

-- Sample Blog Posts
insert into public.blog_posts (title, slug, excerpt, content, published) values
  (
    'Getting Started with React and Supabase',
    'getting-started-react-supabase',
    'Learn how to build a full-stack application using React and Supabase with authentication and real-time features.',
    'Full blog post content here... Lorem ipsum dolor sit amet...',
    true
  ),
  (
    'Building Modern UIs with TailwindCSS',
    'building-modern-uis-tailwind',
    'Discover how to create beautiful and responsive user interfaces using TailwindCSS utility classes.',
    'Full blog post content here... Lorem ipsum dolor sit amet...',
    true
  );
```

---

## 🔧 Workflow Development dengan Migrations

### 1. Local Development

```bash
# Start local Supabase (optional, untuk development offline)
supabase start

# Membuat perubahan database
supabase migration new add_column_to_projects

# Edit migration file yang dibuat
# Lalu apply
supabase db push
```

### 2. Pull Schema dari Remote

Jika ada perubahan di remote database (lewat dashboard):

```bash
# Pull schema dari remote ke local
supabase db pull

# Ini akan generate migration file otomatis
```

### 3. Reset Database (Fresh Migration)

```bash
# Reset database dan run semua migrations dari awal
supabase db reset

# Dengan seed
supabase db reset --with-seed
```

### 4. View Migration Status

```bash
# Lihat status migrations
supabase migration list

# Repair migrations jika ada yang corrupt
supabase migration repair --status applied
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example

`.github/workflows/deploy.yml`
```yaml
name: Deploy to Supabase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Run migrations
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## 📋 Best Practices

### ✅ DO:
- **Version control** semua migration files di Git
- **Atomic migrations** - satu migration untuk satu perubahan logical
- **Descriptive names** - nama migration yang jelas
- **Test migrations** di local sebelum push ke production
- **Rollback plan** - buat migration untuk rollback jika perlu
- **Seed data** untuk development testing

### ❌ DON'T:
- Jangan edit migration yang sudah applied
- Jangan delete migration files yang sudah committed
- Jangan skip migration sequence
- Jangan manual edit database di production (gunakan migration)

---

## 🆚 Perbandingan: Laravel vs Supabase

| Feature | Laravel Artisan | Supabase CLI |
|---------|----------------|--------------|
| Create Migration | `php artisan make:migration` | `supabase migration new` |
| Run Migrations | `php artisan migrate` | `supabase db push` |
| Rollback | `php artisan migrate:rollback` | Manual edit + repair |
| Fresh Migrate | `php artisan migrate:fresh` | `supabase db reset` |
| Seed | `php artisan db:seed` | `supabase db seed` |
| Status | `php artisan migrate:status` | `supabase migration list` |
| Schema Dump | Built-in | `supabase db pull` |

---

## 📝 Quick Reference Commands

```bash
# Setup
supabase init                          # Initialize project
supabase login                         # Login to Supabase
supabase link --project-ref <ref>      # Link to remote project

# Migrations
supabase migration new <name>          # Create new migration
supabase db push                       # Apply migrations
supabase db pull                       # Pull remote schema
supabase db reset                      # Reset database
supabase migration list                # List migrations
supabase migration repair              # Fix migration issues

# Local Development
supabase start                         # Start local Supabase
supabase stop                          # Stop local Supabase
supabase status                        # Check status

# Seed
supabase db seed                       # Run seed file
```

---

## 🔗 Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/cli/managing-migrations)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)

---

**Pro Tip**: Combine migrations dengan TypeScript types generation untuk type-safe database queries!

```bash
# Generate TypeScript types dari database schema
supabase gen types typescript --linked > src/types/supabase.ts
```


