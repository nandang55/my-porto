import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowLeft, FiUser, FiEye } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import TenantNavbar from '../components/TenantNavbar';
import { setFavicon, resetFavicon } from '../utils/faviconHelper';

const TenantBlogDetail = () => {
  const { slug, postSlug } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    fetchData();
    
    // Cleanup on unmount
    return () => {
      resetFavicon();
      document.title = 'BagdjaPorto';
    };
  }, [slug, postSlug]);

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
      
      // Set favicon
      if (portfolioData.favicon_url) {
        setFavicon(portfolioData.favicon_url);
      } else {
        resetFavicon();
      }

      // Fetch blog post by slug
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', portfolioData.user_id)
        .eq('slug', postSlug)
        .eq('published', true)
        .single();

      if (postError) throw postError;
      setPost(postData);
      
      // Set page title
      document.title = `${postData.title} - ${portfolioData.name}`;

      // Record page view
      await recordPageView(postData.id);

      // Fetch view count
      await fetchViewCount(postData.id);
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

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const recordPageView = async (postId) => {
    try {
      // Get user agent and referrer
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;

      console.log('Recording view for post:', postId);

      // Insert view log
      const { data, error } = await supabase
        .from('blog_views')
        .insert([
          {
            post_id: postId,
            user_agent: userAgent,
            referrer: referrer || null,
          },
        ]);

      if (error) {
        console.error('Error inserting view:', error);
      } else {
        console.log('View recorded successfully:', data);
      }
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.error('Error recording page view:', error);
    }
  };

  const fetchViewCount = async (postId) => {
    try {
      const { count, error } = await supabase
        .from('blog_views')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      setViewCount(count || 0);
    } catch (error) {
      console.error('Error fetching view count:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!portfolio || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(`/${slug}/blog`)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiArrowLeft />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TenantNavbar portfolio={portfolio} />

      {/* Hero Section with Cover Image */}
      <section className="relative">
        {post.cover_image ? (
          <div className="relative h-96 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${portfolio.theme_color || '#0284c7'}CC 100%)`
              }}
            ></div>
          </div>
        ) : (
          <div 
            className="h-64"
            style={{
              background: `linear-gradient(135deg, ${portfolio.theme_color || '#0284c7'} 0%, ${portfolio.secondary_color || '#6366f1'} 100%)`
            }}
          ></div>
        )}

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(`/${slug}/blog`)}
            className="btn-secondary flex items-center gap-2 shadow-lg"
          >
            <FiArrowLeft />
            Back to Blog
          </button>
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <FiUser size={18} />
                <span className="font-medium">{portfolio.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={18} />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={18} />
                <span>{getReadingTime(post.content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye size={18} />
                <span>{viewCount.toLocaleString()} views</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {portfolio.avatar_url && (
                  <img
                    src={portfolio.avatar_url}
                    alt={portfolio.name}
                    className="w-16 h-16 rounded-full object-cover border-2"
                    style={{ borderColor: portfolio.theme_color || '#0284c7' }}
                  />
                )}
                <div>
                  <p className="font-bold text-lg">{portfolio.name}</p>
                  {portfolio.title && (
                    <p className="text-gray-600 dark:text-gray-400">{portfolio.title}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/${slug}/blog`)}
                className="btn-secondary flex items-center gap-2"
              >
                <FiArrowLeft />
                More Posts
              </button>
            </div>
          </footer>
        </div>
      </article>

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

export default TenantBlogDetail;
