import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../services/supabase';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import { stripHtml } from '../utils/textHelpers';

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

      {/* Projects List - Using ProjectCard Component */}
      <div className="max-w-6xl mx-auto space-y-12">
        {filteredProjects.map((project, index) => (
          <ProjectCard 
            key={project.id}
            project={project}
            index={index}
            showAnimation={true}  // Enable animations for main portfolio page
            baseUrl=""           // No base URL needed for main portfolio page
            showViewDetails={false} // Hide View Details button since we show demo/github buttons
          />
        ))}
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

