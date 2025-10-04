import { Link } from 'react-router-dom';
import { FiExternalLink, FiGithub, FiEye } from 'react-icons/fi';
import MediaGallery from './MediaGallery';
import TechTag from './TechTag';
import { getTextPreview } from '../utils/textHelpers';

const ProjectCard = ({ 
  project, 
  index, 
  showAnimation = true,
  baseUrl = '',
  showViewDetails = false 
}) => {
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
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
      style={showAnimation ? { 
        animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` 
      } : {}}
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
              {project.excerpt || getTextPreview(project.description, 250)}
            </p>

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech_stack.slice(0, 10).map((tech, techIndex) => (
                  <TechTag key={techIndex} tech={tech} size="sm" />
                ))}
              </div>
            )}

            {/* Meta Info */}
            {project.views !== undefined && project.created_at && (
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <FiEye size={14} />
                  {project.views || 0} views
                </span>
                <span>•</span>
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3">
            {showViewDetails && project.slug && (
              <Link
                to={`${baseUrl}/project/${project.slug}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl transition-all hover:scale-105 font-medium"
              >
                <FiEye size={18} /> View Details
              </Link>
            )}
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
};

export default ProjectCard;

