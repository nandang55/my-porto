# Supabase Migrations

Folder ini berisi database migrations untuk project portfolio.

## 📁 Struktur

```
supabase/
├── config.toml                                    # Supabase CLI config
├── seed.sql                                       # Sample data untuk testing
├── migrations/
│   ├── 20250102120000_create_projects_table.sql      # Projects table
│   ├── 20250102120001_create_blog_posts_table.sql    # Blog posts table
│   └── 20250102120002_create_contact_messages_table.sql  # Contact messages table
└── README.md
```

## 🚀 Quick Start

### 1. Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# atau via NPM
npm install -g supabase
```

### 2. Login

```bash
supabase login
```

### 3. Link ke Project

```bash
supabase link --project-ref your-project-ref
```

Dapatkan project ref dari dashboard Supabase Anda di Settings > General.

### 4. Push Migrations

```bash
# Apply semua migrations ke database
supabase db push
```

### 5. Seed Database (Optional)

```bash
# Insert sample data
supabase db seed
```

## 📝 Membuat Migration Baru

```bash
# Template
supabase migration new <migration_name>

# Contoh
supabase migration new add_views_count_to_blog_posts

# Akan membuat file:
# supabase/migrations/20250102123045_add_views_count_to_blog_posts.sql
```

Edit file yang dibuat, lalu:

```bash
supabase db push
```

## 🔄 Common Commands

```bash
# List migrations
supabase migration list

# Pull schema dari remote database
supabase db pull

# Reset database (HATI-HATI: akan hapus semua data!)
supabase db reset

# Reset dengan seed
supabase db reset --with-seed

# Check status
supabase status
```

## 🏠 Local Development

Supabase CLI bisa run local database untuk development:

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Lihat credentials
supabase status
```

Ini akan start:
- PostgreSQL database (port 54322)
- Supabase Studio (port 54323)
- Auth server (port 54321)
- Storage server
- Realtime server

## 📚 Migration Files

### 1. Projects Table (`20250102120000_create_projects_table.sql`)
- Menyimpan data portfolio projects
- Public read access
- Authenticated write access

### 2. Blog Posts Table (`20250102120001_create_blog_posts_table.sql`)
- Menyimpan artikel blog
- Published/draft status
- Auto-update `updated_at` timestamp
- Unique slug untuk URL

### 3. Contact Messages Table (`20250102120002_create_contact_messages_table.sql`)
- Menyimpan pesan dari contact form
- Anyone can insert
- Only admin can read/delete
- Read/unread status

## 🔐 Row Level Security (RLS)

Semua tables menggunakan RLS policies:

- **Public**: Bisa view data yang published
- **Anonymous**: Bisa submit contact form
- **Authenticated**: Full access untuk CRUD operations

## 🌱 Seed Data

File `seed.sql` berisi sample data:
- 5 sample projects
- 5 sample blog posts
- 3 sample contact messages

Gunakan untuk testing dan development.

## ⚠️ Best Practices

✅ **DO:**
- Commit semua migration files ke Git
- Test migrations di local sebelum push
- Buat migrations yang atomic (satu logical change)
- Gunakan descriptive migration names

❌ **DON'T:**
- Jangan edit migrations yang sudah applied
- Jangan skip migration sequence
- Jangan manual edit production database

## 🔗 Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/managing-migrations)
- [SQL Tutorial](https://supabase.com/docs/guides/database/overview)


