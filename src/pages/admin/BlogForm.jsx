import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiSave, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import RichTextEditor from '../../components/RichTextEditor';
import BackButton from '../../components/BackButton';
import AdminNavbar from '../../components/AdminNavbar';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      published: false
    }
  });
  const alert = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    if (isEditMode) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        reset({
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          published: data.published,
        });
        setContent(data.content || '');
        if (data.cover_image) {
          setCoverImagePreview(data.cover_image);
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      alert.error('Failed to load blog post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert.error('Image size must be less than 5MB');
        return;
      }

      setCoverImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const uploadCoverImage = async () => {
    if (!coverImageFile) return null;

    setUploadingCover(true);
    try {
      // Generate unique ID
      const id = Math.random().toString(36).substring(2, 10);
      
      // Get original filename without extension and sanitize it
      const fileNameWithoutExt = coverImageFile.name.substring(0, coverImageFile.name.lastIndexOf('.')) || coverImageFile.name;
      const sanitizedFileName = fileNameWithoutExt
        .toLowerCase()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .substring(0, 50);
      
      const timestamp = Date.now();
      const fileExt = coverImageFile.name.split('.').pop();
      const fileName = `${id}_${sanitizedFileName}_${timestamp}.${fileExt}`;
      const filePath = `blog-covers/${fileName}`;

      const { data, error } = await supabase.storage
        .from('covers')
        .upload(filePath, coverImageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert.error('Failed to upload cover image');
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  const onSubmit = async (data) => {
    if (!content.trim()) {
      alert.error('Content is required');
      return;
    }

    setSaving(true);
    try {
      // Upload cover image if new one is provided
      let coverImageUrl = coverImagePreview;
      if (coverImageFile) {
        const uploadedUrl = await uploadCoverImage();
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        }
      }

      const postData = {
        title: data.title,
        excerpt: data.excerpt,
        content: content,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        published: data.published || false,
        cover_image: coverImageUrl,
        user_id: user.id,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        alert.success('Blog post updated successfully!');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        alert.success('Blog post created successfully!');
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert.error('Failed to save blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="max-w-5xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BackButton iconOnly={true} size={32} to="/admin/blog" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            {isEditMode ? 'Update your blog post details' : 'Write and publish a new blog post'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  placeholder="Enter blog post title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block font-medium mb-2">Slug</label>
                <input
                  {...register('slug')}
                  className="input-field"
                  placeholder="post-slug (leave empty to auto-generate from title)"
                />
                <button
                  type="button"
                  onClick={() => {
                    const title = watch('title');
                    if (title) {
                      const slug = title.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .trim();
                      setValue('slug', slug);
                    }
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                >
                  Generate from title
                </button>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-medium mb-2">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('excerpt', { required: 'Excerpt is required' })}
                  className="input-field"
                  rows="3"
                  placeholder="Short description of the post (shown in blog list)"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Cover Image</h2>
            
            {coverImagePreview ? (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  title="Remove image"
                >
                  <FiX size={20} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <FiImage className="mx-auto text-gray-400 mb-4" size={48} />
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <FiUpload size={16} />
                  Choose Cover Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Recommended size: 1200x630px (max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Settings Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Post Settings</h2>
            <div className="space-y-4">
              {/* Published Status */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="published"
                  {...register('published')}
                  className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div>
                  <label htmlFor="published" className="font-medium cursor-pointer">
                    Publish this post
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Unpublished posts will be saved as drafts and won't be visible to the public
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              Content <span className="text-red-500">*</span>
            </h2>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog post content. Use the toolbar to format text, add headings, lists, links, and more..."
              minHeight="500px"
            />
            {!content && (
              <p className="text-red-500 text-sm mt-2">Content is required</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={saving || uploadingCover}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FiSave size={18} />
              {saving ? 'Saving...' : uploadingCover ? 'Uploading...' : isEditMode ? 'Update Post' : (watch('published') ? 'Publish Post' : 'Save Draft')}
            </button>
            <Link
              to="/admin/blog"
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;

