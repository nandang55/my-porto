import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import MediaUploader from '../../components/MediaUploader';
import TechStackInput from '../../components/TechStackInput';
import TechTag from '../../components/TechTag';
import RichTextEditor from '../../components/RichTextEditor';
import SearchBar from '../../components/SearchBar';
import BackButton from '../../components/BackButton';
import { useAlert } from '../../context/AlertContext';
import { getTextPreview, stripHtml } from '../../utils/textHelpers';

const AdminPortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [media, setMedia] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const alert = useAlert();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Get featured media URL (for backward compatibility with old 'image' column)
      const featuredMedia = media.find(m => m.featured);
      const featuredUrl = featuredMedia?.url || media[0]?.url || null;

      const projectData = {
        title: data.title,
        description: description, // Use description from state (rich text HTML)
        image: featuredUrl, // Keep for backward compatibility
        demo_url: data.demo_url,
        github_url: data.github_url,
        tech_stack: techStack, // Use techStack from state
        media: media.map(m => ({
          type: m.type,
          url: m.url,
          thumbnail: m.thumbnail,
          featured: m.featured || false,
        })),
        featured_media: featuredUrl,
        order: parseInt(data.order) || 0,
        published: data.published === true || data.published === 'true',
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
      }

      await fetchProjects();
      setShowForm(false);
      setEditingProject(null);
      setMedia([]);
      setTechStack([]);
      setDescription('');
      reset();
      
      // Show success message
      if (editingProject) {
        alert.success('Project updated successfully!');
      } else {
        alert.success('Project created successfully!');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert.error('Failed to save project. Make sure Supabase is properly configured.');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      demo_url: project.demo_url,
      github_url: project.github_url,
      order: project.order || 0,
      published: project.published !== false, // Default to true if undefined
    });
    
    // Load existing description (rich text HTML)
    setDescription(project.description || '');
    
    // Load existing media
    if (project.media && Array.isArray(project.media) && project.media.length > 0) {
      setMedia(project.media);
    } else if (project.image) {
      // Fallback for old projects with single image
      setMedia([{
        type: 'image',
        url: project.image,
        thumbnail: project.image,
        featured: true,
      }]);
    } else {
      setMedia([]);
    }
    
    // Load existing tech stack
    setTechStack(project.tech_stack || []);
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
      alert.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert.error('Failed to delete project. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setMedia([]);
    setTechStack([]);
    setDescription('');
    reset();
  };

  // Filter projects based on search query (includes drafts)
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase();

    return projects.filter((project) => {
      // Search in title
      const titleMatch = project.title?.toLowerCase().includes(query);

      // Search in description (plain text only)
      const descriptionText = stripHtml(project.description || '').toLowerCase();
      const descriptionMatch = descriptionText.includes(query);

      // Search in tech stack
      const techMatch = project.tech_stack?.some((tech) =>
        tech.toLowerCase().includes(query)
      );

      // Search by status
      const statusMatch = 
        (query === 'draft' && project.published === false) ||
        (query === 'published' && project.published !== false);

      return titleMatch || descriptionMatch || techMatch || statusMatch;
    });
  }, [projects, searchQuery]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BackButton iconOnly={true} size={32} />
            <h1 className="text-3xl font-bold">Manage Portfolio</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Project
          </button>
        </div>

        {/* Admin Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search projects by name, tech, or type 'draft' to see drafts..."
            resultCount={searchQuery ? filteredProjects.length : null}
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Title</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field"
                    placeholder="Project title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Rich Text Description */}
                <div>
                  <label className="block font-medium mb-3">Description</label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Write a detailed project description. You can use formatting, lists, and links..."
                    minHeight="250px"
                  />
                  {!description && (
                    <p className="text-red-500 text-sm mt-1">Description is required</p>
                  )}
                </div>

                {/* Media Uploader - Images & Videos */}
                <div>
                  <label className="block font-medium mb-3">Media (Images & Videos)</label>
                  <MediaUploader 
                    media={media} 
                    onChange={setMedia}
                    maxFiles={10}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Demo URL</label>
                  <input
                    {...register('demo_url')}
                    className="input-field"
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">GitHub URL</label>
                  <input
                    {...register('github_url')}
                    className="input-field"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                {/* Tech Stack Input with Autocomplete */}
                <div>
                  <label className="block font-medium mb-3">Tech Stack</label>
                  <TechStackInput 
                    value={techStack}
                    onChange={setTechStack}
                  />
                </div>

                {/* Order & Published Settings */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Display Order</label>
                    <input
                      type="number"
                      {...register('order')}
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Lower number = shows first (0, 1, 2, 3...)
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Status</label>
                    <div className="flex items-center h-10">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('published')}
                          className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          defaultChecked
                        />
                        <span className="text-sm font-medium">
                          Published (visible to public)
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uncheck to save as draft (hidden)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            // Get featured media or first media item
            const featuredMedia = project.media?.find(m => m.featured) || project.media?.[0];
            const displayImage = featuredMedia?.thumbnail || featuredMedia?.url || project.image;
            const mediaCount = project.media?.length || 0;
            
            return (
              <div key={project.id} className="card relative">
                {displayImage && (
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    {mediaCount > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {mediaCount} media
                      </div>
                    )}
                    {/* Published Status Badge */}
                    {project.published === false && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                        DRAFT
                      </div>
                    )}
                    {/* Order Badge */}
                    {project.order !== undefined && project.order >= 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Order: {project.order}
                      </div>
                    )}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {getTextPreview(project.description, 200)}
                </p>
                
                {/* Tech Stack Tags */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack.slice(0, 4).map((tech, idx) => (
                      <TechTag key={idx} tech={tech} size="sm" />
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        +{project.tech_stack.length - 4}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="btn-secondary flex items-center gap-1 text-sm flex-1"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="btn-secondary flex items-center gap-1 text-sm flex-1 text-red-600 dark:text-red-400"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State - No Results */}
        {filteredProjects.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No projects match "{searchQuery}". Try different keywords or clear search.
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

        {/* Empty State - No Projects */}
        {projects.length === 0 && !searchQuery && (
          <div className="text-center py-12 text-gray-500">
            No projects yet. Click "Add Project" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;

