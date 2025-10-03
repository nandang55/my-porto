import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiExternalLink, FiGithub, FiMail, FiLinkedin, FiTwitter, FiInstagram, FiGlobe, FiMapPin, FiPhone, FiDownload, FiBriefcase, FiClock } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import MediaGallery from '../components/MediaGallery';
import TechTag from '../components/TechTag';
import SearchBar from '../components/SearchBar';
import TenantNavbar from '../components/TenantNavbar';
import { getTextPreview, stripHtml } from '../utils/textHelpers';

const PublicPortfolio = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
  }, [slug]);

  const fetchPortfolioData = async () => {
    try {
      // Fetch portfolio by slug
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (portfolioError) throw portfolioError;
      setPortfolio(portfolioData);

      // Fetch user's published projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', portfolioData.user_id)
        .eq('published', true)
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      setNotFound(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase();

    return projects.filter((project) => {
      const titleMatch = project.title?.toLowerCase().includes(query);
      const descriptionText = stripHtml(project.description || '').toLowerCase();
      const descriptionMatch = descriptionText.includes(query);
      const techMatch = project.tech_stack?.some((tech) =>
        tech.toLowerCase().includes(query)
      );

      return titleMatch || descriptionMatch || techMatch;
    });
  }, [projects, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (notFound || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The portfolio "/{slug}" doesn't exist or is not active.
          </p>
          <Link to="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <TenantNavbar portfolio={portfolio} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Avatar */}
          {portfolio.avatar_url && (
            <img
              src={portfolio.avatar_url}
              alt={portfolio.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-xl object-cover"
            />
          )}

          {/* Name, Username & Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{portfolio.name}</h1>
          {portfolio.username && (
            <p className="text-lg opacity-75 mb-2">@{portfolio.username}</p>
          )}
          {portfolio.title && (
            <p className="text-xl md:text-2xl opacity-90 mb-4">{portfolio.title}</p>
          )}
          {portfolio.tagline && (
            <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">{portfolio.tagline}</p>
          )}

          {/* Company & Experience */}
          {(portfolio.company || portfolio.years_experience) && (
            <div className="flex justify-center gap-6 mb-6 text-sm opacity-80">
              {portfolio.company && (
                <span className="flex items-center gap-2">
                  <FiBriefcase size={16} /> {portfolio.company}
                </span>
              )}
              {portfolio.years_experience && (
                <span className="flex items-center gap-2">
                  <FiClock size={16} /> {portfolio.years_experience} years experience
                </span>
              )}
            </div>
          )}

          {/* Availability Badge */}
          {portfolio.availability_status && portfolio.availability_status !== 'unavailable' && (
            <div className="flex justify-center mb-6">
              <span className={`px-4 py-2 rounded-full font-medium text-sm ${
                portfolio.availability_status === 'available'
                  ? 'bg-green-500/20 text-green-100 border border-green-400'
                  : 'bg-yellow-500/20 text-yellow-100 border border-yellow-400'
              }`}>
                {portfolio.availability_status === 'available' ? '✅ Available for hire' : '⏰ Limited availability'}
                {portfolio.hourly_rate && ` • ${portfolio.hourly_rate}`}
              </span>
            </div>
          )}

          {/* Bio */}
          {portfolio.bio && (
            <p className="max-w-2xl mx-auto text-lg opacity-80 mb-8">{portfolio.bio}</p>
          )}

          {/* Contact & Social Links */}
          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {portfolio.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Email"
              >
                <FiMail size={20} />
              </a>
            )}
            {portfolio.phone && (
              <a
                href={`tel:${portfolio.phone}`}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Phone"
              >
                <FiPhone size={20} />
              </a>
            )}
            {portfolio.github_url && (
              <a
                href={portfolio.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="GitHub"
              >
                <FiGithub size={20} />
              </a>
            )}
            {portfolio.linkedin_url && (
              <a
                href={portfolio.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
            )}
            {portfolio.twitter_url && (
              <a
                href={portfolio.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Twitter"
              >
                <FiTwitter size={20} />
              </a>
            )}
            {portfolio.instagram_url && (
              <a
                href={portfolio.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Instagram"
              >
                <FiInstagram size={20} />
              </a>
            )}
            {portfolio.website && (
              <a
                href={portfolio.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Website"
              >
                <FiGlobe size={20} />
              </a>
            )}
            {portfolio.resume_url && (
              <a
                href={portfolio.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Download Resume"
              >
                <FiDownload size={20} />
              </a>
            )}
          </div>

          {/* Location & Timezone */}
          <div className="flex justify-center gap-4 flex-wrap opacity-80 text-sm">
            {portfolio.location && (
              <span className="flex items-center gap-2">
                <FiMapPin size={16} /> {portfolio.location}
              </span>
            )}
            {portfolio.timezone && (
              <span className="flex items-center gap-2">
                <FiClock size={16} /> {portfolio.timezone}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {(portfolio.skills?.length > 0 || portfolio.languages?.length > 0) && (
        <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {portfolio.skills && portfolio.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill, index) => (
                      <TechTag key={index} tech={skill} size="md" />
                    ))}
                  </div>
                </div>
              )}

              {portfolio.languages && portfolio.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-3">
                    {portfolio.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 shadow-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Projects</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Showcasing my work and technical expertise
        </p>

        {/* Search Bar */}
        {projects.length > 0 && (
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search projects by name, description, or technology..."
            resultCount={searchQuery ? filteredProjects.length : null}
          />
        )}

        {/* Projects List - Alternating Layout */}
        {filteredProjects.length > 0 ? (
          <div className="max-w-6xl mx-auto space-y-12">
            {filteredProjects.map((project, index) => {
              const media = project.media && project.media.length > 0 
                ? project.media 
                : project.image 
                  ? [{ type: 'image', url: project.image, thumbnail: project.image, featured: true }]
                  : [];

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
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors break-words">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed break-words">
                          {getTextPreview(project.description, 250)}
                        </p>

                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech_stack.map((tech, techIndex) => (
                              <TechTag key={techIndex} tech={tech} size="sm" />
                            ))}
                          </div>
                        )}
                      </div>

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
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? `No projects match "${searchQuery}"` : 'Projects will appear here soon.'}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Portfolio powered by MyPorto
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolio;

