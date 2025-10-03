# My Portfolio Website - Multi-Tenant SaaS Platform

A modern, responsive **Multi-Tenant Portfolio Platform** built with React.js and Supabase. Each user gets their own portfolio with custom URL (/{slug}), featuring blog, projects showcase, contact form, and full admin CMS.

## Features

- 🎨 Modern, responsive design with TailwindCSS
- 🌓 Dark mode support
- 📱 Mobile-friendly interface
- 📝 Blog with CMS
- 💼 Portfolio showcase
- 📧 Contact form with Supabase integration
- 🔐 Admin panel with authentication
- ⚡ Fast and optimized with Vite
- 🖼️ **NEW!** Multiple image & video upload with drag-and-drop
- 📤 **NEW!** Supabase Storage integration for media files
- 🎬 **NEW!** Auto video thumbnail generation
- 🖼️ **NEW!** Lightbox gallery for media viewing
- 🔔 **NEW!** Beautiful global notification system (no more browser alerts!)
- 🏷️ **NEW!** Tech stack tags with autocomplete & color coding (50+ popular tech!)
- 📝 **NEW!** Professional WYSIWYG editor with CKEditor 5 (formatting, tables, links, etc!)
- 📊 **NEW!** Order & Publish control (sort projects, save as draft/published!)
- 🔍 **NEW!** Global search with real-time filtering (search by name, tech, description!)
- 🏢 **NEW!** Multi-Tenant Architecture - Each user gets own portfolio with /{slug} URL!
- 👥 **NEW!** Complete data isolation - Users only see their own data
- ⚙️ **NEW!** Portfolio Settings - Customize slug, bio, social links, theme color
- 🔒 **NEW!** Row Level Security - Database-level data protection per user

## Tech Stack

- **Frontend**: React.js + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (Auth, Database, API)
- **Routing**: React Router
- **Forms**: React Hook Form
- **Icons**: React Icons
- **Deployment**: Vercel / Netlify ready

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

### Installation

1. Clone the repository:
```bash
cd bagdja-porto
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### Supabase Database Setup

You have two options to setup the database:

#### Option 1: Using Migrations (Recommended) ⭐

This project includes ready-to-use migration files similar to Laravel Artisan!

```bash
# Install Supabase CLI
brew install supabase/tap/supabase
# or: npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

See `MIGRATION_GUIDE.md` for detailed instructions and `LARAVEL_VS_SUPABASE.md` for comparison with Laravel.

#### Option 2: Manual SQL Setup

Create the following tables in your Supabase database via SQL Editor:

#### 1. Projects Table
```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image text,
  demo_url text,
  github_url text,
  tech_stack text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Policy for public read access
create policy "Public can view projects"
  on projects for select
  using (true);

-- Policy for authenticated users to manage projects
create policy "Authenticated users can manage projects"
  on projects for all
  using (auth.role() = 'authenticated');
```

#### 2. Blog Posts Table
```sql
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table blog_posts enable row level security;

-- Policy for public read access
create policy "Public can view blog posts"
  on blog_posts for select
  using (true);

-- Policy for authenticated users to manage posts
create policy "Authenticated users can manage blog posts"
  on blog_posts for all
  using (auth.role() = 'authenticated');
```

#### 3. Contact Messages Table
```sql
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table contact_messages enable row level security;

-- Policy for anyone to insert messages
create policy "Anyone can send messages"
  on contact_messages for insert
  with check (true);

-- Policy for authenticated users to view messages
create policy "Authenticated users can view messages"
  on contact_messages for select
  using (auth.role() = 'authenticated');

-- Policy for authenticated users to delete messages
create policy "Authenticated users can delete messages"
  on contact_messages for delete
  using (auth.role() = 'authenticated');
```

### Create Admin User

In Supabase, go to Authentication > Users and create a new user with your email and password. This will be your admin login.

### Setup Supabase Storage (For Media Upload)

To enable image and video uploads:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **"New Bucket"**
4. Create bucket:
   - Name: `project-media`
   - Public: ✅ **Yes**
5. Setup storage policies (RLS)

For detailed instructions, see **`SUPABASE_STORAGE_SETUP.md`**

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard under Project Settings > Environment Variables

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Add environment variables in Netlify dashboard under Site Settings > Build & Deploy > Environment

## Project Structure

```
bagdja-porto/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── DarkModeToggle.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   │   ├── AdminBlog.jsx
│   │   │   ├── AdminMessages.jsx
│   │   │   ├── AdminPortfolio.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   └── Portfolio.jsx
│   ├── services/        # API and external services
│   │   └── supabase.js
│   ├── App.jsx          # Main app component with routing
│   ├── index.css        # Global styles
│   └── main.jsx         # App entry point
├── .env.example         # Environment variables template
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Customization

### Update Personal Information

1. **Home Page**: Edit `src/pages/Home.jsx` to update your name, title, and description
2. **About Page**: Edit `src/pages/About.jsx` to update your experience, skills, and education
3. **Footer**: Edit `src/components/Footer.jsx` to update social links and copyright info
4. **Contact Page**: Edit `src/pages/Contact.jsx` to update contact information

### Styling

- The theme colors can be customized in `tailwind.config.js`
- Global styles are in `src/index.css`
- Component-specific styles use Tailwind utility classes

## Admin Panel

Access the admin panel at `/admin/login` and use your Supabase user credentials to log in.

Features:
- Manage portfolio projects (CRUD operations)
- Manage blog posts (CRUD operations)
- View contact form submissions

## 📚 Documentation

This project includes comprehensive documentation:

- **README.md** (this file) - Complete setup and usage guide
- **QUICK_START.md** - Quick start guide for beginners
- **SUPABASE_SETUP.md** - Manual database setup guide
- **SUPABASE_STORAGE_SETUP.md** - 🆕 Supabase Storage setup for media uploads
- **MEDIA_UPLOAD_FEATURE.md** - 🆕 Complete guide to new media upload feature
- **ALERT_SYSTEM.md** - 🆕 Global notification/alert system guide
- **TECH_STACK_FEATURE.md** - 🆕 Tech stack tags with autocomplete guide
- **WYSIWYG_EDITOR.md** - 🆕 Rich text editor with CKEditor 5 guide
- **ORDER_AND_PUBLISH_FEATURE.md** - 🆕 Order & Publish control guide
- **SEARCH_FEATURE.md** - 🆕 Global search with real-time filtering guide
- **MULTI_TENANT_GUIDE.md** - 🆕 🏢 Multi-Tenant SaaS Architecture guide ⭐⭐
- **MIGRATION_GUIDE.md** - Database migrations guide (Laravel-style) ⭐
- **LARAVEL_VS_SUPABASE.md** - Comparison between Laravel and Supabase migrations

## 🗄️ Database Management

This project supports **database migrations** similar to Laravel Artisan!

### Available NPM Scripts

```bash
npm run db:push       # Apply migrations to database
npm run db:pull       # Pull schema from remote database
npm run db:reset      # Reset database (fresh migration)
npm run db:seed       # Seed database with sample data
npm run db:status     # Check migration status
```

See `MIGRATION_GUIDE.md` for complete migration system documentation.

## License

MIT License - feel free to use this template for your own portfolio!

## Support

For issues or questions, please open an issue on GitHub or contact me directly.

---

Built with ❤️ using React.js and Supabase
