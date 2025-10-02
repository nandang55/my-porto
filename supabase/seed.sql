-- Seed data for development and testing
-- Run with: supabase db seed

-- Clean existing data (optional, for fresh seed)
-- truncate public.projects cascade;
-- truncate public.blog_posts cascade;
-- truncate public.contact_messages cascade;

-- Insert sample projects
insert into public.projects (title, description, image, demo_url, github_url, tech_stack) values
  (
    'E-Commerce Platform',
    'A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include product management, shopping cart, payment integration with Stripe, order tracking, and admin dashboard.',
    'https://via.placeholder.com/600x400/0284c7/ffffff?text=E-Commerce+Platform',
    'https://demo.example.com/ecommerce',
    'https://github.com/yourusername/ecommerce-platform',
    ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe', 'TailwindCSS']
  ),
  (
    'Task Management App',
    'Collaborative task management application with real-time updates using Supabase. Features include team collaboration, project tracking, kanban boards, and time tracking.',
    'https://via.placeholder.com/600x400/0ea5e9/ffffff?text=Task+Manager',
    'https://demo.example.com/taskapp',
    'https://github.com/yourusername/task-manager',
    ARRAY['React', 'Supabase', 'TailwindCSS', 'React Query']
  ),
  (
    'Social Media Dashboard',
    'Analytics dashboard for social media metrics with data visualization and reporting features. Integrates with multiple social media APIs for real-time insights.',
    'https://via.placeholder.com/600x400/38bdf8/ffffff?text=Analytics+Dashboard',
    'https://demo.example.com/dashboard',
    'https://github.com/yourusername/social-dashboard',
    ARRAY['Next.js', 'Chart.js', 'Firebase', 'TypeScript']
  ),
  (
    'Weather Forecast App',
    'Real-time weather forecast application with beautiful UI and detailed weather information. Uses OpenWeather API for accurate weather data.',
    'https://via.placeholder.com/600x400/7dd3fc/ffffff?text=Weather+App',
    'https://demo.example.com/weather',
    'https://github.com/yourusername/weather-app',
    ARRAY['React', 'OpenWeather API', 'TailwindCSS', 'Geolocation']
  ),
  (
    'Recipe Finder',
    'Discover and save your favorite recipes with this intuitive recipe finder app. Features include search, filtering, favorites, and meal planning.',
    'https://via.placeholder.com/600x400/bae6fd/000000?text=Recipe+Finder',
    'https://demo.example.com/recipes',
    'https://github.com/yourusername/recipe-finder',
    ARRAY['Vue.js', 'Recipe API', 'Vuex', 'Bootstrap']
  );

-- Insert sample blog posts
insert into public.blog_posts (title, slug, excerpt, content, published) values
  (
    'Getting Started with React and Supabase',
    'getting-started-react-supabase',
    'Learn how to build a full-stack application using React and Supabase. This comprehensive guide covers authentication, database operations, and real-time features.',
    '# Getting Started with React and Supabase

Supabase is an amazing open-source Firebase alternative that provides all the backend services you need to build a full-stack application.

## What You''ll Learn

- Setting up a React project with Vite
- Configuring Supabase client
- Implementing authentication
- CRUD operations with Supabase
- Real-time subscriptions

## Installation

```bash
npm create vite@latest my-app --template react
cd my-app
npm install @supabase/supabase-js
```

## Configuration

Create a Supabase client...

[Continue with full tutorial content...]',
    true
  ),
  (
    'Building Modern UIs with TailwindCSS',
    'building-modern-uis-tailwind',
    'Discover how to create beautiful and responsive user interfaces using TailwindCSS utility classes and custom components.',
    '# Building Modern UIs with TailwindCSS

TailwindCSS is a utility-first CSS framework that makes it easy to build modern, responsive interfaces.

## Why TailwindCSS?

- Utility-first approach
- Highly customizable
- Great for rapid prototyping
- Small production bundle size

## Getting Started

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

[Continue with full tutorial content...]',
    true
  ),
  (
    'Best Practices for React Performance',
    'react-performance-best-practices',
    'Optimize your React applications with these proven performance optimization techniques and best practices.',
    '# Best Practices for React Performance

Performance is crucial for user experience. Here are the best practices to optimize your React applications.

## Key Optimization Techniques

1. Use React.memo for expensive components
2. Implement useMemo and useCallback hooks
3. Code splitting with React.lazy
4. Virtual scrolling for long lists
5. Optimize images and assets

[Continue with full tutorial content...]',
    true
  ),
  (
    'Introduction to PostgreSQL for Beginners',
    'intro-postgresql-beginners',
    'A beginner-friendly guide to PostgreSQL, the world''s most advanced open-source relational database.',
    '# Introduction to PostgreSQL

PostgreSQL is a powerful, open-source relational database system with over 30 years of active development.

## What is PostgreSQL?

PostgreSQL is an object-relational database management system (ORDBMS) that supports SQL and provides many advanced features.

[Continue with full tutorial content...]',
    true
  ),
  (
    'Dark Mode Implementation in React',
    'dark-mode-react',
    'Learn how to implement a dark mode toggle in your React application with persistent state and smooth transitions.',
    '# Dark Mode Implementation in React

Dark mode has become a must-have feature in modern applications. Here''s how to implement it properly in React.

## Using Context API

We''ll use React Context to manage the dark mode state globally...

[Continue with full tutorial content...]',
    false
  );

-- Insert sample contact messages (for testing admin panel)
insert into public.contact_messages (name, email, subject, message, read) values
  (
    'John Doe',
    'john.doe@example.com',
    'Interested in Collaboration',
    'Hi! I came across your portfolio and I''m really impressed with your work. I''d love to discuss a potential collaboration on a project I''m working on. Would you be available for a quick call next week?',
    false
  ),
  (
    'Sarah Johnson',
    'sarah.j@techcorp.com',
    'Job Opportunity',
    'Hello! We''re currently hiring for a Senior React Developer position at TechCorp. Based on your portfolio, we think you''d be a great fit for our team. Are you open to discussing this opportunity?',
    true
  ),
  (
    'Mike Chen',
    'mike.chen@startup.io',
    'Question about Your Project',
    'Hey! I saw your e-commerce platform project and I have some questions about the tech stack you used. Would you mind if I ask you a few questions about the architecture?',
    false
  );

-- Verify insertions
select 'Projects created: ' || count(*)::text from public.projects;
select 'Blog posts created: ' || count(*)::text from public.blog_posts;
select 'Messages created: ' || count(*)::text from public.contact_messages;

