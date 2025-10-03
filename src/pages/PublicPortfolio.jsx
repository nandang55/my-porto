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

  // Apply theme colors as CSS variables
  useEffect(() => {
    if (portfolio) {
      // Set all theme colors
      document.documentElement.style.setProperty('--theme-primary', portfolio.theme_color || '#0284c7');
      document.documentElement.style.setProperty('--theme-secondary', portfolio.secondary_color || '#6366f1');
      document.documentElement.style.setProperty('--theme-accent', portfolio.accent_color || '#f59e0b');
      document.documentElement.style.setProperty('--theme-text-primary', portfolio.text_primary || '#1f2937');
      document.documentElement.style.setProperty('--theme-text-secondary', portfolio.text_secondary || '#6b7280');
      document.documentElement.style.setProperty('--theme-bg-light', portfolio.bg_light || '#ffffff');
      document.documentElement.style.setProperty('--theme-bg-dark', portfolio.bg_dark || '#111827');
      
      // Set favicon dynamically
      if (portfolio.favicon_url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = portfolio.favicon_url;
      }

      // Set page title
      document.title = portfolio.meta_title || `${portfolio.name} - Portfolio`;
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.style.removeProperty('--theme-primary');
      document.documentElement.style.removeProperty('--theme-secondary');
      document.documentElement.style.removeProperty('--theme-accent');
      document.documentElement.style.removeProperty('--theme-text-primary');
      document.documentElement.style.removeProperty('--theme-text-secondary');
      document.documentElement.style.removeProperty('--theme-bg-light');
      document.documentElement.style.removeProperty('--theme-bg-dark');
      // Reset title
      document.title = 'BagdjaPorto';
    };
  }, [portfolio]);

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
      <section 
        className="relative text-white py-20 overflow-hidden"
        style={{
          background: portfolio.cover_image 
            ? `url('${portfolio.cover_image}')` 
            : `linear-gradient(to bottom right, ${portfolio.theme_color || '#0284c7'}, ${portfolio.theme_color || '#0284c7'}dd, ${portfolio.theme_color || '#0284c7'}bb)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for cover image */}
        {portfolio.cover_image && (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom right, ${portfolio.theme_color || '#0284c7'}ee, ${portfolio.theme_color || '#0284c7'}cc, ${portfolio.theme_color || '#0284c7'}aa)`
            }}
          ></div>
        )}
        
        <div className="relative z-10">
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
              <span 
                className="px-4 py-2 rounded-full font-medium text-sm text-white border"
                style={{
                  backgroundColor: portfolio.availability_status === 'available' 
                    ? `${portfolio.accent_color || '#f59e0b'}40`
                    : '#fbbf2440',
                  borderColor: portfolio.availability_status === 'available'
                    ? portfolio.accent_color || '#f59e0b'
                    : '#fbbf24'
                }}
              >
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
        </div>
      </section>

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
                        <div 
                          className="h-full min-h-[300px] flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to bottom right, ${portfolio.theme_color || '#0284c7'}, ${portfolio.theme_color || '#0284c7'}dd)`
                          }}
                        >
                          <span className="text-white text-6xl opacity-20">📁</span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 md:p-8 flex flex-col justify-between ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                      <div className="min-w-0">
                        <h3 
                          className="text-2xl md:text-3xl font-bold mb-4 transition-colors break-words"
                          style={{
                            '--hover-color': portfolio.theme_color || '#0284c7'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = portfolio.theme_color || '#0284c7'}
                          onMouseLeave={(e) => e.currentTarget.style.color = ''}
                        >
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
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 text-white rounded-xl transition-all hover:scale-105 font-medium shadow-lg"
                            style={{
                              backgroundColor: portfolio.theme_color || '#0284c7'
                            }}
                            onMouseEnter={(e) => {
                              const color = portfolio.theme_color || '#0284c7';
                              const hex = color.replace('#', '');
                              const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 20);
                              const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 20);
                              const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 20);
                              e.currentTarget.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = portfolio.theme_color || '#0284c7';
                            }}
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
      <footer className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          {/* Skills & Expertise */}
          {(portfolio.skills?.length > 0 || portfolio.languages?.length > 0) && (
            <div className="max-w-6xl mx-auto mb-16">
              {/* Header */}
              <div className="text-center mb-12">
                <div 
                  className="inline-block px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor: `${portfolio.accent_color || '#f59e0b'}30`
                  }}
                >
                  <span 
                    className="text-sm font-semibold"
                    style={{
                      color: portfolio.accent_color || '#f59e0b'
                    }}
                  >
                    🎯 MY EXPERTISE
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Skills & Technologies
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  A collection of tools and technologies I work with to bring ideas to life
                </p>
              </div>
              
              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Technical Skills */}
                {portfolio.skills && portfolio.skills.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(to bottom right, ${portfolio.theme_color || '#0284c7'}, ${portfolio.secondary_color || '#6366f1'})`
                        }}
                      >
                        <span className="text-2xl">💻</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Technical Skills</h4>
                        <p className="text-sm text-gray-400">{portfolio.skills.length} technologies</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.map((skill, index) => (
                        <TechTag key={index} tech={skill} size="md" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {portfolio.languages && portfolio.languages.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(to bottom right, ${portfolio.secondary_color || '#6366f1'}, ${portfolio.accent_color || '#f59e0b'})`
                        }}
                      >
                        <span className="text-2xl">🌍</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Languages</h4>
                        <p className="text-sm text-gray-400">{portfolio.languages.length} languages</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {portfolio.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg font-medium text-white shadow-sm border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Single column for when only one category exists */}
              {((portfolio.skills?.length > 0 && !portfolio.languages?.length) || 
                (!portfolio.skills?.length && portfolio.languages?.length > 0)) && (
                <div className="md:col-span-2"></div>
              )}
            </div>
          )}

          {/* Copyright */}
          <div className="text-center border-t border-white/10 pt-8">
            <div className="flex justify-center gap-6 mb-6">
              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiGithub size={20} />
                </a>
              )}
              {portfolio.linkedin_url && (
                <a
                  href={portfolio.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiLinkedin size={20} />
                </a>
              )}
              {portfolio.twitter_url && (
                <a
                  href={portfolio.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiTwitter size={20} />
                </a>
              )}
              {portfolio.email && (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiMail size={20} />
                </a>
              )}
            </div>
            <p className="text-gray-400 mb-2">
              © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with ❤️ using BagdjaPorto
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolio;

