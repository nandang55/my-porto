import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import ProjectCard from './ProjectCard';
import BlogCard from './BlogCard';
import { 
  FiTarget, FiBook, FiZap, FiStar, FiPhone, FiMessageSquare,
  FiEdit3, FiTrash2, FiMove, FiEye, FiEyeOff, FiSave, FiPlus, FiMinus,
  FiType, FiImage, FiVideo, FiMusic, FiMapPin, FiCalendar,
  FiMail, FiGlobe, FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FiHeart, FiShare2, FiDownload, FiUpload, FiSettings, FiLayers,
  FiGrid, FiLayout, FiMonitor, FiSmartphone, FiTablet, FiList, FiX,
  FiArrowRight, FiPlay, FiFolder, FiMenu, FiSliders, FiChevronUp, FiChevronDown
} from 'react-icons/fi';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Droppable Area for Canvas
const DroppableArea = ({ children, activeId, draggedComponent }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });


  return (
    <div
      ref={setNodeRef}
      id="canvas-drop-zone"
      className={`min-h-96 transition-all duration-200 ${activeId && draggedComponent ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/50 dark:bg-blue-900/10' : ''} ${isOver ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-opacity-70' : ''}`}
    >
      {children}
    </div>
  );
};

// Draggable Component for Sidebar
const DraggableComponent = ({ component }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: component.type,
    disabled: component.disabled 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : component.disabled ? 0.5 : 1,
  };

  // If component is disabled, don't use drag listeners
  const dragHandlers = component.disabled ? {} : { ...attributes, ...listeners };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...dragHandlers}
      className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 group ${
        component.disabled 
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
          : isDragging 
            ? 'opacity-50 scale-95 shadow-lg border-blue-400 cursor-grabbing' 
            : 'border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-102 hover:shadow-md'
      }`}
      title={component.disabled ? 'Coming soon' : component.description}
    >
      <div className={`w-8 h-8 bg-gradient-to-br ${component.color} rounded flex items-center justify-center text-white transition-all duration-200 flex-shrink-0 ${
        component.disabled 
          ? 'opacity-40' 
          : isDragging 
            ? 'scale-110 shadow-lg' 
            : 'group-hover:scale-105'
      }`}>
        {component.icon}
      </div>
      <div className={`flex-1 min-w-0 ${component.disabled ? 'opacity-50' : ''}`}>
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors duration-200">
          {component.name}
        </div>
        {component.disabled && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Coming soon
          </div>
        )}
      </div>
    </div>
  );
};

// Sortable Component for Canvas
const SortableComponent = ({ component, onEdit, onDelete, onMoveUp, onMoveDown, onRender, previewMode, componentTypes, newlyAddedComponent, isFirst, isLast }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative group transition-all duration-200 ${!previewMode ? 'hover:ring-2 hover:ring-blue-300 hover:shadow-lg' : ''} ${!component.visible ? 'opacity-50' : ''} ${
        isDragging ? 'opacity-60 scale-98 shadow-xl ring-2 ring-blue-400' : ''
      } ${
        newlyAddedComponent === component.id ? 'animate-pulse ring-2 ring-green-400 bg-green-50/50 dark:bg-green-900/20' : ''
      }`}
    >
      {/* Drag Handle - only apply listeners to this area */}
      <div
        {...listeners}
        className="absolute top-0 left-0 right-0 h-8 cursor-grab active:cursor-grabbing z-5 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 dark:bg-blue-900/20"
        title="Drag to reorder"
      >
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>
      
                  {!previewMode && (
                    <>
                      {/* Component Label */}
                      <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {component.name || `${componentTypes.find(ct => ct.type === component.type)?.name || component.type} #${component.order + 1}`}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          {!isFirst && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp(component.id);
                              }}
                              className="p-2 bg-white rounded shadow-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                              title="Move Up"
                            >
                              <FiChevronUp size={14} />
                            </button>
                          )}
                          {!isLast && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown(component.id);
                              }}
                              className="p-2 bg-white rounded shadow-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                              title="Move Down"
                            >
                              <FiChevronDown size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(component);
                            }}
                            className="p-2 bg-white rounded shadow-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(component.id);
                            }}
                            className="p-2 bg-white rounded shadow-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
      
      {onRender(component)}
    </div>
  );
};

