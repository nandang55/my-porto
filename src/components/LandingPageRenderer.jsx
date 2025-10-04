import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { 
  FiTarget, FiBook, FiZap, FiStar, FiPhone, FiMessageSquare,
  FiType, FiImage, FiVideo, FiShare2, FiArrowRight
} from 'react-icons/fi';
import ProjectCard from './ProjectCard';
import BlogCard from './BlogCard';

const LandingPageRenderer = ({ userId = null, tenantSlug = null }) => {
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandingPage();
  }, [userId, tenantSlug]);

  const getServiceColor = (index) => {
    const colors = [
      '#10b981', // Green
      '#f59e0b', // Orange  
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#ef4444', // Red
      '#06b6d4'  // Cyan
    ];
    return colors[Math.abs(index) % colors.length];
  };

  const fetchLandingPage = async () => {
    try {
      let query = supabase
        .from('landing_pages')
        .select('*')
        .eq('is_active', true);

      // If tenantSlug is provided, get user_id from portfolios table first
      if (tenantSlug) {
        const { data: portfolio } = await supabase
          .from('portfolios')
          .select('user_id')
          .eq('slug', tenantSlug)
          .single();
        
        if (portfolio) {
          query = query.eq('user_id', portfolio.user_id);
        } else {
          setLandingPage(null);
          setLoading(false);
          return;
        }
      } else if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      console.log('LandingPageRenderer fetch result:', { data, error, tenantSlug, userId });

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching landing page:', error);
      }

      setLandingPage(data || null);
    } catch (error) {
      console.error('Error fetching landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!landingPage || !landingPage.content || landingPage.content.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Landing Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            No active landing page available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {landingPage.content
        .sort((a, b) => a.order - b.order)
        .map((component, index) => (
          <ComponentRenderer
            key={component.id || index}
            component={component}
            tenantSlug={tenantSlug}
          />
        ))}
    </div>
  );
};

