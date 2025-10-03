import { useEffect, useState, useMemo } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import MediaGallery from '../components/MediaGallery';
import TechTag from '../components/TechTag';
import SearchBar from '../components/SearchBar';
import { getTextPreview, stripHtml } from '../utils/textHelpers';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true) // Only fetch published projects
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to dummy data if Supabase is not configured
      setProjects(getDummyProjects());
    } finally {
      setLoading(false);
    }
  };

  const getDummyProjects = () => [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include product management, shopping cart, and payment integration.',
      image: 'https://via.placeholder.com/600x400',
      demo_url: 'https://demo.example.com',
      github_url: 'https://github.com/yourusername/project1',
      tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates using Supabase. Features team collaboration and project tracking.',
      image: 'https://via.placeholder.com/600x400',
      demo_url: 'https://demo.example.com',
      github_url: 'https://github.com/yourusername/project2',
      tech_stack: ['React', 'Supabase', 'TailwindCSS'],
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media metrics with data visualization and reporting features.',
      image: 'https://via.placeholder.com/600x400',
      demo_url: 'https://demo.example.com',
      github_url: 'https://github.com/yourusername/project3',
      tech_stack: ['React', 'Chart.js', 'Firebase'],
    },
  ];

  // Filter projects based on search query
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

      return titleMatch || descriptionMatch || techMatch;
    });
  }, [projects, searchQuery]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="section-title">My Portfolio</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Here are some of my recent projects. Each project showcases different skills and technologies.
      </p>

      {/* Search Bar */}
      <SearchBar
        onSearch={setSearchQuery}
        placeholder="Search projects by name, description, or technology..."
        resultCount={searchQuery ? filteredProjects.length : null}
      />

      {/* Projects List - Alternating Layout */}
      <div className="max-w-6xl mx-auto space-y-12">
        {filteredProjects.map((project, index) => {
          // Get media array or fallback to single image
          const media = project.media && project.media.length > 0 
            ? project.media 
            : project.image 
              ? [{ type: 'image', url: project.image, thumbnail: project.image, featured: true }]
              : [];

          // Alternating layout: even index = media left, odd index = media right
          const isEven = index % 2 === 0;

          return (
            <div 
              key={project.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` 
              }}
            >
              <div className={`grid md:grid-cols-2 gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                {/* Media Section */}
                <div className={`relative overflow-hidden ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  {media.length > 0 ? (
                    <div className="h-full min-h-[300px] p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
                      <div className="w-full">
                        <MediaGallery media={media} title={project.title} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[300px] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="text-white text-6xl opacity-20">📁</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className={`p-6 md:p-8 flex flex-col justify-between ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="min-w-0">
                    {/* Project Title */}
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors break-words">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed break-words">
                      {getTextPreview(project.description, 250)}
                    </p>

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack.map((tech, techIndex) => (
                          <TechTag key={techIndex} tech={tech} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all hover:scale-105 font-medium shadow-lg shadow-primary-500/30"
                      >
                        <FiExternalLink size={18} /> View Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl transition-all hover:scale-105 font-medium shadow-lg"
                      >
                        <FiGithub size={18} /> View Code
                      </a>
                    )}
                  </div>
                </div>
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
              We couldn't find any projects matching "{searchQuery}".
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
      {filteredProjects.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold mb-2">No projects yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Projects will appear here once they are published.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;

