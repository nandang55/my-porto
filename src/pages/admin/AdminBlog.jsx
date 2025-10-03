import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import RichTextEditor from '../../components/RichTextEditor';
import BackButton from '../../components/BackButton';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [content, setContent] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const alert = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', user.id) // Only fetch current user's posts
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const postData = {
        title: data.title,
        excerpt: data.excerpt,
        content: content, // Use content from state (rich text HTML)
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        user_id: user.id, // Link to current user
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      await fetchPosts();
      setShowForm(false);
      setEditingPost(null);
      setContent('');
      reset();
      
      // Show success message
      if (editingPost) {
        alert.success('Blog post updated successfully!');
      } else {
        alert.success('Blog post published successfully!');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert.error('Failed to save post. Make sure Supabase is properly configured.');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    reset({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
    });
    setContent(post.content || '');
    setShowForm(true);
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
      alert.success('Blog post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert.error('Failed to delete post. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setContent('');
    reset();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <BackButton iconOnly={true} size={32} />
            <h1 className="text-3xl font-bold">Manage Blog</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Post
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingPost ? 'Edit Post' : 'Add New Post'}
                </h2>
                <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Title</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field"
                    placeholder="Post title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-2">Slug</label>
                  <input
                    {...register('slug')}
                    className="input-field"
                    placeholder="post-slug (leave empty to auto-generate)"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Excerpt</label>
                  <textarea
                    {...register('excerpt', { required: 'Excerpt is required' })}
                    className="input-field"
                    rows="3"
                    placeholder="Short description of the post"
                  />
                  {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
                </div>

                {/* Rich Text Content */}
                <div>
                  <label className="block font-medium mb-3">Content</label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your blog post content. Use the toolbar to format text, add headings, lists, links, and more..."
                    minHeight="400px"
                  />
                  {!content && (
                    <p className="text-red-500 text-sm mt-1">Content is required</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingPost ? 'Update' : 'Publish'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {post.excerpt}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="btn-secondary flex items-center gap-1 text-sm"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn-secondary flex items-center gap-1 text-sm text-red-600 dark:text-red-400"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No blog posts yet. Click "Add Post" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;