// Component Renderer for each component type
const ComponentRenderer = ({ component, tenantSlug }) => {
  if (!component.visible) return null;

  switch (component.type) {
    case 'hero':
      // Generate background style based on type
      let heroBackgroundStyle = '';
      if (component.data?.backgroundImage) {
        heroBackgroundStyle = `url(${component.data.backgroundImage}) center/cover`;
      } else if (component.data?.backgroundType === 'gradient' && component.data?.gradientStops) {
        heroBackgroundStyle = `linear-gradient(${component.data.gradientDirection || 'to right'}, ${component.data.gradientStops.join(', ')})`;
      } else {
        heroBackgroundStyle = component.data?.backgroundColor || '#3b82f6';
      }

      return (
        <section 
          className="relative py-20 text-center text-white overflow-hidden"
          style={{ 
            background: heroBackgroundStyle,
            color: component.data?.textColor || '#ffffff'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {component.data?.title || 'Welcome to Our Website'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {component.data?.subtitle || 'Create amazing experiences with our platform'}
              </p>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                {component.data?.buttonText || 'Get Started'}
              </button>
            </div>
          </div>
        </section>
      );

    case 'about':
      // Generate background style based on type
      let aboutBackgroundStyle = '';
      if (component.data?.backgroundType === 'gradient' && component.data?.gradientStops) {
        aboutBackgroundStyle = `linear-gradient(${component.data.gradientDirection || 'to right'}, ${component.data.gradientStops.join(', ')})`;
      } else {
        aboutBackgroundStyle = component.data?.backgroundColor || '#ffffff';
      }

      return (
        <section 
          className="py-16"
          style={{ 
            background: aboutBackgroundStyle,
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">{component.data?.title || 'About Us'}</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg leading-relaxed">{component.data?.content || 'Tell your story here.'}</p>
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section 
          className="py-16 px-4"
          style={{ backgroundColor: component.data?.backgroundColor || '#ffffff', color: component.data?.textColor || '#333333' }}
        >
          <div className="container mx-auto">
            {component.data?.title && (
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">{component.data.title}</h2>
                {component.data.subtitle && <p className="text-xl opacity-80">{component.data.subtitle}</p>}
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-6">
              {(component.data?.services || []).map((service, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-80 max-w-sm bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  style={{ backgroundColor: component.data?.cardBackgroundColor || '#ffffff' }}
                >
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white"
                      style={{ backgroundColor: service.color || getServiceColor(index) }}
                    >
                      {service.logo || service.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
                    {service.name || service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Button */}
                  {service.link && (
                    <div className="text-center">
                      <a
                        href={service.link || '#'}
                        className="inline-block px-6 py-2 rounded border text-sm font-medium transition-colors hover:bg-gray-50"
                        style={{ 
                          backgroundColor: component.data?.buttonBackgroundColor || '#ffffff',
                          color: component.data?.buttonTextColor || '#333333',
                          borderColor: component.data?.buttonBorderColor || '#e5e7eb'
                        }}
                      >
                        {service.buttonText || 'View more'}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'features':
      let featuresBackgroundStyle = '';
      if (component.data?.backgroundType === 'gradient' && component.data?.gradientStops) {
        featuresBackgroundStyle = `linear-gradient(${component.data.gradientDirection || 'to right'}, ${component.data.gradientStops.join(', ')})`;
      } else {
        featuresBackgroundStyle = component.data?.backgroundColor || '#ffffff';
      }

      return (
        <section 
          className="py-16 flex items-center justify-center min-h-[400px]"
          style={{ 
            background: featuresBackgroundStyle,
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="w-full max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{component.data?.title || 'Why Choose Us'}</h2>
            <p className="text-xl text-center mb-12 opacity-80">{component.data?.subtitle || 'Our key features'}</p>
            <div className="flex flex-wrap justify-center gap-8">
              {(component.data?.features || []).map((feature, index) => (
                <div key={index} className="text-center flex flex-col items-center justify-center w-full max-w-xs">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'portfolio':
      return (
        <section 
          className="py-16"
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{component.data?.title || 'Our Work'}</h2>
            <p className="text-xl text-center mb-12 opacity-80">{component.data?.subtitle || 'Portfolio showcase'}</p>
            
        {/* Portfolio Projects */}
        <div className="max-w-6xl mx-auto space-y-12">
          {(component.data?.selectedProjects || []).map((project, index) => (
            <ProjectCard 
              key={project.id || index}
              project={project}
              index={index}
              showAnimation={false}
              baseUrl={tenantSlug ? `/${tenantSlug}` : ''}
              showViewDetails={true}
            />
          ))}
        </div>
          
          {/* See All Button */}
          {component.data?.showButton !== false && (
            <div className="text-center mt-8">
              <a 
                href={tenantSlug ? `/${tenantSlug}/projects` : component.data?.buttonLink}
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: component.data?.buttonBackgroundColor,
                  color: component.data?.buttonTextColor
                }}
              >
                {component.data?.buttonText}
                <FiArrowRight className="ml-2" size={16} />
              </a>
            </div>
          )}
        </div>
      </section>
    );

    case 'blog':
      return (
        <section 
          className="py-16"
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{component.data?.title || 'Latest Blog Posts'}</h2>
            <p className="text-xl text-center mb-12 opacity-80">{component.data?.subtitle || 'Read our thoughts and insights'}</p>
            
            {/* Blog Posts Grid */}
            {component.data?.selectedPosts && component.data.selectedPosts.length > 0 ? (
              <div className={`grid gap-8 ${
                component.data.columns === 1 ? 'grid-cols-1' :
                component.data.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                component.data.columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {(component.data.selectedPosts || []).map((post, index) => (
                  <BlogCard 
                    key={post.id || index}
                    post={post}
                    index={index}
                    baseUrl={tenantSlug ? `/${tenantSlug}` : ''}
                    themeColor={component.data?.backgroundColor || '#14b8a6'}
                    showAnimation={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-20">📝</div>
                <h3 className="text-xl font-semibold mb-2">No blog posts selected</h3>
                <p className="text-gray-500">Add some blog posts to display here.</p>
              </div>
            )}
            
            {/* See All Button */}
            {component.data?.showButton !== false && (
              <div className="text-center mt-8">
                <a 
                  href={tenantSlug ? `/${tenantSlug}/blog` : component.data?.buttonLink}
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ 
                    backgroundColor: component.data?.buttonBackgroundColor,
                    color: component.data?.buttonTextColor
                  }}
                >
                  {component.data?.buttonText}
                  <FiArrowRight className="ml-2" size={16} />
                </a>
              </div>
            )}
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section 
          className="py-16"
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{component.data?.title || 'What Our Clients Say'}</h2>
            <p className="text-xl text-center mb-12 opacity-80">{component.data?.subtitle || 'Client testimonials'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(component.data?.testimonials || []).map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                  <p className="text-lg mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section 
          className="py-16"
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#f8fafc',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{component.data?.title || 'Get In Touch'}</h2>
            <p className="text-xl text-center mb-12 opacity-80">{component.data?.subtitle || 'Contact us today'}</p>
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                {component.data?.email && <p>📧 {component.data.email}</p>}
                {component.data?.phone && <p>📞 {component.data.phone}</p>}
                {component.data?.address && <p>📍 {component.data.address}</p>}
              </div>
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section 
          className="py-16 text-center text-white"
          style={{ 
            background: component.data?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: component.data?.textColor || '#ffffff'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4">{component.data?.title || 'Ready to Get Started?'}</h2>
            <p className="text-xl mb-8 opacity-90">{component.data?.subtitle || 'Join thousands of satisfied customers'}</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              {component.data?.buttonText || 'Start Now'}
            </button>
          </div>
        </section>
      );

    case 'text':
      return (
        <section 
          className={`py-${component.data?.padding || '8'}`}
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <div 
              className="prose prose-lg max-w-none"
              style={{
                fontSize: `${component.data?.fontSize || 16}px`,
                fontWeight: component.data?.fontWeight || 'normal',
                textAlign: component.data?.textAlign || 'left',
                lineHeight: component.data?.lineHeight || '1.6',
                fontFamily: component.data?.fontFamily || 'inherit',
                color: component.data?.textColor || '#333333'
              }}
              dangerouslySetInnerHTML={{ __html: component.data?.content || '' }}
            />
          </div>
        </section>
      );

    case 'image':
      return (
        <section 
          className="py-8"
          style={{ backgroundColor: component.data?.backgroundColor || 'transparent' }}
        >
          <div className="container mx-auto px-4 text-center">
            {component.data?.src && <img src={component.data.src} alt={component.data.alt} className="max-w-full h-auto rounded-lg" />}
            {component.data?.caption && <p className="mt-4 text-gray-600">{component.data.caption}</p>}
          </div>
        </section>
      );

    case 'video':
      return (
        <section 
          className="py-8"
          style={{ backgroundColor: component.data?.backgroundColor || 'transparent' }}
        >
          <div className="container mx-auto px-4 text-center">
            {component.data?.src && (
              <video controls className="max-w-full h-auto rounded-lg">
                <source src={component.data.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {component.data?.title && <h3 className="text-xl font-semibold mt-4">{component.data.title}</h3>}
            {component.data?.description && <p className="text-gray-600 mt-2">{component.data.description}</p>}
          </div>
        </section>
      );

    case 'social':
      return (
        <section 
          className="py-16 text-center"
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">{component.data?.title || 'Follow Us'}</h2>
            <div className="flex justify-center gap-6">
              {(component.data?.links || []).map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-4xl hover:scale-110 transition-transform"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </section>
      );

    // Layout Components
    case 'row':
      return (
        <div 
          className={`flex flex-row gap-${component.data?.gap || '4'} items-${component.data?.align || 'center'} justify-${component.data?.justify || 'center'} p-${component.data?.padding || '4'}`}
          style={{ backgroundColor: component.data?.backgroundColor || 'transparent' }}
        >
          {component.data?.items?.map((item, index) => (
            <div key={index} className="flex-1">
              {item}
            </div>
          ))}
        </div>
      );

    case 'column':
      return (
        <div 
          className={`flex flex-col gap-${component.data?.gap || '4'} items-${component.data?.align || 'start'} p-${component.data?.padding || '4'}`}
          style={{ backgroundColor: component.data?.backgroundColor || 'transparent' }}
        >
          {component.data?.items?.map((item, index) => (
            <div key={index}>
              {item}
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div 
          className="py-8"
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-4">{component.data?.title || 'List'}</h3>
            <div className={`${component.data?.type === 'number' ? 'list-decimal' : component.data?.type === 'bullet' ? 'list-disc' : 'list-none'} list-inside`}>
              {(component.data?.items || []).map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </div>
          </div>
        </div>
      );

    case 'stack':
      return (
        <div 
          className={`flex flex-col space-y-${component.data?.spacing || '4'} items-${component.data?.align || 'start'} p-${component.data?.padding || '4'}`}
          style={{ backgroundColor: component.data?.backgroundColor || 'transparent' }}
        >
          {component.data?.items?.map((item, index) => (
            <div key={index}>
              {item}
            </div>
          ))}
        </div>
      );

    case 'parallax':
      return (
        <div 
          className="parallax-section relative py-20 text-center overflow-hidden"
          style={{ 
            background: component.data?.backgroundImage ? `url(${component.data.backgroundImage}) center/cover` : component.data?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: component.data?.textColor || '#ffffff'
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div 
              className="parallax-content"
              style={{ 
                transform: `translateY(${window.scrollY * (component.data?.speed || 0.5)}px)`
              }}
            >
              {component.data?.content || 'Parallax content here'}
            </div>
          </div>
        </div>
      );

    case 'grid':
      return (
        <div 
          className={`grid grid-cols-${component.data?.columns || 3} gap-${component.data?.gap || '4'} p-${component.data?.padding || '4'}`}
          style={{ backgroundColor: component.data?.backgroundColor || 'transparent' }}
        >
          {component.data?.items?.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              {item}
            </div>
          ))}
        </div>
      );

    case 'card':
      return (
        <div 
          className={`bg-white dark:bg-gray-800 p-${component.data?.padding || '6'} rounded-${component.data?.borderRadius || 'lg'} shadow-${component.data?.shadow || 'lg'}`}
          style={{ 
            backgroundColor: component.data?.backgroundColor || '#ffffff',
            color: component.data?.textColor || '#333333'
          }}
        >
          <h3 className="text-xl font-bold mb-4">{component.data?.title || 'Card'}</h3>
          <p>{component.data?.content || 'Card content here'}</p>
        </div>
      );

    case 'spacer':
      return (
        <div 
          className={`${component.data?.type === 'horizontal' ? 'w-full' : 'w-full'} bg-transparent`}
          style={{ 
            height: component.data?.type === 'vertical' ? `${component.data?.height || '2'}rem` : '1px',
            width: component.data?.type === 'horizontal' ? `${component.data?.height || '2'}rem` : '100%',
            backgroundColor: component.data?.backgroundColor || 'transparent'
          }}
        />
      );

    default:
      return (
        <div className="py-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">Unknown component type: {component.type}</p>
        </div>
      );
  }
};

export default LandingPageRenderer;