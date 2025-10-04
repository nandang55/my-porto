import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowRight, FiEye } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import TenantNavbar from '../components/TenantNavbar';
import SearchBar from '../components/SearchBar';
import { setFavicon, resetFavicon } from '../utils/faviconHelper';
import { getTextPreview, stripHtml } from '../utils/textHelpers';

const TenantBlog = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
    
    // Cleanup on unmount
    return () => {
      resetFavicon();
      document.title = 'BagdjaPorto';
    };
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
      
      // Set favicon and title
      if (portfolioData.favicon_url) {
        setFavicon(portfolioData.favicon_url);
      } else {
        resetFavicon();
      }
      document.title = `${portfolioData.name} - Blog`;

      // Fetch published blog posts only
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', portfolioData.user_id)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch view counts for all posts
      const postsWithViews = await Promise.all(
        (postsData || []).map(async (post) => {
          const { count } = await supabase
            .from('blog_views')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);
          
          return {
            ...post,
            view_count: count || 0,
          };
        })
      );

      setPosts(postsWithViews);
      setPublishedPosts(postsWithViews);
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

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now - postDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    console.log('Search query:', searchQuery);
    console.log('Posts:', posts.length);
    
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    console.log('Filtering with query:', query);

    const filtered = posts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const excerptMatch = post.excerpt?.toLowerCase().includes(query);
      const contentText = stripHtml(post.content || '').toLowerCase();
      const contentMatch = contentText.includes(query);
      const slugMatch = post.slug?.toLowerCase().includes(query);

      const match = titleMatch || excerptMatch || contentMatch || slugMatch;
      console.log(`Post "${post.title}": title=${titleMatch}, excerpt=${excerptMatch}, content=${contentMatch}, slug=${slugMatch}, match=${match}`);
      
      return match;
    });

    console.log('Filtered results:', filtered.length);
    return filtered;
  }, [posts, searchQuery]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!portfolio) {
    return <div className="min-h-screen flex items-center justify-center">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TenantNavbar portfolio={portfolio} />

      {/* Hero Section with Parallax */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          background: portfolio.cover_image
            ? `url('${portfolio.cover_image}')`
            : `linear-gradient(135deg, ${portfolio.theme_color || '#0284c7'} 0%, ${portfolio.secondary_color || '#6366f1'} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${portfolio.theme_color || '#0284c7'}CC 0%, ${portfolio.secondary_color || '#6366f1'}CC 100%)`
          }}
        ></div>
        
        {/* Parallax Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeInUp">
              Blog
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Thoughts, tutorials, and insights
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <FiEye />
                <span>{publishedPosts.length} {publishedPosts.length === 1 ? 'Post' : 'Posts'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="currentColor" 
              fillOpacity="1" 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              className="text-white dark:text-gray-900"
            ></path>
          </svg>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              {/* Search Bar */}
              <div className="mb-12">
                <SearchBar
                  onSearch={setSearchQuery}
                  placeholder="Search blog posts..."
                  resultCount={filteredPosts.length}
                  resultType="posts"
                />
              </div>

              {/* Posts Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/${slug}/blog/${post.slug}`}
                    className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden block"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Cover Image */}
                    {post.cover_image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div 
                        className="h-48 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${portfolio.theme_color || '#0284c7'}20 0%, ${portfolio.secondary_color || '#6366f1'}20 100%)`
                        }}
                      >
                        <div className="text-6xl opacity-30">📝</div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock size={14} />
                          <span>{getReadingTime(post.content)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiEye size={14} />
                          <span>{post.view_count || 0}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Content Preview */}
                      <div className="text-sm text-gray-500 dark:text-gray-500 mb-4 line-clamp-2">
                        {getTextPreview(post.content, 120)}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center justify-between">
                        <span 
                          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium group-hover:gap-3 transition-all"
                        >
                          Read More
                          <FiArrowRight size={16} />
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(post.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div 
                      className="absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        borderColor: portfolio.theme_color || '#0284c7'
                      }}
                    ></div>
                  </Link>
                ))}
              </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold mb-2">No posts found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      No blog posts match "{searchQuery}". Try different keywords or clear search.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="btn-primary"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-8xl mb-6">📝</div>
                <h3 className="text-3xl font-bold mb-4">No Blog Posts Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Blog posts will appear here soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

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

