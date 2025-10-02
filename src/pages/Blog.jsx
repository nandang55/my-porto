import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to dummy data
      setPosts(getDummyPosts());
    } finally {
      setLoading(false);
    }
  };

  const getDummyPosts = () => [
    {
      id: 1,
      title: 'Getting Started with React and Supabase',
      excerpt: 'Learn how to build a full-stack application using React and Supabase. This comprehensive guide covers authentication, database operations, and real-time features.',
      content: 'Full blog post content here...',
      created_at: '2025-01-15',
      slug: 'getting-started-react-supabase',
    },
    {
      id: 2,
      title: 'Building Modern UIs with TailwindCSS',
      excerpt: 'Discover how to create beautiful and responsive user interfaces using TailwindCSS utility classes and custom components.',
      content: 'Full blog post content here...',
      created_at: '2025-01-10',
      slug: 'building-modern-uis-tailwind',
    },
    {
      id: 3,
      title: 'Best Practices for React Performance',
      excerpt: 'Optimize your React applications with these proven performance optimization techniques and best practices.',
      content: 'Full blog post content here...',
      created_at: '2025-01-05',
      slug: 'react-performance-best-practices',
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="section-title">Blog</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
        Thoughts, tutorials, and insights about software development and technology.
      </p>

      <div className="max-w-4xl mx-auto space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="card">
            <div className="flex flex-col">
              <time className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {formatDate(post.created_at)}
              </time>
              <h2 className="text-2xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.slug || post.id}`}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;

