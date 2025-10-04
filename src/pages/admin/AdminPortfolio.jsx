import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import TechTag from '../../components/TechTag';
import SearchBar from '../../components/SearchBar';
import BackButton from '../../components/BackButton';
import AdminNavbar from '../../components/AdminNavbar';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { getTextPreview, stripHtml } from '../../utils/textHelpers';

const AdminPortfolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const alert = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id) // Only fetch current user's projects
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch view counts for all projects
      const projectsWithViews = await Promise.all(
        (data || []).map(async (project) => {
          const { count } = await supabase
            .from('project_views')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);
          
          return {
            ...project,
            view_count: count || 0,
          };
        })
      );

      setProjects(projectsWithViews);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BackButton iconOnly={true} size={32} />
            <h1 className="text-3xl font-bold">Manage Portfolio</h1>
          </div>
          <button
            onClick={() => navigate('/admin/portfolio/new')}
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
                  {project.excerpt || getTextPreview(project.description, 200)}
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
                
                {/* Project Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <FiEye size={14} />
                    <span>{project.view_count || 0} views</span>
                  </div>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/portfolio/edit/${project.id}`)}
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

