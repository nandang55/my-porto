import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import MediaUploader from '../../components/MediaUploader';
import TechStackInput from '../../components/TechStackInput';
import RichTextEditor from '../../components/RichTextEditor';
import BackButton from '../../components/BackButton';
import AdminNavbar from '../../components/AdminNavbar';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [description, setDescription] = useState('');
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const alert = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Populate form fields
      setValue('title', data.title);
      setValue('slug', data.slug);
      setValue('excerpt', data.excerpt);
      setValue('demo_url', data.demo_url);
      setValue('github_url', data.github_url);
      setValue('order', data.order);
      setValue('published', data.published);
      
      setDescription(data.description || '');
      setTechStack(data.tech_stack || []);
      setMedia(data.media || []);
    } catch (error) {
      console.error('Error fetching project:', error);
      alert.error('Failed to load project');
      navigate('/admin/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Validate required fields
      if (!data.title || !data.slug) {
        alert.error('Title and Slug are required fields.');
        return;
      }

      // Get featured media URL (for backward compatibility with old 'image' column)
      const featuredMedia = media.find(m => m.featured);
      const featuredUrl = featuredMedia?.url || media[0]?.url || null;

      // Generate slug from title if not provided
      let projectSlug = data.slug || '';
      if (!projectSlug && data.title) {
        projectSlug = data.title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }

      const projectData = {
        title: data.title,
        slug: projectSlug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        excerpt: data.excerpt || '',
        description: description,
        image: featuredUrl,
        demo_url: data.demo_url,
        github_url: data.github_url,
        tech_stack: techStack,
        media: media.map(m => ({
          type: m.type,
          url: m.url,
          thumbnail: m.thumbnail,
          featured: m.featured || false
        })),
        order: parseInt(data.order) || 0,
        published: data.published || false,
        user_id: user.id
      };

      if (isEditMode) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        alert.success('Project updated successfully!');
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        alert.success('Project created successfully!');
      }

      navigate('/admin/portfolio');
    } catch (error) {
      console.error('Error saving project:', error);
      alert.error(error.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
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
            <BackButton iconOnly={true} size={32} to="/admin/portfolio" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            {isEditMode ? 'Update your project details' : 'Add a new project to your portfolio'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  placeholder="My Awesome Project"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('slug', { required: 'Slug is required' })}
                  className="input-field"
                  placeholder="my-awesome-project"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                )}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <input
                  type="text"
                  {...register('excerpt')}
                  className="input-field"
                  placeholder="Short description for preview (optional)"
                />
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Write detailed project description..."
            />
          </div>

          {/* Media Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Media</h2>
            <MediaUploader
              media={media}
              onChange={setMedia}
              maxFiles={10}
            />
          </div>

          {/* Tech Stack Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
            <TechStackInput
              value={techStack}
              onChange={setTechStack}
            />
          </div>

          {/* Links Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Demo URL</label>
                <input
                  type="url"
                  {...register('demo_url')}
                  className="input-field"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  {...register('github_url')}
                  className="input-field"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  {...register('order')}
                  className="input-field"
                  placeholder="0"
                  defaultValue={0}
                />
                <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('published')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
                <p className="text-sm text-gray-500 ml-2">Make this project visible to public</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/admin/portfolio"
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <FiSave size={20} />
              {saving ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;

