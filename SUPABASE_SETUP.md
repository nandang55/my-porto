# Supabase Setup Guide

This guide will help you set up Supabase for your portfolio website.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the project to be provisioned (takes 1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under Project API)
   - **anon public** key (under Project API keys)
3. Create a `.env` file in your project root and add:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Create Database Tables

Go to the **SQL Editor** in your Supabase dashboard and run the following SQL scripts:

### Create Projects Table

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

### Create Blog Posts Table

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

### Create Contact Messages Table

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

## Step 4: Create Admin User

1. In your Supabase dashboard, go to **Authentication** > **Users**
2. Click **Add User** > **Create new user**
3. Enter your email and password
4. Click **Create user**
5. Use these credentials to log in to your admin panel at `/admin/login`

## Step 5: (Optional) Add Sample Data

You can add sample data through the admin panel after logging in, or directly through the Supabase table editor:

### Sample Project Data

```sql
insert into projects (title, description, image, demo_url, github_url, tech_stack)
values (
  'E-Commerce Platform',
  'A full-stack e-commerce platform with payment integration',
  'https://via.placeholder.com/600x400',
  'https://demo.example.com',
  'https://github.com/yourusername/project',
  ARRAY['React', 'Node.js', 'PostgreSQL']
);
```

### Sample Blog Post Data

```sql
insert into blog_posts (title, slug, excerpt, content)
values (
  'Getting Started with React',
  'getting-started-react',
  'Learn the basics of React.js and build your first component',
  'Full blog post content here...'
);
```

## Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Visit `http://localhost:5173`
3. Check if the portfolio and blog pages load correctly
4. Test the contact form
5. Log in to the admin panel at `/admin/login`
6. Try creating a new project or blog post

## Troubleshooting

### "Failed to fetch" errors

- Make sure your `.env` file is in the project root
- Verify your API credentials are correct
- Check that your tables are created in Supabase

### Authentication not working

- Ensure you created a user in Supabase Authentication
- Check that Row Level Security policies are enabled
- Verify your email/password are correct

### CRUD operations fail

- Check Row Level Security policies are set up correctly
- Make sure you're logged in as an authenticated user
- Check browser console for specific error messages

## Production Deployment

When deploying to Vercel or Netlify:

1. Add environment variables in your hosting platform's dashboard:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Make sure to redeploy after adding environment variables

## Security Notes

- Never commit your `.env` file to version control
- The `anon` key is safe to use in client-side code
- Row Level Security (RLS) protects your data
- Only authenticated users can modify portfolio/blog data
- Anyone can submit contact form messages

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

Need help? Check the main README.md or open an issue on GitHub.
