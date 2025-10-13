# Laravel vs Supabase: Migration Comparison

Perbandingan lengkap antara Laravel Artisan migrations dengan Supabase CLI migrations.

## 🎯 Konsep yang Sama

Baik Laravel maupun Supabase menggunakan konsep **database migration** yang sama:
- Version control untuk database schema
- Sequential migration files
- Up/down migrations (create/rollback)
- Seed data untuk testing
- Track migration history

## 📊 Command Comparison

| Operasi | Laravel Artisan | Supabase CLI |
|---------|----------------|--------------|
| **Setup** | `composer install` | `supabase init` |
| **Create Migration** | `php artisan make:migration create_users_table` | `supabase migration new create_users_table` |
| **Run Migrations** | `php artisan migrate` | `supabase db push` |
| **Rollback** | `php artisan migrate:rollback` | Manual (edit + repair) |
| **Fresh Migrate** | `php artisan migrate:fresh` | `supabase db reset` |
| **Migration Status** | `php artisan migrate:status` | `supabase migration list` |
| **Seed Database** | `php artisan db:seed` | `supabase db seed` |
| **Pull Schema** | `php artisan schema:dump` | `supabase db pull` |
| **Create Seeder** | `php artisan make:seeder` | Edit `seed.sql` manually |

## 📝 Migration File Comparison

### Laravel Migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('image')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('github_url')->nullable();
            $table->json('tech_stack')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
```

### Supabase Migration (SQL)

```sql
-- Up Migration
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
  on public.projects for select using (true);

-- Down migration would be in a separate file or manual rollback
```

## 🔐 Security: Middleware vs RLS

### Laravel (Middleware)

```php
// routes/web.php
Route::middleware(['auth'])->group(function () {
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
});

// ProjectController.php
public function store(Request $request)
{
    $this->authorize('create', Project::class);
    
    return Project::create($request->validated());
}
```

### Supabase (Row Level Security)

```sql
-- RLS Policies langsung di database
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
```

## 🌱 Seeder Comparison

### Laravel Seeder

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'title' => 'E-Commerce Platform',
            'description' => 'A full-stack e-commerce platform...',
            'image' => 'https://example.com/image.jpg',
            'demo_url' => 'https://demo.example.com',
            'github_url' => 'https://github.com/username/project',
            'tech_stack' => ['React', 'Node.js', 'PostgreSQL'],
        ]);
    }
}
```

```bash
php artisan db:seed --class=ProjectSeeder
```

### Supabase Seeder

```sql
-- supabase/seed.sql
insert into public.projects (title, description, image, demo_url, github_url, tech_stack)
values (
  'E-Commerce Platform',
  'A full-stack e-commerce platform...',
  'https://example.com/image.jpg',
  'https://demo.example.com',
  'https://github.com/username/project',
  ARRAY['React', 'Node.js', 'PostgreSQL']
);
```

```bash
supabase db seed
```

## 🔄 Workflow Comparison

### Laravel Development Workflow

```bash
# 1. Create migration
php artisan make:migration create_projects_table

# 2. Edit migration file (PHP)
# database/migrations/2024_01_02_120000_create_projects_table.php

# 3. Run migration
php artisan migrate

# 4. If mistake, rollback
php artisan migrate:rollback

# 5. Create seeder
php artisan make:seeder ProjectSeeder

# 6. Run seeder
php artisan db:seed
```

### Supabase Development Workflow

```bash
# 1. Create migration
supabase migration new create_projects_table

# 2. Edit migration file (SQL)
# supabase/migrations/20240102120000_create_projects_table.sql

# 3. Run migration
supabase db push

# 4. If mistake, create new migration to fix
supabase migration new fix_projects_table

# 5. Edit seed file
# supabase/seed.sql

# 6. Run seed
supabase db seed
```

## 🎨 Advantages & Disadvantages

### Laravel Migrations

**✅ Advantages:**
- PHP syntax (familiar untuk Laravel devs)
- Built-in rollback functionality
- Schema builder yang powerful
- Factory dan Seeder terintegrasi
- Eloquent ORM integration

**❌ Disadvantages:**
- Perlu PHP runtime
- Backend required untuk semua operations
- More boilerplate code
- Slower untuk operations langsung ke database

### Supabase Migrations

**✅ Advantages:**
- Pure SQL (lebih powerful, direct database access)
- Tidak perlu backend untuk CRUD
- Row Level Security built-in
- Real-time subscriptions
- Auto-generated API endpoints
- Faster untuk read operations
- CLI yang powerful

**❌ Disadvantages:**
- Perlu belajar SQL
- Manual rollback (buat migration baru)
- Kurang abstraksi dibanding ORM
- RLS bisa kompleks untuk use cases advanced

## 🏗️ Architecture Comparison

### Laravel (Traditional MVC)

```
Client Request
    ↓
Router (routes/web.php)
    ↓
Middleware (auth, etc)
    ↓
Controller
    ↓
Model (Eloquent ORM)
    ↓
Database (MySQL/PostgreSQL)
    ↓
Response back to client
```

### Supabase (Direct Client-Database)

```
Client Request
    ↓
Supabase Client (JS)
    ↓
Supabase API Gateway
    ↓
Row Level Security (RLS)
    ↓
PostgreSQL Database
    ↓
Response back to client
```

## 💡 Use Cases

### Kapan Pakai Laravel?

- ✅ Complex business logic di backend
- ✅ Need full control atas authentication flow
- ✅ Team sudah familiar dengan PHP
- ✅ Need custom middleware/jobs/queues
- ✅ Monolithic application

### Kapan Pakai Supabase?

- ✅ JAMstack/Serverless architecture
- ✅ Rapid prototyping
- ✅ Real-time features required
- ✅ Frontend-heavy applications
- ✅ Want to focus on frontend
- ✅ Need auto-generated APIs
- ✅ Smaller teams

## 🔄 Migration Portability

### Laravel to Supabase

Jika Anda migrate dari Laravel ke Supabase:

1. **Convert Schema:**
```bash
# Export Laravel schema
php artisan schema:dump

# Convert ke Supabase migration
supabase migration new import_from_laravel
# Edit dan sesuaikan dengan Supabase format
```

2. **Convert Models to Supabase Client:**
```javascript
// Laravel Model
$projects = Project::where('published', true)->get();

// Supabase Client
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('published', true);
```

3. **Convert Auth:**
```php
// Laravel
Auth::user();

// Supabase
const { data: { user } } = await supabase.auth.getUser();
```

## 📚 Learning Resources

### Laravel
- [Laravel Migrations](https://laravel.com/docs/migrations)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Database Seeding](https://laravel.com/docs/seeding)

### Supabase
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/cli/managing-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Conclusion

**Laravel** dan **Supabase** sama-sama powerful, hanya berbeda approach:

- **Laravel** = Backend-centric, full control, traditional MVC
- **Supabase** = Frontend-centric, serverless, direct database access

Untuk portfolio website ini, **Supabase lebih cocok** karena:
- ✅ Simple CRUD operations
- ✅ No complex business logic
- ✅ Real-time updates nice to have
- ✅ Faster development
- ✅ Free tier yang generous
- ✅ Auto-generated REST API

Tapi jika Anda butuh complex backend logic, Laravel tetap pilihan yang sangat baik! 🚀


