import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { supabase } from '../../services/supabase';

const AdminPortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
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
      const projectData = {
        title: data.title,
        description: data.description,
        image: data.image,
        demo_url: data.demo_url,
        github_url: data.github_url,
        tech_stack: data.tech_stack.split(',').map(t => t.trim()),
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
      reset();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Make sure Supabase is properly configured.');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      description: project.description,
      image: project.image,
      demo_url: project.demo_url,
      github_url: project.github_url,
      tech_stack: project.tech_stack?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    reset();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Portfolio</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Project
          </button>
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Title</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field"
                    placeholder="Project title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-2">Description</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    className="input-field"
                    rows="4"
                    placeholder="Project description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-2">Image URL</label>
                  <input
                    {...register('image')}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
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

                <div>
                  <label className="block font-medium mb-2">Tech Stack (comma separated)</label>
                  <input
                    {...register('tech_stack')}
                    className="input-field"
                    placeholder="React, Node.js, PostgreSQL"
                  />
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
          {projects.map((project) => (
            <div key={project.id} className="card">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {project.description}
              </p>
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
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects yet. Click "Add Project" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;

