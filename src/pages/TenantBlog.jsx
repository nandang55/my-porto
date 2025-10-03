import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import TenantNavbar from '../components/TenantNavbar';

const TenantBlog = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      // Fetch portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (portfolioError) throw portfolioError;
      setPortfolio(portfolioData);

      // Fetch blog posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', portfolioData.user_id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!portfolio) {
    return <div className="min-h-screen flex items-center justify-center">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TenantNavbar portfolio={portfolio} />

      <div className="container mx-auto px-4 py-20">
        <h1 className="section-title">Blog</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights
        </p>

        {posts.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="card hover:shadow-xl transition-shadow">
                <time className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                  {formatDate(post.created_at)}
                </time>
                <h2 className="text-2xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div 
                  className="prose dark:prose-invert line-clamp-3 text-sm text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Blog posts will appear here soon.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TenantBlog;

