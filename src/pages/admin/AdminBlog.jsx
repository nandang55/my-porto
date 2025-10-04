import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import BackButton from '../../components/BackButton';
import SearchBar from '../../components/SearchBar';
import AdminNavbar from '../../components/AdminNavbar';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { stripHtml } from '../../utils/textHelpers';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const alert = useAlert();
  const { user } = useAuth();

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();

    return posts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const excerptMatch = post.excerpt?.toLowerCase().includes(query);
      const contentText = stripHtml(post.content || '').toLowerCase();
      const contentMatch = contentText.includes(query);
      const slugMatch = post.slug?.toLowerCase().includes(query);

      return titleMatch || excerptMatch || contentMatch || slugMatch;
    });
  }, [posts, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_views_count:blog_views(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process data to include view count
      const postsWithViews = data.map(post => ({
        ...post,
        views: post.blog_views_count?.[0]?.count || 0
      }));

      setPosts(postsWithViews);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPosts();
      alert.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert.error('Failed to delete post');
    }
  };

  // Calculate statistics
  const publishedCount = posts.filter(p => p.published).length;
  const totalCount = posts.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BackButton iconOnly={true} size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Manage your blog posts and articles
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/blog/new')}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add New Post
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{publishedCount}/{totalCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">published / total</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">across all posts</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCount - publishedCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">unpublished posts</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts by title, excerpt, content, or slug..."
          />
        </div>

        {/* Blog Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'No posts found matching your search.' : 'No blog posts yet. Create your first post!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Cover Image */}
                  {post.cover_image && (
                    <div className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-1 truncate">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <FiEye size={14} />
                        {post.views || 0} views
                      </span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.slug && (
                        <>
                          <span>•</span>
                          <span className="truncate">/{post.slug}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                        className="btn-secondary flex items-center gap-1 text-sm flex-1"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm flex items-center gap-1 flex-1"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
