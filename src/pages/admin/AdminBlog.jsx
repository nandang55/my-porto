import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiX, FiUpload, FiImage, FiEye } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import RichTextEditor from '../../components/RichTextEditor';
import BackButton from '../../components/BackButton';
import SearchBar from '../../components/SearchBar';
import AdminNavbar from '../../components/AdminNavbar';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { stripHtml } from '../../utils/textHelpers';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', user.id) // Only fetch current user's posts
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch view counts for all posts
      const postsWithViews = await Promise.all(
        (data || []).map(async (post) => {
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
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Upload cover image if provided
      let coverImageUrl = null;
      if (coverImageFile) {
        coverImageUrl = await uploadCoverImage();
        if (!coverImageUrl) {
          alert.error('Failed to upload cover image');
          return;
        }
      } else if (editingPost?.cover_image) {
        coverImageUrl = editingPost.cover_image;
      }

      const postData = {
        title: data.title,
        excerpt: data.excerpt,
        content: content, // Use content from state (rich text HTML)
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        published: data.published || false,
        cover_image: coverImageUrl,
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
      published: post.published,
      cover_image: post.cover_image,
    });
    setContent(post.content || '');
    setCoverImageFile(null);
    setCoverImagePreview(null);
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
    setCoverImageFile(null);
    setCoverImagePreview(null);
    reset();
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert.error('Cover image size must be less than 5MB');
      return;
    }

    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadCoverImage = async () => {
    if (!coverImageFile || !user) return null;

    setUploadingCover(true);
    try {
      if (editingPost?.cover_image) {
        const oldPath = editingPost.cover_image.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('covers').remove([`${user.id}/${oldPath}`]);
        }
      }

      const fileExt = coverImageFile.name.split('.').pop();
      const fileName = `blog_cover_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, coverImageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert.error('Failed to upload cover image');
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setValue('cover_image', '');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="container mx-auto px-4 max-w-5xl py-8">
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

                {/* Cover Image */}
                <div>
                  <label className="block font-medium mb-2">Cover Image</label>
                  
                  {/* Preview */}
                  {(coverImagePreview || watch('cover_image')) && (
                    <div className="relative inline-block mb-4">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
                        <img
                          src={coverImagePreview || watch('cover_image')}
                          alt="Cover preview"
                          className="w-32 h-20 object-cover rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="btn-secondary cursor-pointer flex items-center gap-2 w-fit">
                    <FiUpload />
                    {uploadingCover ? 'Uploading...' : coverImageFile ? 'Change Image' : 'Upload Cover'}
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" disabled={uploadingCover} />
                  </label>
                  <input type="hidden" {...register('cover_image')} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Blog cover image (recommended: 800x400px, max 5MB)
                  </p>
                </div>

                {/* Published Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    {...register('published')}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="published" className="font-medium">
                    Publish this post
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                  Unpublished posts will be saved as drafts
                </p>

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
                  <button type="submit" className="btn-primary flex-1" disabled={uploadingCover}>
                    {uploadingCover ? 'Uploading...' : editingPost ? 'Update Post' : (watch('published') ? 'Publish Post' : 'Save Draft')}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search blog posts..."
            resultCount={filteredPosts.length}
            resultType="posts"
          />
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex justify-between items-start gap-4">
                {/* Cover Image */}
                {post.cover_image && (
                  <div className="flex-shrink-0">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold truncate">{post.title}</h3>
                    {!post.published && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                        DRAFT
                      </span>
                    )}
                    {post.published && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                        PUBLISHED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <FiEye size={14} />
                      <span>{post.view_count || 0} views</span>
                    </div>
                    <span>Slug: {post.slug}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
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
            ))
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