const AdvancedLandingPageBuilder = ({ landingPage, onUpdate }) => {
  const alert = useAlert();
  const { user } = useAuth();
  const [userSlug, setUserSlug] = useState('');
  
  // Helper function to get user's slug
  useEffect(() => {
    const fetchUserSlug = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('slug')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user slug:', error);
        }
        
        setUserSlug(data?.slug || '');
      } catch (error) {
        console.error('Error fetching user slug:', error);
      }
    };

    fetchUserSlug();
  }, [user?.id]);


  const [content, setContent] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [newlyAddedComponent, setNewlyAddedComponent] = useState(null);
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const [showComponentsDrawer, setShowComponentsDrawer] = useState(false);
  const [showPropertiesDrawer, setShowPropertiesDrawer] = useState(false);
  
  // Helper function to construct portfolio URL
  const getPortfolioUrl = () => {
    if (userSlug) {
      return `/${userSlug}/projects`;
    }
    
    return '/[your-slug]/projects';
  };
  
  // Drag and Drop states
  const [activeId, setActiveId] = useState(null);
  
  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (landingPage?.content) {
      setContent(landingPage.content);
    }
  }, [landingPage]);

  // Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAvailableProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [user?.id]);

  // Fetch available blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('user_id', user.id)
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Fetch view counts for posts
        const postsWithViews = await Promise.all(
          (data || []).map(async (post) => {
            const { count } = await supabase
              .from('blog_views')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id);
            
            return {
              ...post,
              view_count: count || 0,
            };
          })
        );
        
        setAvailablePosts(postsWithViews);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchPosts();
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProjectDropdown && !event.target.closest('.project-search-container')) {
        setShowProjectDropdown(false);
      }
      if (showPostDropdown && !event.target.closest('.post-search-container')) {
        setShowPostDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProjectDropdown, showPostDropdown]);

  // Keep selectedComponent in sync with content changes
  useEffect(() => {
    if (selectedComponent) {
      const updatedComponent = content.find(comp => comp.id === selectedComponent.id);
      if (updatedComponent && JSON.stringify(updatedComponent) !== JSON.stringify(selectedComponent)) {
        console.log('Syncing selectedComponent with updated content:', updatedComponent);
        setSelectedComponent(updatedComponent);
      }
    }
  }, [content, selectedComponent]);

  // Component reordering functions
  const moveComponentUp = (componentId) => {
    const currentIndex = content.findIndex(c => c.id === componentId);
    if (currentIndex > 0) {
      const newContent = [...content];
      [newContent[currentIndex - 1], newContent[currentIndex]] = [newContent[currentIndex], newContent[currentIndex - 1]];
      // Update order property
      newContent.forEach((comp, idx) => {
        comp.order = idx;
      });
      setContent(newContent);
    }
  };

  const moveComponentDown = (componentId) => {
    const currentIndex = content.findIndex(c => c.id === componentId);
    if (currentIndex < content.length - 1) {
      const newContent = [...content];
      [newContent[currentIndex], newContent[currentIndex + 1]] = [newContent[currentIndex + 1], newContent[currentIndex]];
      // Update order property
      newContent.forEach((comp, idx) => {
        comp.order = idx;
      });
      setContent(newContent);
    }
  };


  const componentTypes = [
    {
      type: 'hero',
      name: 'Hero Section',
      icon: <FiTarget className="text-sm" />,
      description: 'Eye-catching header with title, subtitle, and CTA',
      category: 'Header',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'about',
      name: 'About Section',
      icon: <FiBook className="text-sm" />,
      description: 'Tell your story and introduce yourself',
      category: 'Content',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'services',
      name: 'Services',
      icon: <FiZap className="text-sm" />,
      description: 'Showcase your services and offerings',
      category: 'Content',
      color: 'from-purple-500 to-purple-600'
    },
    {
      type: 'features',
      name: 'Features',
      icon: <FiStar className="text-sm" />,
      description: 'Highlight key features and benefits',
      category: 'Content',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      type: 'portfolio',
      name: 'Portfolio Gallery',
      icon: <FiImage className="text-sm" />,
      description: 'Display your work in a beautiful gallery',
      category: 'Showcase',
      color: 'from-pink-500 to-pink-600'
    },
    {
      type: 'blog',
      name: 'Blog Gallery',
      icon: <FiBook className="text-sm" />,
      description: 'Display your blog posts in a grid',
      category: 'Showcase',
      color: 'from-teal-500 to-teal-600'
    },
    {
      type: 'testimonials',
      name: 'Testimonials',
      icon: <FiMessageSquare className="text-sm" />,
      description: 'Show client feedback and reviews',
      category: 'Social Proof',
      color: 'from-indigo-500 to-indigo-600',
      disabled: true
    },
    {
      type: 'contact',
      name: 'Contact Form',
      icon: <FiPhone className="text-sm" />,
      description: 'Get in touch with your visitors',
      category: 'Contact',
      color: 'from-red-500 to-red-600',
      disabled: true
    },
    {
      type: 'cta',
      name: 'Call to Action',
      icon: <FiTarget className="text-sm" />,
      description: 'Encourage visitors to take action',
      category: 'Conversion',
      color: 'from-orange-500 to-orange-600',
      disabled: true
    },
    {
      type: 'text',
      name: 'Text Block',
      icon: <FiType className="text-sm" />,
      description: 'Add formatted text content',
      category: 'Content',
      color: 'from-gray-500 to-gray-600'
    },
    {
      type: 'image',
      name: 'Image',
      icon: <FiImage className="text-sm" />,
      description: 'Add images and graphics',
      category: 'Media',
      color: 'from-teal-500 to-teal-600',
      disabled: true
    },
    {
      type: 'video',
      name: 'Video',
      icon: <FiVideo className="text-sm" />,
      description: 'Embed videos and media',
      category: 'Media',
      color: 'from-cyan-500 to-cyan-600',
      disabled: true
    },
    {
      type: 'social',
      name: 'Social Links',
      icon: <FiShare2 className="text-sm" />,
      description: 'Connect your social media',
      category: 'Social',
      color: 'from-emerald-500 to-emerald-600',
      disabled: true
    },
    // Layout Components
    {
      type: 'row',
      name: 'Row Layout',
      icon: <FiLayout className="text-sm" />,
      description: 'Horizontal container for organizing content',
      category: 'Layout',
      color: 'from-slate-500 to-slate-600',
      disabled: true
    },
    {
      type: 'column',
      name: 'Column Layout',
      icon: <FiGrid className="text-sm" />,
      description: 'Vertical container for stacking content',
      category: 'Layout',
      color: 'from-zinc-500 to-zinc-600',
      disabled: true
    },
    {
      type: 'list',
      name: 'List',
      icon: <FiList className="text-sm" />,
      description: 'Organized list of items with bullets or numbers',
      category: 'Layout',
      color: 'from-stone-500 to-stone-600',
      disabled: true
    },
    {
      type: 'stack',
      name: 'Stack',
      icon: <FiLayers className="text-sm" />,
      description: 'Stacked content with consistent spacing',
      category: 'Layout',
      color: 'from-neutral-500 to-neutral-600',
      disabled: true
    },
    {
      type: 'parallax',
      name: 'Parallax Section',
      icon: <FiSettings className="text-sm" />,
      description: 'Scroll-triggered parallax effect section',
      category: 'Layout',
      color: 'from-sky-500 to-sky-600',
      disabled: true
    },
    {
      type: 'grid',
      name: 'Grid Layout',
      icon: <FiGrid className="text-sm" />,
      description: 'Responsive grid system for content',
      category: 'Layout',
      color: 'from-violet-500 to-violet-600',
      disabled: true
    },
    {
      type: 'card',
      name: 'Card',
      icon: <FiLayers className="text-sm" />,
      description: 'Card container with shadow and border',
      category: 'Layout',
      color: 'from-fuchsia-500 to-fuchsia-600',
      disabled: true
    },
    {
      type: 'spacer',
      name: 'Spacer',
      icon: <FiMove className="text-sm" />,
      description: 'Add vertical or horizontal spacing',
      category: 'Layout',
      color: 'from-rose-500 to-rose-600'
    }
  ];

  const getDefaultData = (type) => {
    const defaults = {
      hero: {
        title: 'Welcome to Our Website',
        subtitle: 'Create amazing experiences with our platform',
        buttonText: 'Get Started',
        buttonLink: '#',
        buttonBackgroundColor: '#ffffff',
        buttonTextColor: '#667eea',
        backgroundImage: '',
        backgroundColor: '#667eea',
        backgroundType: 'gradient',
        gradientDirection: 'to right',
        gradientStops: ['#667eea', '#764ba2'],
        textColor: '#ffffff'
      },
      about: {
        title: 'About Us',
        content: 'Tell your story here. Describe who you are, what you do, and what makes you unique.',
        image: '',
        backgroundColor: '#ffffff',
        backgroundType: 'solid',
        gradientDirection: 'to right',
        gradientStops: ['#f3f4f6', '#e5e7eb'],
        textColor: '#333333'
      },
      services: {
        title: 'Our Services',
        subtitle: 'What we offer',
        services: [
          { 
            name: 'UX Design', 
            description: 'Crafting seamless user experiences with elegant and intuitive design', 
            logo: '🎨',
            link: '#',
            buttonText: 'View more',
            color: '#10b981'
          },
          { 
            name: 'Branding', 
            description: 'Crafting identity, inspiring connection, your brand\'s unique story', 
            logo: '🎯',
            link: '#',
            buttonText: 'View more',
            color: '#f59e0b'
          },
          { 
            name: '3D Design', 
            description: 'Creating immersive worlds through intricate and innovative designs', 
            logo: '🎮',
            link: '#',
            buttonText: 'View more',
            color: '#3b82f6'
          },
          { 
            name: 'Illustration', 
            description: 'Capturing moments & visual journey through form and emotion', 
            logo: '✏️',
            link: '#',
            buttonText: 'View more',
            color: '#8b5cf6'
          }
        ],
        backgroundColor: '#ffffff',
        textColor: '#333333',
        cardBackgroundColor: '#ffffff',
        buttonBackgroundColor: '#ffffff',
        buttonTextColor: '#333333',
        buttonBorderColor: '#e5e7eb'
      },
      features: {
        title: 'Why Choose Us',
        subtitle: 'Our key features',
        features: [
          { title: 'Feature 1', description: 'Description of feature 1', icon: '✅' },
          { title: 'Feature 2', description: 'Description of feature 2', icon: '🔒' },
          { title: 'Feature 3', description: 'Description of feature 3', icon: '⚡' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#333333'
      },
      portfolio: {
        title: 'Our Work',
        subtitle: 'Portfolio showcase',
        selectedProjectIds: [],  // Changed: store only IDs
        showButton: true,
        buttonText: 'See All Projects',
        buttonLink: getPortfolioUrl(),
        buttonBackgroundColor: '#8b5cf6',
        buttonTextColor: '#ffffff',
        backgroundColor: '#ffffff',
        textColor: '#333333'
      },
      blog: {
        title: 'Latest Blog Posts',
        subtitle: 'Read our thoughts and insights',
        selectedPostIds: [],  // Changed: store only IDs
        showButton: true,
        buttonText: 'View All Posts',
        buttonBackgroundColor: '#14b8a6',
        buttonTextColor: '#ffffff',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        columns: 3
      },
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Client testimonials',
        testimonials: [
          { name: 'John Doe', role: 'CEO', company: 'Company Inc', content: 'Amazing work!' },
          { name: 'Jane Smith', role: 'Designer', company: 'Design Co', content: 'Excellent service!' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#333333'
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Contact us today',
        email: '',
        phone: '',
        address: '',
        backgroundColor: '#f8fafc',
        textColor: '#333333'
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of satisfied customers',
        buttonText: 'Start Now',
        buttonLink: '#',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff'
      },
      text: {
        content: 'Add your text content here. You can format it with HTML tags.',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        fontSize: '16',
        fontWeight: 'normal',
        textAlign: 'left',
        lineHeight: '1.6',
        fontFamily: 'inherit',
        padding: '8'
      },
      image: {
        src: '',
        alt: 'Image description',
        caption: '',
        backgroundColor: 'transparent'
      },
      video: {
        src: '',
        title: 'Video Title',
        description: 'Video description',
        backgroundColor: 'transparent'
      },
      social: {
        title: 'Follow Us',
        links: [
          { platform: 'facebook', url: '', icon: '📘' },
          { platform: 'twitter', url: '', icon: '🐦' },
          { platform: 'instagram', url: '', icon: '📷' },
          { platform: 'linkedin', url: '', icon: '💼' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#333333'
      },
      // Layout Components
      row: {
        title: 'Row Container',
        description: 'Horizontal layout container',
        items: [],
        gap: '4',
        align: 'center',
        justify: 'center',
        backgroundColor: 'transparent',
        padding: '4'
      },
      column: {
        title: 'Column Container',
        description: 'Vertical layout container',
        items: [],
        gap: '4',
        align: 'start',
        backgroundColor: 'transparent',
        padding: '4'
      },
      list: {
        title: 'List',
        description: 'Organized list of items',
        items: [
          'First item',
          'Second item',
          'Third item'
        ],
        type: 'bullet', // bullet, number, none
        backgroundColor: '#ffffff',
        textColor: '#333333'
      },
      stack: {
        title: 'Stack Container',
        description: 'Stacked content with spacing',
        items: [],
        spacing: '4',
        align: 'start',
        backgroundColor: 'transparent',
        padding: '4'
      },
      parallax: {
        title: 'Parallax Section',
        description: 'Scroll-triggered parallax effect',
        backgroundImage: '',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        speed: '0.5',
        content: 'Parallax content here',
        textColor: '#ffffff'
      },
      grid: {
        title: 'Grid Layout',
        description: 'Responsive grid system',
        columns: 3,
        gap: '4',
        items: [],
        backgroundColor: 'transparent',
        padding: '4'
      },
      card: {
        title: 'Card',
        description: 'Card container with shadow',
        content: 'Card content here',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        shadow: 'lg',
        borderRadius: 'lg',
        padding: '6'
      },
      spacer: {
        height: '8',
        backgroundColor: 'transparent',
        type: 'vertical' // vertical, horizontal
      }
    };
    return defaults[type] || {};
  };

  const addComponent = (type) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    
    if (!componentType) {
      console.error('Component type not found:', type);
      return;
    }
    
    const defaultData = getDefaultData(type);
    
    const newComponent = {
      id: `component-${Date.now()}`,
      name: `${componentType?.name || type} ${content.filter(c => c.type === type).length + 1}`,
      type,
      data: defaultData,
      order: content.length,
      visible: true
    };
    
    const newContent = [...content, newComponent];
    
    setContent(newContent);
    setSelectedComponent(newComponent);
    setIsEditing(true);
    
    // Set newly added component for animation
    setNewlyAddedComponent(newComponent.id);
    
    // Clear the animation after 2 seconds
    setTimeout(() => {
      setNewlyAddedComponent(null);
    }, 2000);
    
    // Show success feedback
    alert.success('Component added successfully! 🎉');
  };

  // Drag and Drop handlers
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // If dragging from sidebar (component type)
    const componentType = componentTypes.find(ct => ct.type === active.id);
    if (componentType) {
      setIsDraggingFromSidebar(true);
      setDraggedComponent({
        type: componentType.type,
        name: componentType.name,
        icon: componentType.icon
      });
    } else {
      // If dragging existing component
      setIsDraggingFromSidebar(false);
      const existingComponent = content.find(c => c.id === active.id);
      if (existingComponent) {
        const componentType = componentTypes.find(ct => ct.type === existingComponent.type);
        setDraggedComponent({
          type: existingComponent.type,
          name: componentType?.name || existingComponent.type,
          icon: componentType?.icon || <FiLayout className="text-sm" />
        });
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Check if dragging from sidebar (new component) or reordering existing component
    const isExistingComponent = content.find(c => c.id === active.id);
    const isNewComponent = componentTypes.find(ct => ct.type === active.id);
    const isOverExistingComponent = content.find(c => c.id === over.id);

    // If dropping NEW component from sidebar (can be on canvas-drop-zone OR on existing component)
    if (isNewComponent && !isExistingComponent && over) {
      // Clear drag state immediately to hide overlay
      setActiveId(null);
      setDraggedComponent(null);
      setIsDraggingFromSidebar(false);
      
      // Add component with tiny delay to ensure overlay disappears first
      requestAnimationFrame(() => {
        addComponent(isNewComponent.type);
      });
    } 
    // If reordering existing components
    else if (active.id !== over.id && isExistingComponent && isOverExistingComponent) {
      const oldIndex = content.findIndex(c => c.id === active.id);
      const newIndex = content.findIndex(c => c.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newContent = arrayMove(content, oldIndex, newIndex);
        const updatedContent = newContent.map((component, index) => ({
          ...component,
          order: index
        }));
        setContent(updatedContent);
      }
      
      // Clear drag state
      setActiveId(null);
      setDraggedComponent(null);
      setIsDraggingFromSidebar(false);
    } else {
      // Clear drag state for other cases
      setActiveId(null);
      setDraggedComponent(null);
      setIsDraggingFromSidebar(false);
    }
  };

  const updateComponent = (id, newData) => {
    const newContent = content.map(comp => 
      comp.id === id ? { ...comp, data: { ...comp.data, ...newData } } : comp
    );
    setContent(newContent);
    
    // Update selectedComponent if it's the one being updated
    if (selectedComponent?.id === id) {
      const updatedComponent = newContent.find(comp => comp.id === id);
      if (updatedComponent) {
        setSelectedComponent(updatedComponent);
      }
    }
  };

  // Filter available projects based on search query
  const filteredProjects = availableProjects.filter(project => 
    project.title.toLowerCase().includes(projectSearchQuery.toLowerCase())
  ).filter(project => 
    !selectedComponent?.data?.selectedProjectIds?.includes(project.id)
  );

  // Add project to portfolio (store only ID)
  const addProjectToPortfolio = (project) => {
    if (!selectedComponent || selectedComponent.type !== 'portfolio') return;
    
    const newProjectIds = [...(selectedComponent.data.selectedProjectIds || []), project.id];
    updateComponent(selectedComponent.id, { selectedProjectIds: newProjectIds });
    setProjectSearchQuery('');
    setShowProjectDropdown(false);
  };

  const deleteComponent = (id) => {
    const newContent = content.filter(comp => comp.id !== id);
    setContent(newContent);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
      setIsEditing(false);
    }
  };

  const moveComponent = (fromIndex, toIndex) => {
    const newContent = [...content];
    const [moved] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, moved);
    
    // Update order
    newContent.forEach((comp, index) => {
      comp.order = index;
    });
    
    setContent(newContent);
  };

  const toggleVisibility = (id) => {
    const newContent = content.map(comp => 
      comp.id === id ? { ...comp, visible: !comp.visible } : comp
    );
    setContent(newContent);
  };

  const saveLandingPage = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPage.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (onUpdate) {
        onUpdate({ ...landingPage, content });
      }
      
      alert.success('Landing page saved successfully!');
    } catch (error) {
      console.error('Error saving landing page:', error);
      alert.error('Failed to save landing page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

  const renderComponent = (component) => {
    if (!component.visible) return null;

    const { type, data } = component;
    
    switch (type) {
      case 'hero':
        // Generate background style based on type
        let backgroundStyle = '';
        if (data.backgroundImage) {
          backgroundStyle = `url(${data.backgroundImage}) center/cover`;
        } else if (data.backgroundType === 'gradient' && data.gradientStops) {
          backgroundStyle = `linear-gradient(${data.gradientDirection || 'to right'}, ${data.gradientStops.join(', ')})`;
        } else {
          backgroundStyle = data.backgroundColor || '#667eea';
        }

        return (
          <div 
            className="relative py-20 text-center text-white"
            style={{ 
              background: backgroundStyle,
              color: data.textColor
            }}
          >
            <div className="container mx-auto px-4">
              <h1 className="text-5xl font-bold mb-6">{data.title}</h1>
              <p className="text-xl mb-8 opacity-90">{data.subtitle}</p>
              <a 
                href={data.buttonLink || '#'}
                className="inline-block px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all"
                style={{
                  backgroundColor: data.buttonBackgroundColor || '#ffffff',
                  color: data.buttonTextColor || '#667eea'
                }}
              >
                {data.buttonText}
              </a>
            </div>
          </div>
        );
      
      case 'about':
        // Generate background style based on type
        let aboutBackgroundStyle = '';
        if (data.backgroundType === 'gradient' && data.gradientStops) {
          aboutBackgroundStyle = `linear-gradient(${data.gradientDirection || 'to right'}, ${data.gradientStops.join(', ')})`;
        } else {
          aboutBackgroundStyle = data.backgroundColor || '#ffffff';
        }

        return (
          <div 
            className="py-16"
            style={{ background: aboutBackgroundStyle, color: data.textColor }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-8">{data.title}</h2>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg leading-relaxed">{data.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'services':
        return (
          <section 
            className="py-16 px-4"
            style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
          >
            <div className="container mx-auto">
              {data.title && (
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
                  {data.subtitle && <p className="text-xl opacity-80">{data.subtitle}</p>}
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-6">
                {(data.services || []).map((service, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-80 max-w-sm bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    style={{ backgroundColor: data.cardBackgroundColor || '#ffffff' }}
                  >
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white"
                        style={{ backgroundColor: service.color || getServiceColor(index) }}
                      >
                        {service.logo}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
                      {service.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-center mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Button */}
                    <div className="text-center">
                      <a
                        href={service.link || '#'}
                        className="inline-block px-6 py-2 rounded border text-sm font-medium transition-colors hover:bg-gray-50"
                        style={{ 
                          backgroundColor: data.buttonBackgroundColor || '#ffffff',
                          color: data.buttonTextColor || '#333333',
                          borderColor: data.buttonBorderColor || '#e5e7eb'
                        }}
                      >
                        {service.buttonText || 'View more'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'features':
        let featuresBackgroundStyle = '';
        if (data.backgroundType === 'gradient' && data.gradientStops) {
          featuresBackgroundStyle = `linear-gradient(${data.gradientDirection || 'to right'}, ${data.gradientStops.join(', ')})`;
        } else {
          featuresBackgroundStyle = data.backgroundColor || '#ffffff';
        }

        return (
          <div 
            className="py-16 flex items-center justify-center min-h-[400px]"
            style={{ background: featuresBackgroundStyle, color: data.textColor }}
          >
            <div className="w-full max-w-6xl mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">{data.title}</h2>
              <p className="text-xl text-center mb-12 opacity-80">{data.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-8">
                {data.features?.map((feature, index) => (
                  <div key={index} className="text-center flex flex-col items-center justify-center w-full max-w-xs">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="opacity-80">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div 
            className="py-16"
            style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">{data.title}</h2>
              <p className="text-xl text-center mb-12 opacity-80">{data.subtitle}</p>
              <div className="max-w-md mx-auto">
                <div className="space-y-3">
                  {data.email && <p>📧 {data.email}</p>}
                  {data.phone && <p>📞 {data.phone}</p>}
                  {data.address && <p>📍 {data.address}</p>}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'cta':
        return (
          <div 
            className="py-16 text-center text-white"
            style={{ 
              background: data.backgroundColor,
              color: data.textColor
            }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
              <p className="text-xl mb-8 opacity-90">{data.subtitle}</p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                {data.buttonText}
              </button>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div 
            className={`py-${data.padding || '8'}`}
            style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
          >
            <div className="container mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                style={{
                  fontSize: `${data.fontSize || 16}px`,
                  fontWeight: data.fontWeight || 'normal',
                  textAlign: data.textAlign || 'left',
                  lineHeight: data.lineHeight || '1.6',
                  fontFamily: data.fontFamily || 'inherit',
                  color: data.textColor || '#333333'
                }}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div 
            className="py-8"
            style={{ backgroundColor: data.backgroundColor }}
          >
            <div className="container mx-auto px-4 text-center">
              {data.src && <img src={data.src} alt={data.alt} className="max-w-full h-auto rounded-lg" />}
              {data.caption && <p className="mt-4 text-gray-600">{data.caption}</p>}
            </div>
          </div>
        );
      
      case 'social':
        return (
          <div 
            className="py-16 text-center"
            style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">{data.title}</h2>
              <div className="flex justify-center gap-6">
                {data.links?.map((link, index) => (
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
          </div>
        );

      // Layout Components
      case 'row':
        return (
          <div 
            className={`flex flex-row gap-${data.gap || '4'} items-${data.align || 'center'} justify-${data.justify || 'center'} p-${data.padding || '4'}`}
            style={{ backgroundColor: data.backgroundColor || 'transparent' }}
          >
            {data.items?.map((item, index) => (
              <div key={index} className="flex-1">
                {item}
              </div>
            ))}
          </div>
        );

      case 'column':
        return (
          <div 
            className={`flex flex-col gap-${data.gap || '4'} items-${data.align || 'start'} p-${data.padding || '4'}`}
            style={{ backgroundColor: data.backgroundColor || 'transparent' }}
          >
            {data.items?.map((item, index) => (
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
              backgroundColor: data.backgroundColor || '#ffffff',
              color: data.textColor || '#333333'
            }}
          >
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold mb-4">{data.title || 'List'}</h3>
              <div className={`${data.type === 'number' ? 'list-decimal' : data.type === 'bullet' ? 'list-disc' : 'list-none'} list-inside`}>
                {data.items?.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </div>
            </div>
          </div>
        );

      case 'stack':
        return (
          <div 
            className={`flex flex-col space-y-${data.spacing || '4'} items-${data.align || 'start'} p-${data.padding || '4'}`}
            style={{ backgroundColor: data.backgroundColor || 'transparent' }}
          >
            {data.items?.map((item, index) => (
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
              background: data.backgroundImage ? `url(${data.backgroundImage}) center/cover` : data.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: data.textColor || '#ffffff'
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div 
                className="parallax-content"
                style={{ 
                  transform: `translateY(${window.scrollY * (data.speed || 0.5)}px)`
                }}
              >
                {data.content || 'Parallax content here'}
              </div>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div 
            className={`grid grid-cols-${data.columns || 3} gap-${data.gap || '4'} p-${data.padding || '4'}`}
            style={{ backgroundColor: data.backgroundColor || 'transparent' }}
          >
            {data.items?.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                {item}
              </div>
            ))}
          </div>
        );

      case 'card':
        return (
          <div 
            className={`bg-white dark:bg-gray-800 p-${data.padding || '6'} rounded-${data.borderRadius || 'lg'} shadow-${data.shadow || 'lg'}`}
            style={{ 
              backgroundColor: data.backgroundColor || '#ffffff',
              color: data.textColor || '#333333'
            }}
          >
            <h3 className="text-xl font-bold mb-4">{data.title || 'Card'}</h3>
            <p>{data.content || 'Card content here'}</p>
          </div>
        );

      case 'spacer':
        return (
          <div 
            className={`${data.type === 'horizontal' ? 'w-full' : 'w-full'} bg-transparent`}
            style={{ 
              height: data.type === 'vertical' ? `${data.height || '2'}rem` : '1px',
              width: data.type === 'horizontal' ? `${data.height || '2'}rem` : '100%',
              backgroundColor: data.backgroundColor || 'transparent'
            }}
          />
        );
      
      case 'portfolio':
        // Fetch projects by IDs for preview
        const selectedProjects = data.selectedProjectIds?.map(id => 
          availableProjects.find(p => p.id === id)
        ).filter(Boolean) || [];
        
        return (
          <section 
            className="py-16"
            style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">{data.title}</h2>
              <p className="text-xl text-center mb-12 opacity-80">{data.subtitle}</p>
              
            {/* Portfolio Projects */}
            <div className="max-w-6xl mx-auto space-y-12">
              {selectedProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  index={index}
                  showAnimation={false}
                  baseUrl=""
                  showViewDetails={false}
                />
              ))}
              {selectedProjects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No projects selected. Add projects from the properties panel.
                </div>
              )}
            </div>
            
            {/* See All Button */}
            {data.showButton !== false && (
                <div className="text-center mt-8">
                  <a 
                    href={getPortfolioUrl()}
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: data.buttonBackgroundColor,
                      color: data.buttonTextColor
                    }}
                  >
                    {data.buttonText}
                    <FiArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              )}
            </div>
          </section>
        );

      case 'blog':
        // Fetch posts by IDs for preview
        const selectedBlogPosts = data.selectedPostIds?.map(id => 
          availablePosts.find(p => p.id === id)
        ).filter(Boolean) || [];
        
        return (
          <section 
            className="py-16"
            style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">{data.title}</h2>
              <p className="text-xl text-center mb-12 opacity-80">{data.subtitle}</p>
              
              {/* Blog Posts Grid */}
              {selectedBlogPosts.length > 0 ? (
                <div className={`grid gap-8 ${
                  data.columns === 1 ? 'grid-cols-1' :
                  data.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                  data.columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {selectedBlogPosts.map((post, index) => (
                    <BlogCard 
                      key={post.id}
                      post={post}
                      index={index}
                      baseUrl=""
                      themeColor={data.backgroundColor || '#14b8a6'}
                      showAnimation={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No blog posts selected</h3>
                  <p className="text-gray-500">Add some blog posts from the properties panel.</p>
                </div>
              )}
              
              {/* See All Button */}
              {data.showButton !== false && (
                <div className="text-center mt-8">
                  <a 
                    href={userSlug ? `/${userSlug}/blog` : '/[your-slug]/blog'}
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: data.buttonBackgroundColor,
                      color: data.buttonTextColor
                    }}
                  >
                    {data.buttonText}
                    <FiArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              )}
            </div>
          </section>
        );
      
      default:
        return (
          <div className="py-8 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500">Unknown component type: {type}</p>
          </div>
        );
    }
  };

  const renderEditForm = (component) => {
    const { type, data } = component;
    
    return (
      <div>
        {/* Component Settings */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Component Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Component Name</label>
              <input
                type="text"
                value={component.name || ''}
                onChange={(e) => {
                  const newContent = content.map(comp => 
                    comp.id === component.id ? { ...comp, name: e.target.value } : comp
                  );
                  setContent(newContent);
                  setSelectedComponent({ ...component, name: e.target.value });
                }}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter component name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Component ID</label>
              <input
                type="text"
                value={component.id || ''}
                onChange={(e) => {
                  const newId = e.target.value.trim();
                  if (newId && newId !== component.id) {
                    // Check if ID already exists
                    const existingComponent = content.find(comp => comp.id === newId && comp.id !== component.id);
                    if (!existingComponent) {
                      const newContent = content.map(comp => 
                        comp.id === component.id ? { ...comp, id: newId } : comp
                      );
                      setContent(newContent);
                      setSelectedComponent({ ...component, id: newId });
                    } else {
                      alert.error('ID already exists. Please choose a different ID.');
                    }
                  }
                }}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Enter unique component ID"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
                <span className="text-xs font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {componentTypes.find(c => c.type === type)?.name || type}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Order</label>
                <span className="text-xs font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  #{component.order + 1}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Visibility</label>
              <button
                onClick={() => {
                  const newContent = content.map(comp => 
                    comp.id === component.id ? { ...comp, visible: !comp.visible } : comp
                  );
                  setContent(newContent);
                  setSelectedComponent({ ...component, visible: !component.visible });
                }}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  component.visible 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {component.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>
        
        {type === 'hero' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Text</label>
              <input
                type="text"
                value={data.buttonText || ''}
                onChange={(e) => updateComponent(component.id, { buttonText: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Button Link */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Link</label>
              <input
                type="text"
                value={data.buttonLink || ''}
                onChange={(e) => updateComponent(component.id, { buttonLink: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="#"
              />
            </div>

            {/* Button Colors */}
            <div className="space-y-2">
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Colors</label>
              
              {/* Button Background Color */}
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.buttonBackgroundColor || '#ffffff'}
                    onChange={(e) => updateComponent(component.id, { buttonBackgroundColor: e.target.value })}
                    className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.buttonBackgroundColor || ''}
                    onChange={(e) => updateComponent(component.id, { buttonBackgroundColor: e.target.value })}
                    className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Button Text Color */}
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.buttonTextColor || '#667eea'}
                    onChange={(e) => updateComponent(component.id, { buttonTextColor: e.target.value })}
                    className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.buttonTextColor || ''}
                    onChange={(e) => updateComponent(component.id, { buttonTextColor: e.target.value })}
                    className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#667eea"
                  />
                </div>
              </div>
            </div>
            
            {/* Background Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background</label>
              <div className="space-y-2">
                {/* Background Type Toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateComponent(component.id, { backgroundType: 'solid' })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      (data.backgroundType || 'solid') === 'solid'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    onClick={() => updateComponent(component.id, { backgroundType: 'gradient' })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      data.backgroundType === 'gradient'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Gradient
                  </button>
                </div>

                {/* Solid Color Picker */}
                {(data.backgroundType || 'solid') === 'solid' && (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.backgroundColor || '#ffffff'}
                      onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                      className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.backgroundColor || ''}
                      onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                      className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#ffffff"
                    />
                  </div>
                )}

                {/* Gradient Color Picker */}
                {data.backgroundType === 'gradient' && (
                  <div className="space-y-2">
                    {/* Gradient Direction */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Direction</label>
                      <select
                        value={data.gradientDirection || 'to right'}
                        onChange={(e) => updateComponent(component.id, { gradientDirection: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="to right">→ Right</option>
                        <option value="to left">← Left</option>
                        <option value="to bottom">↓ Bottom</option>
                        <option value="to top">↑ Top</option>
                        <option value="to bottom right">↘ Bottom Right</option>
                        <option value="to bottom left">↙ Bottom Left</option>
                        <option value="to top right">↗ Top Right</option>
                        <option value="to top left">↖ Top Left</option>
                      </select>
                    </div>

                    {/* Color Stops */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Color Stops</label>
                      {(data.gradientStops || ['#667eea', '#764ba2']).map((color, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newStops = [...(data.gradientStops || ['#667eea', '#764ba2'])];
                              newStops[index] = e.target.value;
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newStops = [...(data.gradientStops || ['#667eea', '#764ba2'])];
                              newStops[index] = e.target.value;
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="flex-1 p-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newStops = (data.gradientStops || ['#667eea', '#764ba2']).filter((_, i) => i !== index);
                              if (newStops.length === 0) newStops.push('#667eea');
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            disabled={(data.gradientStops || ['#667eea', '#764ba2']).length <= 1}
                          >
                            <FiMinus size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newStops = [...(data.gradientStops || ['#667eea', '#764ba2']), '#ffffff'];
                          updateComponent(component.id, { gradientStops: newStops });
                        }}
                        className="w-full p-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FiPlus size={12} className="inline mr-1" />
                        Add Color
                      </button>
                    </div>

                    {/* Gradient Preview */}
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Preview</label>
                      <div 
                        className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{
                          background: `linear-gradient(${data.gradientDirection || 'to right'}, ${(data.gradientStops || ['#667eea', '#764ba2']).join(', ')})`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {type === 'about' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={data.content || ''}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                rows={4}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Background Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background</label>
              <div className="space-y-2">
                {/* Background Type Toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateComponent(component.id, { backgroundType: 'solid' })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      (data.backgroundType || 'solid') === 'solid'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    onClick={() => updateComponent(component.id, { backgroundType: 'gradient' })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      data.backgroundType === 'gradient'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Gradient
                  </button>
                </div>

                {/* Solid Color Picker */}
                {(data.backgroundType || 'solid') === 'solid' && (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.backgroundColor || '#ffffff'}
                      onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                      className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.backgroundColor || ''}
                      onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                      className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#ffffff"
                    />
                  </div>
                )}

                {/* Gradient Color Picker */}
                {data.backgroundType === 'gradient' && (
                  <div className="space-y-2">
                    {/* Gradient Direction */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Direction</label>
                      <select
                        value={data.gradientDirection || 'to right'}
                        onChange={(e) => updateComponent(component.id, { gradientDirection: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="to right">→ Right</option>
                        <option value="to left">← Left</option>
                        <option value="to bottom">↓ Bottom</option>
                        <option value="to top">↑ Top</option>
                        <option value="to bottom right">↘ Bottom Right</option>
                        <option value="to bottom left">↙ Bottom Left</option>
                        <option value="to top right">↗ Top Right</option>
                        <option value="to top left">↖ Top Left</option>
                      </select>
                    </div>

                    {/* Color Stops */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Color Stops</label>
                      {(data.gradientStops || ['#f3f4f6', '#e5e7eb']).map((color, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newStops = [...(data.gradientStops || ['#f3f4f6', '#e5e7eb'])];
                              newStops[index] = e.target.value;
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newStops = [...(data.gradientStops || ['#f3f4f6', '#e5e7eb'])];
                              newStops[index] = e.target.value;
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="flex-1 p-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newStops = (data.gradientStops || ['#f3f4f6', '#e5e7eb']).filter((_, i) => i !== index);
                              if (newStops.length === 0) newStops.push('#f3f4f6');
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            disabled={(data.gradientStops || ['#f3f4f6', '#e5e7eb']).length <= 1}
                          >
                            <FiMinus size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newStops = [...(data.gradientStops || ['#f3f4f6', '#e5e7eb']), '#ffffff'];
                          updateComponent(component.id, { gradientStops: newStops });
                        }}
                        className="w-full p-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FiPlus size={12} className="inline mr-1" />
                        Add Color
                      </button>
                    </div>

                    {/* Gradient Preview */}
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Preview</label>
                      <div 
                        className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{
                          background: `linear-gradient(${data.gradientDirection || 'to right'}, ${(data.gradientStops || ['#f3f4f6', '#e5e7eb']).join(', ')})`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {type === 'services' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Services</label>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Add service clicked:', { currentServices: data.services });
                    const newServices = [...(data.services || []), {
                      name: 'New Service',
                      description: 'Service description',
                      logo: '🎯',
                      link: '#',
                      buttonText: 'View more',
                      color: '#10b981'
                    }];
                    console.log('New services after add:', newServices);
                    updateComponent(component.id, { services: newServices });
                  }}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  + Add Service
                </button>
              </div>
              {(data.services || []).map((service, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Service {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Delete service clicked:', { index, services: data.services });
                        if (!data.services || data.services.length === 0) return;
                        const newServices = data.services.filter((_, i) => i !== index);
                        console.log('New services after delete:', newServices);
                        updateComponent(component.id, { services: newServices });
                      }}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Logo/Icon</label>
                        <input
                          type="text"
                          value={service.logo || ''}
                          onChange={(e) => {
                            const newServices = [...data.services];
                            newServices[index] = { ...service, logo: e.target.value };
                            updateComponent(component.id, { services: newServices });
                          }}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="🎨"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                        <input
                          type="text"
                          value={service.name || ''}
                          onChange={(e) => {
                            const newServices = [...data.services];
                            newServices[index] = { ...service, name: e.target.value };
                            updateComponent(component.id, { services: newServices });
                          }}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Service Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Logo Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={service.color || '#10b981'}
                          onChange={(e) => {
                            const newServices = [...data.services];
                            newServices[index] = { ...service, color: e.target.value };
                            updateComponent(component.id, { services: newServices });
                          }}
                          className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={service.color || '#10b981'}
                          onChange={(e) => {
                            const newServices = [...data.services];
                            newServices[index] = { ...service, color: e.target.value };
                            updateComponent(component.id, { services: newServices });
                          }}
                          className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                      <textarea
                        value={service.description || ''}
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index] = { ...service, description: e.target.value };
                          updateComponent(component.id, { services: newServices });
                        }}
                        rows={3}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Service description..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Link URL</label>
                        <input
                          type="text"
                          value={service.link || ''}
                          onChange={(e) => {
                            const newServices = [...data.services];
                            newServices[index] = { ...service, link: e.target.value };
                            updateComponent(component.id, { services: newServices });
                          }}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Button Text</label>
                        <input
                          type="text"
                          value={service.buttonText || ''}
                          onChange={(e) => {
                            const newServices = [...data.services];
                            newServices[index] = { ...service, buttonText: e.target.value };
                            updateComponent(component.id, { services: newServices });
                          }}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="View more"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Background Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.backgroundColor || ''}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Text Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.textColor || '#333333'}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.textColor || ''}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        )}
        
        {type === 'features' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                <button
                  type="button"
                  onClick={() => {
                    const newFeatures = [...(data.features || []), {
                      title: 'New Feature',
                      description: 'Feature description',
                      icon: '✨'
                    }];
                    updateComponent(component.id, { features: newFeatures });
                  }}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  + Add Feature
                </button>
              </div>
              {(data.features || []).map((feature, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Feature {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        if (!data.features || data.features.length === 0) return;
                        const newFeatures = data.features.filter((_, i) => i !== index);
                        updateComponent(component.id, { features: newFeatures });
                      }}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Icon</label>
                        <input
                          type="text"
                          value={feature.icon || ''}
                          onChange={(e) => {
                            const newFeatures = [...data.features];
                            newFeatures[index] = { ...feature, icon: e.target.value };
                            updateComponent(component.id, { features: newFeatures });
                          }}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="✨"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                        <input
                          type="text"
                          value={feature.title || ''}
                          onChange={(e) => {
                            const newFeatures = [...data.features];
                            newFeatures[index] = { ...feature, title: e.target.value };
                            updateComponent(component.id, { features: newFeatures });
                          }}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Feature Title"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                      <textarea
                        value={feature.description || ''}
                        onChange={(e) => {
                          const newFeatures = [...data.features];
                          newFeatures[index] = { ...feature, description: e.target.value };
                          updateComponent(component.id, { features: newFeatures });
                        }}
                        rows={3}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Feature description..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Background Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background</label>
              <div className="space-y-2">
                {/* Background Type Toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateComponent(component.id, { backgroundType: 'solid' })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      (data.backgroundType || 'solid') === 'solid'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    onClick={() => updateComponent(component.id, { backgroundType: 'gradient' })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      data.backgroundType === 'gradient'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Gradient
                  </button>
                </div>

                {/* Solid Color Picker */}
                {(data.backgroundType || 'solid') === 'solid' && (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.backgroundColor || '#ffffff'}
                      onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                      className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.backgroundColor || ''}
                      onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                      className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#ffffff"
                    />
                  </div>
                )}

                {/* Gradient Color Picker */}
                {data.backgroundType === 'gradient' && (
                  <div className="space-y-2">
                    {/* Gradient Direction */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Direction</label>
                      <select
                        value={data.gradientDirection || 'to right'}
                        onChange={(e) => updateComponent(component.id, { gradientDirection: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="to right">→ Right</option>
                        <option value="to left">← Left</option>
                        <option value="to bottom">↓ Bottom</option>
                        <option value="to top">↑ Top</option>
                        <option value="to bottom right">↘ Bottom Right</option>
                        <option value="to bottom left">↙ Bottom Left</option>
                        <option value="to top right">↗ Top Right</option>
                        <option value="to top left">↖ Top Left</option>
                      </select>
                    </div>

                    {/* Color Stops */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Color Stops</label>
                      {(data.gradientStops || ['#ffffff', '#f3f4f6']).map((color, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newStops = [...(data.gradientStops || ['#ffffff', '#f3f4f6'])];
                              newStops[index] = e.target.value;
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newStops = [...(data.gradientStops || ['#ffffff', '#f3f4f6'])];
                              newStops[index] = e.target.value;
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="flex-1 p-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newStops = (data.gradientStops || ['#ffffff', '#f3f4f6']).filter((_, i) => i !== index);
                              if (newStops.length === 0) newStops.push('#ffffff');
                              updateComponent(component.id, { gradientStops: newStops });
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            disabled={(data.gradientStops || ['#ffffff', '#f3f4f6']).length <= 1}
                          >
                            <FiMinus size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newStops = [...(data.gradientStops || ['#ffffff', '#f3f4f6']), '#ffffff'];
                          updateComponent(component.id, { gradientStops: newStops });
                        }}
                        className="w-full p-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FiPlus size={12} className="inline mr-1" />
                        Add Color
                      </button>
                    </div>

                    {/* Gradient Preview */}
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Preview</label>
                      <div 
                        className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{
                          background: `linear-gradient(${data.gradientDirection || 'to right'}, ${(data.gradientStops || ['#ffffff', '#f3f4f6']).join(', ')})`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.textColor || '#333333'}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.textColor || ''}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        )}
        
        {type === 'contact' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={data.email || ''}
                onChange={(e) => updateComponent(component.id, { email: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                value={data.phone || ''}
                onChange={(e) => updateComponent(component.id, { phone: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={data.address || ''}
                onChange={(e) => updateComponent(component.id, { address: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
        
        {type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={data.content || ''}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                rows={6}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="You can use HTML tags for formatting"
              />
            </div>

            {/* Typography Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Font Size (px)</label>
                <input
                  type="number"
                  value={data.fontSize || '16'}
                  onChange={(e) => updateComponent(component.id, { fontSize: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  min="8"
                  max="72"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Font Weight</label>
                <select
                  value={data.fontWeight || 'normal'}
                  onChange={(e) => updateComponent(component.id, { fontWeight: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="100">Thin (100)</option>
                  <option value="200">Extra Light (200)</option>
                  <option value="300">Light (300)</option>
                  <option value="normal">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="bold">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Align</label>
                <select
                  value={data.textAlign || 'left'}
                  onChange={(e) => updateComponent(component.id, { textAlign: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Line Height</label>
                <select
                  value={data.lineHeight || '1.6'}
                  onChange={(e) => updateComponent(component.id, { lineHeight: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 (Tight)</option>
                  <option value="1.2">1.2 (Snug)</option>
                  <option value="1.4">1.4 (Normal)</option>
                  <option value="1.6">1.6 (Relaxed)</option>
                  <option value="1.8">1.8 (Loose)</option>
                  <option value="2">2 (Extra Loose)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Font Family</label>
              <select
                value={data.fontFamily || 'inherit'}
                onChange={(e) => updateComponent(component.id, { fontFamily: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="inherit">Inherit (Default)</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                <option value="Impact, sans-serif">Impact</option>
                <option value="'Lucida Console', Monaco, monospace">Lucida Console</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Padding (py)</label>
              <select
                value={data.padding || '8'}
                onChange={(e) => updateComponent(component.id, { padding: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0">0 (None)</option>
                <option value="2">2 (0.5rem)</option>
                <option value="4">4 (1rem)</option>
                <option value="6">6 (1.5rem)</option>
                <option value="8">8 (2rem)</option>
                <option value="12">12 (3rem)</option>
                <option value="16">16 (4rem)</option>
                <option value="20">20 (5rem)</option>
              </select>
            </div>

            {/* Background Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.backgroundColor || ''}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Text Color Picker */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.textColor || '#333333'}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.textColor || ''}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        )}

        {/* Layout Components Edit Forms */}
        {type === 'row' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Gap</label>
              <select
                value={data.gap || '4'}
                onChange={(e) => updateComponent(component.id, { gap: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 (4px)</option>
                <option value="2">2 (8px)</option>
                <option value="3">3 (12px)</option>
                <option value="4">4 (16px)</option>
                <option value="6">6 (24px)</option>
                <option value="8">8 (32px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Align Items</label>
              <select
                value={data.align || 'center'}
                onChange={(e) => updateComponent(component.id, { align: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Justify Content</label>
              <select
                value={data.justify || 'center'}
                onChange={(e) => updateComponent(component.id, { justify: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space Between</option>
                <option value="around">Space Around</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., #ffffff or transparent"
              />
            </div>
          </div>
        )}

        {type === 'column' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Gap</label>
              <select
                value={data.gap || '4'}
                onChange={(e) => updateComponent(component.id, { gap: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 (4px)</option>
                <option value="2">2 (8px)</option>
                <option value="3">3 (12px)</option>
                <option value="4">4 (16px)</option>
                <option value="6">6 (24px)</option>
                <option value="8">8 (32px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Align Items</label>
              <select
                value={data.align || 'start'}
                onChange={(e) => updateComponent(component.id, { align: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., #ffffff or transparent"
              />
            </div>
          </div>
        )}

        {type === 'list' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">List Type</label>
              <select
                value={data.type || 'bullet'}
                onChange={(e) => updateComponent(component.id, { type: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bullet">Bullet Points</option>
                <option value="number">Numbered</option>
                <option value="none">No Bullets</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">List Items (one per line)</label>
              <textarea
                value={(data.items || []).join('\n')}
                onChange={(e) => updateComponent(component.id, { items: e.target.value.split('\n').filter(item => item.trim()) })}
                rows={6}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="First item&#10;Second item&#10;Third item"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., #ffffff"
              />
            </div>
          </div>
        )}

        {type === 'stack' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Spacing</label>
              <select
                value={data.spacing || '4'}
                onChange={(e) => updateComponent(component.id, { spacing: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 (4px)</option>
                <option value="2">2 (8px)</option>
                <option value="3">3 (12px)</option>
                <option value="4">4 (16px)</option>
                <option value="6">6 (24px)</option>
                <option value="8">8 (32px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Align Items</label>
              <select
                value={data.align || 'start'}
                onChange={(e) => updateComponent(component.id, { align: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., #ffffff or transparent"
              />
            </div>
          </div>
        )}

        {type === 'parallax' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Image URL</label>
              <input
                type="text"
                value={data.backgroundImage || ''}
                onChange={(e) => updateComponent(component.id, { backgroundImage: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color/Gradient</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Parallax Speed</label>
              <select
                value={data.speed || '0.5'}
                onChange={(e) => updateComponent(component.id, { speed: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0.1">Very Slow</option>
                <option value="0.3">Slow</option>
                <option value="0.5">Medium</option>
                <option value="0.7">Fast</option>
                <option value="1.0">Very Fast</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={data.content || ''}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                rows={4}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Parallax content here"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Color</label>
              <input
                type="text"
                value={data.textColor || ''}
                onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="#ffffff"
              />
            </div>
          </div>
        )}

        {type === 'grid' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Columns</label>
              <select
                value={data.columns || 3}
                onChange={(e) => updateComponent(component.id, { columns: parseInt(e.target.value) })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
                <option value={5}>5 Columns</option>
                <option value={6}>6 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Gap</label>
              <select
                value={data.gap || '4'}
                onChange={(e) => updateComponent(component.id, { gap: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 (4px)</option>
                <option value="2">2 (8px)</option>
                <option value="3">3 (12px)</option>
                <option value="4">4 (16px)</option>
                <option value="6">6 (24px)</option>
                <option value="8">8 (32px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., #ffffff or transparent"
              />
            </div>
          </div>
        )}

        {type === 'card' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                value={data.content || ''}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                rows={4}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Card content here"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="#ffffff"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Shadow</label>
              <select
                value={data.shadow || 'lg'}
                onChange={(e) => updateComponent(component.id, { shadow: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2X Large</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Border Radius</label>
              <select
                value={data.borderRadius || 'lg'}
                onChange={(e) => updateComponent(component.id, { borderRadius: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2X Large</option>
                <option value="full">Full (Pill)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Padding</label>
              <select
                value={data.padding || '6'}
                onChange={(e) => updateComponent(component.id, { padding: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2">2 (8px)</option>
                <option value="3">3 (12px)</option>
                <option value="4">4 (16px)</option>
                <option value="6">6 (24px)</option>
                <option value="8">8 (32px)</option>
                <option value="12">12 (48px)</option>
              </select>
            </div>
          </div>
        )}

        {type === 'portfolio' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Our Work"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Portfolio showcase"
              />
            </div>
            
            {/* Selected Projects */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Selected Projects</label>
              
              {/* Add Project Search */}
              <div className="relative mb-3 project-search-container">
                <input
                  type="text"
                  value={projectSearchQuery}
                  onChange={(e) => {
                    setProjectSearchQuery(e.target.value);
                    setShowProjectDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowProjectDropdown(projectSearchQuery.length > 0)}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search and add projects..."
                />
                
                {/* Dropdown Results */}
                {showProjectDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => addProjectToPortfolio(project)}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {project.title}
                          </div>
                          {project.excerpt && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {project.excerpt.substring(0, 60)}...
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                        {projectSearchQuery ? 'No projects found' : 'Start typing to search projects...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Projects List */}
              <div className="space-y-2">
                {data.selectedProjectIds?.map((projectId, index) => {
                  const project = availableProjects.find(p => p.id === projectId);
                  return (
                    <div key={projectId} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center flex-shrink-0">
                          <FiFolder className="text-primary-600 dark:text-primary-400" size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {project?.title || `Project #${projectId}`}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const newProjectIds = data.selectedProjectIds.filter((id) => id !== projectId);
                          updateComponent(component.id, { selectedProjectIds: newProjectIds });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  );
                })}
                {(!data.selectedProjectIds || data.selectedProjectIds.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No projects selected. Search and add projects from your portfolio.</p>
                )}
              </div>
            </div>

            {/* See All Button Settings */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={data.showButton !== false}
                  onChange={(e) => updateComponent(component.id, { showButton: e.target.checked })}
                  className="rounded"
                />
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Show "See All" Button</label>
              </div>
              
              {data.showButton !== false && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Text</label>
                    <input
                      type="text"
                      value={data.buttonText || ''}
                      onChange={(e) => updateComponent(component.id, { buttonText: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="See All Projects"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Link</label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <code className="text-sm text-gray-900 dark:text-white font-mono">
                        {userSlug ? `/${userSlug}/projects` : '/[your-slug]/projects'}
                      </code>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        🔒 Auto-generated link to your projects page
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={data.buttonBackgroundColor || '#8b5cf6'}
                          onChange={(e) => updateComponent(component.id, { buttonBackgroundColor: e.target.value })}
                          className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={data.buttonBackgroundColor || ''}
                          onChange={(e) => updateComponent(component.id, { buttonBackgroundColor: e.target.value })}
                          className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Text Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={data.buttonTextColor || '#ffffff'}
                          onChange={(e) => updateComponent(component.id, { buttonTextColor: e.target.value })}
                          className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={data.buttonTextColor || ''}
                          onChange={(e) => updateComponent(component.id, { buttonTextColor: e.target.value })}
                          className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.backgroundColor || ''}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.textColor || '#333333'}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.textColor || ''}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        )}

        {type === 'blog' && (
          <div className="space-y-4">
            {/* Title & Subtitle */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Latest Blog Posts"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Read our thoughts and insights"
              />
            </div>

            {/* Blog Posts Selection */}
            <div>
              <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">Select Blog Posts</label>
              <div className="post-search-container relative">
                <input
                  type="text"
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  onFocus={() => setShowPostDropdown(true)}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search blog posts to add..."
                />
                
                {showPostDropdown && postSearchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {availablePosts
                      .filter(post => 
                        post.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                        (post.excerpt && post.excerpt.toLowerCase().includes(postSearchQuery.toLowerCase()))
                      )
                      .map(post => (
                        <div
                          key={post.id}
                          onClick={() => {
                            if (!data.selectedPostIds?.includes(post.id)) {
                              const newPostIds = [...(data.selectedPostIds || []), post.id];
                              updateComponent(component.id, { selectedPostIds: newPostIds });
                            }
                            setPostSearchQuery('');
                            setShowPostDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{post.title}</div>
                          {post.excerpt && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.excerpt}</div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              
              {/* Selected Posts */}
              <div className="mt-3 space-y-2">
                {(data.selectedPostIds || []).map((postId) => {
                  const post = availablePosts.find(p => p.id === postId);
                  return (
                    <div key={postId} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center flex-shrink-0">
                        <FiBook className="text-primary-600 dark:text-primary-400" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {post?.title || `Post #${postId}`}
                      </span>
                      <button
                        onClick={() => {
                          const newPostIds = data.selectedPostIds.filter((id) => id !== postId);
                          updateComponent(component.id, { selectedPostIds: newPostIds });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  );
                })}
                {(!data.selectedPostIds || data.selectedPostIds.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No posts selected. Search and add posts from your blog.</p>
                )}
              </div>
            </div>

            {/* Grid Columns */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Grid Columns</label>
              <select
                value={data.columns || 3}
                onChange={(e) => updateComponent(component.id, { columns: parseInt(e.target.value) })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>

            {/* See All Button Settings */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={data.showButton !== false}
                  onChange={(e) => updateComponent(component.id, { showButton: e.target.checked })}
                  className="rounded"
                />
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Show "View All" Button</label>
              </div>
              
              {data.showButton !== false && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Text</label>
                    <input
                      type="text"
                      value={data.buttonText || ''}
                      onChange={(e) => updateComponent(component.id, { buttonText: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="View All Posts"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Link</label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <code className="text-sm text-gray-900 dark:text-white font-mono">
                        {userSlug ? `/${userSlug}/blog` : '/[your-slug]/blog'}
                      </code>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        🔒 Auto-generated link to your blog page
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={data.buttonBackgroundColor || '#14b8a6'}
                          onChange={(e) => updateComponent(component.id, { buttonBackgroundColor: e.target.value })}
                          className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={data.buttonBackgroundColor || ''}
                          onChange={(e) => updateComponent(component.id, { buttonBackgroundColor: e.target.value })}
                          className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#14b8a6"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Button Text Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={data.buttonTextColor || '#ffffff'}
                          onChange={(e) => updateComponent(component.id, { buttonTextColor: e.target.value })}
                          className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={data.buttonTextColor || ''}
                          onChange={(e) => updateComponent(component.id, { buttonTextColor: e.target.value })}
                          className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.backgroundColor || ''}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.textColor || '#333333'}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={data.textColor || ''}
                  onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#333333"
                />
              </div>
            </div>
          </div>
        )}

        {type === 'spacer' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={data.type || 'vertical'}
                onChange={(e) => updateComponent(component.id, { type: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="vertical">Vertical Spacer</option>
                <option value="horizontal">Horizontal Spacer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Height/Width</label>
              <select
                value={data.height || '8'}
                onChange={(e) => updateComponent(component.id, { height: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 (4px)</option>
                <option value="2">2 (8px)</option>
                <option value="4">4 (16px)</option>
                <option value="6">6 (24px)</option>
                <option value="8">8 (32px)</option>
                <option value="12">12 (48px)</option>
                <option value="16">16 (64px)</option>
                <option value="20">20 (80px)</option>
                <option value="24">24 (96px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Background Color</label>
              <input
                type="text"
                value={data.backgroundColor || ''}
                onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="transparent or #ffffff"
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  const groupedComponents = componentTypes.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {});

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null);
        setDraggedComponent(null);
        setIsDraggingFromSidebar(false);
      }}
    >
      <div className="flex h-screen bg-gray-100 dark:bg-gray-700">
      {/* Left Sidebar - Components (Desktop) */}
      {!previewMode && (
        <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Components</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Drag and drop to add components</p>
          </div>
          
          <div className="p-4 space-y-4">
            {Object.entries(groupedComponents).map(([category, components]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-2">
                  {components.map((component) => (
                    <DraggableComponent 
                      key={component.type} 
                      component={component} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Left Drawer - Components (Mobile) */}
      {!previewMode && showComponentsDrawer && (
        <>
          {/* Overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowComponentsDrawer(false)}
          ></div>
          
          {/* Drawer */}
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Drag and drop to add</p>
              </div>
              <button
                onClick={() => setShowComponentsDrawer(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {Object.entries(groupedComponents).map(([category, components]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {components.map((component) => (
                      <DraggableComponent 
                        key={component.type} 
                        component={component} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile: Components Drawer Button */}
            {!previewMode && (
              <button
                onClick={() => setShowComponentsDrawer(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Components"
              >
                <FiMenu size={20} />
              </button>
            )}

            {/* Preview Mode Toggle */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {previewMode ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              <span className="hidden sm:inline">{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
            </button>
            
            {/* Device Icons (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiMonitor size={16} />
              <FiSmartphone size={16} />
              <FiTablet size={16} />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Live/Draft Status Toggle */}
            <button
              onClick={async () => {
                const newStatus = !landingPage.is_active;
                console.log('Current status:', landingPage.is_active, 'New status:', newStatus);
                
                try {
                  const { error } = await supabase
                    .from('landing_pages')
                    .update({ 
                      is_active: newStatus,
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', landingPage.id);

                  if (error) {
                    console.error('Supabase error:', error);
                    throw error;
                  }

                  // Update parent component state
                  const updatedLandingPage = { ...landingPage, is_active: newStatus };
                  if (onUpdate) onUpdate(updatedLandingPage);
                  
                  // Show success message
                  alert.success(`Landing page ${newStatus ? 'published' : 'unpublished'} successfully!`);
                } catch (error) {
                  console.error('Error updating landing page status:', error);
                  alert.error('Failed to update landing page status. Please try again.');
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                landingPage.is_active 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
              title={landingPage.is_active ? 'Click to unpublish' : 'Click to publish'}
            >
              <div className={`w-2 h-2 rounded-full ${landingPage.is_active ? 'bg-white' : 'bg-gray-300'}`}></div>
              {landingPage.is_active ? 'Live' : 'Draft'}
            </button>

            {/* Save Button */}
            <button
              onClick={saveLandingPage}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiSave size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <DroppableArea activeId={activeId} draggedComponent={draggedComponent}>
                          {content.length === 0 ? (
                            <div 
                              className={`text-center py-16 min-h-96 border-2 border-dashed rounded-lg transition-all duration-300 transform ${
                                activeId && draggedComponent 
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg' 
                                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:scale-102'
                              }`}
                            >
                              <FiLayers className={`text-6xl mx-auto mb-4 transition-all duration-300 ${
                                activeId && draggedComponent 
                                  ? 'text-blue-500 dark:text-blue-400 animate-bounce' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`} />
                              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                                activeId && draggedComponent 
                                  ? 'text-blue-700 dark:text-blue-300' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {activeId && draggedComponent ? '🎯 Drop here to add component' : 'Start Building Your Page'}
                              </h3>
                              <p className={`transition-colors duration-300 ${
                                activeId && draggedComponent 
                                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {activeId && draggedComponent ? '✨ Release to add to your page' : 'Drag components from the sidebar to get started'}
                              </p>
                            </div>
              ) : (
                <SortableContext 
                  items={content.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {content
                    .sort((a, b) => a.order - b.order)
                    .map((component, index, array) => (
                      <SortableComponent
                        key={component.id}
                        component={component}
                        onEdit={(component) => {
                          setSelectedComponent(component);
                          setIsEditing(true);
                          // Auto-open properties drawer on mobile
                          if (window.innerWidth < 1024) {
                            setShowPropertiesDrawer(true);
                          }
                        }}
                        onDelete={deleteComponent}
                        onMoveUp={moveComponentUp}
                        onMoveDown={moveComponentDown}
                        onRender={renderComponent}
                        previewMode={previewMode}
                        componentTypes={componentTypes}
                        newlyAddedComponent={newlyAddedComponent}
                        isFirst={index === 0}
                        isLast={index === array.length - 1}
                      />
                    ))}
                  
                              {/* Drop zone at the bottom */}
                              <div 
                                className={`min-h-16 border-2 border-dashed rounded-lg transition-all duration-300 transform ${
                                  activeId && draggedComponent 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-md' 
                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                              >
                                <div className={`text-center py-4 transition-all duration-300 ${
                                  activeId && draggedComponent 
                                    ? 'text-blue-600 dark:text-blue-400 font-medium animate-pulse' 
                                    : 'text-transparent'
                                }`}>
                                  📍 Drop here to add component
                                </div>
                              </div>
                </SortableContext>
              )}
            </DroppableArea>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Editor (Desktop) */}
      {!previewMode && selectedComponent && isEditing && (
        <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-600 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Properties</h3>
              <button
                onClick={() => {
                  setSelectedComponent(null);
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {renderEditForm(selectedComponent)}
            </div>
          </div>
        </div>
      )}

      {/* Right Drawer - Editor (Mobile) */}
      {!previewMode && selectedComponent && isEditing && (
        <>
          {/* Mobile: Show drawer button when properties panel should be visible */}
          <button
            onClick={() => setShowPropertiesDrawer(true)}
            className="lg:hidden fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-30"
            title="Properties"
          >
            <FiSliders size={24} />
          </button>

          {/* Properties Drawer */}
          {showPropertiesDrawer && (
            <>
              {/* Overlay */}
              <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowPropertiesDrawer(false)}
              ></div>
              
              {/* Drawer */}
              <div className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 overflow-y-auto">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Properties</h3>
                    <button
                      onClick={() => setShowPropertiesDrawer(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {renderEditForm(selectedComponent)}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && draggedComponent ? (
            <div className={`flex items-center gap-3 p-3 border-2 rounded-lg bg-white dark:bg-gray-800 shadow-2xl opacity-95 transform ${
              isDraggingFromSidebar 
                ? 'border-green-500 dark:border-green-400 scale-105 rotate-1' 
                : 'border-blue-500 dark:border-blue-400 scale-110'
            }`}>
              <div className={`w-8 h-8 bg-gradient-to-br ${componentTypes.find(ct => ct.type === draggedComponent.type)?.color || 'from-gray-500 to-gray-600'} rounded flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
                {draggedComponent.icon}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {draggedComponent.name}
              </div>
              {isDraggingFromSidebar && (
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  ✨ New
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
    </DndContext>
  );
};

export default AdvancedLandingPageBuilder;
