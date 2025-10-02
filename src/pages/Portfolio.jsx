import { useEffect, useState } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { supabase } from '../services/supabase';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
        Here are some of my recent projects. Each project showcases different skills and technologies.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project) => (
          <div key={project.id} className="card group">
            {/* Project Image */}
            <div className="relative overflow-hidden rounded-lg mb-4 h-48">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Project Info */}
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack */}
            {project.tech_stack && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <FiExternalLink /> Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <FiGithub /> Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;

