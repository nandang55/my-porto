import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FiMail, FiLinkedin, FiTwitter, FiInstagram, FiGlobe, FiMapPin, FiPhone, FiDownload, FiBriefcase, FiClock, FiEye, FiHome, FiGithub } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import ProjectCard from '../components/ProjectCard';
import TechTag from '../components/TechTag';
import SearchBar from '../components/SearchBar';
import TenantNavbar from '../components/TenantNavbar';
import LandingPageRenderer from '../components/LandingPageRenderer';
import { stripHtml } from '../utils/textHelpers';
import { setFavicon, resetFavicon } from '../utils/faviconHelper';

const PublicPortfolio = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [hasLandingPage, setHasLandingPage] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
  }, [slug]);

  useEffect(() => {
    if (portfolio?.user_id) {
      checkLandingPage();
    }
  }, [portfolio]);

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
        setFavicon(portfolio.favicon_url);
      } else {
        resetFavicon();
      }

      // Set page title
      document.title = `${portfolio.name} - Portfolio`;
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
      // Reset favicon and title
      resetFavicon();
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

      // Fetch view counts for all projects
      const projectsWithViews = await Promise.all(
        (projectsData || []).map(async (project) => {
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
      setNotFound(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const checkLandingPage = async () => {
    if (!portfolio?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('user_id', portfolio.user_id)
        .eq('is_active', true)
        .limit(1);

      console.log('Tenant landing page check:', { data, error, userId: portfolio.user_id });

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking tenant landing page:', error);
      }

      setHasLandingPage(data && data.length > 0);
    } catch (error) {
      console.error('Error checking tenant landing page:', error);
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

  // Check if we're on the home route and tenant has a landing page
  const isHomeRoute = location.pathname === `/${slug}`;
  const shouldShowLandingPage = isHomeRoute && hasLandingPage;

  if (shouldShowLandingPage) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Navigation */}
        <TenantNavbar portfolio={portfolio} />
        
        {/* Landing Page Content */}
        <LandingPageRenderer tenantSlug={slug} />
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

          {/* Download CV Button */}
          {portfolio.resume_url && (
            <div className="flex justify-center mb-6">
              <a
                href={portfolio.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <FiDownload size={20} />
                <span>Download CV</span>
              </a>
            </div>
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

        {/* Projects List - Using ProjectCard Component */}
        {filteredProjects.length > 0 ? (
          <div className="max-w-6xl mx-auto space-y-12">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={index}
                showAnimation={true}  // Enable animations for tenant portfolio page
                baseUrl={`/${slug}`} // Use tenant slug as base URL
                showViewDetails={true} // Show View Details button for tenant portfolio
              />
            ))}
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

