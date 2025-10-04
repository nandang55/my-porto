import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowLeft, FiExternalLink, FiGithub, FiEye, FiUser } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import TenantNavbar from '../components/TenantNavbar';
import MediaGallery from '../components/MediaGallery';
import TechTag from '../components/TechTag';
import { setFavicon, resetFavicon } from '../utils/faviconHelper';
import { stripHtml } from '../utils/textHelpers';

const TenantProjectDetail = () => {
  const { slug, projectSlug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    fetchData();

    return () => {
      resetFavicon();
      document.title = 'BagdjaPorto';
    };
  }, [slug, projectSlug]);

  const fetchData = async () => {
    try {
      // Fetch portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (portfolioError) throw portfolioError;
      setPortfolio(portfolioData);

      // Set favicon and title
      if (portfolioData.favicon_url) {
        setFavicon(portfolioData.favicon_url);
      } else {
        resetFavicon();
      }

      // Fetch project by slug
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', projectSlug)
        .eq('user_id', portfolioData.user_id)
        .eq('published', true)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Set page title
      document.title = `${projectData.title} - ${portfolioData.name}`;

      // Record page view
      await recordPageView(projectData.id);

      // Fetch view count
      await fetchViewCount(projectData.id);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const recordPageView = async (projectId) => {
    try {
      // Get user agent and referrer
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;

      console.log('Recording project view for:', projectId);

      // Insert view log
      const { data, error } = await supabase
        .from('project_views')
        .insert([
          {
            project_id: projectId,
            user_agent: userAgent,
            referrer: referrer || null,
          },
        ]);

      if (error) {
        console.error('Error inserting project view:', error);
      } else {
        console.log('Project view recorded successfully:', data);
      }
    } catch (error) {
      console.error('Error recording project view:', error);
    }
  };

  const fetchViewCount = async (projectId) => {
    try {
      const { count, error } = await supabase
        .from('project_views')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      if (error) throw error;
      setViewCount(count || 0);
    } catch (error) {
      console.error('Error fetching project view count:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!portfolio || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Project not found or not published.</p>
        <Link to={`/${slug}`} className="btn-primary">
          <FiArrowLeft className="mr-2" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TenantNavbar portfolio={portfolio} />

      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: project.featured_media
            ? `url('${project.featured_media}')`
            : `linear-gradient(135deg, ${portfolio.theme_color || '#0284c7'} 0%, ${portfolio.secondary_color || '#6366f1'} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${portfolio.theme_color || '#0284c7'}CC 0%, ${portfolio.secondary_color || '#6366f1'}CC 100%)`
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Link to={`/${slug}`} className="inline-flex items-center text-lg mb-4 hover:underline">
              <FiArrowLeft className="mr-2" /> Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl opacity-90 mb-6">{project.excerpt || stripHtml(project.description)}</p>
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>{formatDate(project.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye />
                <span>{viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Project Info */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Media Gallery */}
            {project.media && project.media.length > 0 && (
              <div className="mb-12">
                <MediaGallery media={project.media} featuredMedia={project.featured_media} />
              </div>
            )}

            {/* Excerpt */}
            {project.excerpt && (
              <div className="mb-12">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4" style={{ borderLeftColor: portfolio.theme_color || '#0284c7' }}>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.excerpt}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: project.description }} />
            </div>

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-primary-600">🛠️</span>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, index) => (
                    <TechTag key={index} tech={tech} size="lg" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Project Actions */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <FiExternalLink size={18} />
                      View Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors font-medium"
                    >
                      <FiGithub size={18} />
                      View Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Views:</span>
                    <span>{viewCount.toLocaleString()}</span>
                  </div>
                  {project.order && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                      <span>#{project.order}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiUser />
                  About the Developer
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  {portfolio.avatar_url && (
                    <img
                      src={portfolio.avatar_url}
                      alt={portfolio.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold">{portfolio.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{portfolio.title}</p>
                  </div>
                </div>
                {portfolio.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{portfolio.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TenantProjectDetail;
