# 🚀 Step-by-Step Migration Guide

Panduan praktis untuk menjalankan database migrations - sangat mudah diikuti!

---

## 📋 Prerequisites

- ✅ Akun Supabase (gratis di https://supabase.com)
- ✅ Node.js sudah terinstall
- ✅ Terminal/Command Prompt

---

## Step 1: Buat Project di Supabase (Jika Belum Punya)

### 1.1 Sign Up / Login ke Supabase

1. Buka https://supabase.com
2. Klik **"Start your project"** atau **"Sign In"**
3. Login dengan GitHub/Email

### 1.2 Create New Project

1. Klik **"New Project"**
2. Isi form:
   - **Name**: bagdja-porto (atau nama apapun)
   - **Database Password**: Simpan password ini! ⚠️
   - **Region**: Pilih yang terdekat (Singapore/Japan untuk Indonesia)
   - **Pricing Plan**: Free
3. Klik **"Create new project"**
4. **Tunggu 1-2 menit** sampai project ready (ada loading indicator)

### 1.3 Get API Credentials

Setelah project ready:

1. Klik **Settings** (icon gear di sidebar)
2. Klik **API**
3. Copy 2 values ini:
   - **Project URL** (contoh: https://xxxxx.supabase.co)
   - **anon public key** (key yang panjang)

### 1.4 Setup Environment Variables

1. Buka project bagdja-porto di VS Code/editor
2. Buat file `.env` di root folder (sejajar dengan package.json)
3. Isi dengan:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=paste_anon_key_disini
```

**⚠️ Ganti dengan credentials Anda!**

---

## Step 2: Install Supabase CLI

Pilih salah satu method:

### macOS (Homebrew) - RECOMMENDED

```bash
brew install supabase/tap/supabase
```

### Windows (Scoop)

```bash
# Install Scoop dulu jika belum punya
# https://scoop.sh

scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Linux / macOS / Windows (NPM) - UNIVERSAL

```bash
npm install -g supabase
```

### Verify Installation

```bash
supabase --version
```

Jika muncul version number, berarti sukses! ✅

---

## Step 3: Login ke Supabase CLI

### 3.1 Run Login Command

```bash
supabase login
```

### 3.2 Authorize di Browser

- Terminal akan membuka browser
- Klik **"Authorize"** untuk connect CLI dengan akun Anda
- Kembali ke terminal, akan muncul: **"Finished supabase login"**

✅ CLI sekarang connected dengan akun Supabase Anda!

---

## Step 4: Link Project dengan CLI

### 4.1 Get Project Reference ID

Ada 2 cara:

**Cara 1: Dari URL Dashboard**
- URL dashboard: `https://supabase.com/dashboard/project/xxxxx`
- `xxxxx` adalah project ref (copy ini!)

**Cara 2: Dari Settings**
1. Buka project di Supabase dashboard
2. Settings → General
3. Copy **Reference ID**

### 4.2 Link Project

Di terminal, di folder `bagdja-porto`:

```bash
cd /Users/nandanghermawan/Project/bagdja-porto

supabase link --project-ref xxxxx
```

**⚠️ Ganti `xxxxx` dengan project ref Anda!**

### 4.3 Enter Database Password

Terminal akan minta database password:
- Masukkan password yang Anda simpan saat create project
- Password akan disimpan securely di config

✅ Project sekarang linked!

---

## Step 5: Run Migrations! 🎉

### 5.1 Check Migration Files

Pastikan file migration ada:

```bash
ls -la supabase/migrations/
```

Harus ada 3 files:
- ✅ `20250102120000_create_projects_table.sql`
- ✅ `20250102120001_create_blog_posts_table.sql`
- ✅ `20250102120002_create_contact_messages_table.sql`

### 5.2 Push Migrations to Database

```bash
npm run db:push
```

**Atau manual:**

```bash
supabase db push
```

### 5.3 Tunggu Proses

Output akan seperti ini:

```
Applying migration 20250102120000_create_projects_table.sql...
Applying migration 20250102120001_create_blog_posts_table.sql...
Applying migration 20250102120002_create_contact_messages_table.sql...

Finished supabase db push.
```

✅ **MIGRATIONS BERHASIL!**

---

## Step 6: Seed Sample Data (Optional)

Untuk insert sample data (5 projects, 5 blog posts, 3 messages):

```bash
npm run db:seed
```

**Atau manual:**

```bash
supabase db seed
```

✅ Database sekarang punya sample data untuk testing!

---

## Step 7: Verify di Supabase Dashboard

### 7.1 Open Table Editor

1. Buka Supabase dashboard
2. Klik **"Table Editor"** di sidebar
3. Anda akan lihat 3 tables baru:
   - ✅ `projects`
   - ✅ `blog_posts`
   - ✅ `contact_messages`

### 7.2 Check Data

Klik tiap table untuk lihat data:
- **projects**: 5 sample projects (jika sudah run seed)
- **blog_posts**: 5 sample posts
- **contact_messages**: 3 sample messages

### 7.3 Check Policies (RLS)

1. Klik table → **"Policies"** tab
2. Anda akan lihat RLS policies yang sudah dibuat:
   - Public can view
   - Authenticated users can manage

✅ Everything is set up correctly!

---

## Step 8: Create Admin User

Untuk bisa login ke admin panel (`/admin/login`):

### 8.1 Go to Authentication

1. Supabase dashboard → **"Authentication"** di sidebar
2. Klik **"Users"**

### 8.2 Add New User

1. Klik **"Add user"** → **"Create new user"**
2. Isi:
   - **Email**: email Anda
   - **Password**: password untuk login
   - **Auto Confirm User**: ✅ (checklist ini!)
3. Klik **"Create user"**

### 8.3 Save Credentials

Simpan email & password ini untuk login ke admin panel!

---

## Step 9: Test Website! 🎉

### 9.1 Start Development Server (Jika Belum Running)

```bash
npm run dev
```

### 9.2 Open Browser

Buka: http://localhost:5173

### 9.3 Test Pages

✅ **Home** - Lihat landing page  
✅ **Portfolio** - Lihat sample projects  
✅ **Blog** - Lihat sample blog posts  
✅ **About** - Lihat about page  
✅ **Contact** - Test submit form  

### 9.4 Test Admin Panel

1. Buka: http://localhost:5173/admin/login
2. Login dengan email & password yang dibuat tadi
3. Test CRUD operations:
   - Create new project
   - Edit blog post
   - View messages

---

## 🎉 Congratulations!

Database Anda sudah setup dengan:
- ✅ 3 tables dengan proper schema
- ✅ Row Level Security policies
- ✅ Indexes untuk performance
- ✅ Sample data untuk testing
- ✅ Admin user untuk login

---

## 📋 Useful Commands

Sekarang Anda bisa pakai commands ini:

```bash
# Migration commands
npm run db:push       # Apply migrations
npm run db:pull       # Pull schema dari remote
npm run db:reset      # Reset database
npm run db:seed       # Seed sample data
npm run db:status     # Check migration status

# Development
npm run dev           # Start dev server
npm run build         # Build untuk production
```

---

## 🐛 Troubleshooting

### Error: "Could not find project ref"

**Solution:**
```bash
supabase link --project-ref your-project-ref
```

### Error: "Failed to connect to database"

**Solution:**
- Check database password benar
- Check internet connection
- Try relink project

### Error: "Migration already applied"

**Solution:**
```bash
# Check status
npm run db:status

# Jika sudah applied, skip atau reset
npm run db:reset  # HATI-HATI: Hapus semua data!
```

### Website tidak connect ke Supabase

**Solution:**
- Check `.env` file ada dan benar
- Restart dev server: `npm run dev`
- Check browser console untuk error

---

## 🆘 Need Help?

- 📚 Read: `MIGRATION_GUIDE.md` untuk detail lebih lengkap
- 📚 Read: `SUPABASE_SETUP.md` untuk manual setup
- 🌐 Supabase Docs: https://supabase.com/docs
- 💬 Supabase Discord: https://discord.supabase.com

---

## 🎯 Next Steps

1. ✅ Ganti sample data dengan data real Anda
2. ✅ Upload foto profil & project images
3. ✅ Tulis blog posts asli
4. ✅ Customize design sesuai selera
5. ✅ Deploy ke Vercel/Netlify

**Happy coding!** 🚀

