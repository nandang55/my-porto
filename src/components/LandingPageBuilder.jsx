import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit3, FiEye, FiSave, FiCopy, FiMove } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import AdminNavbar from './AdminNavbar';
import BackButton from './BackButton';

// Component definitions for the builder
const COMPONENT_TYPES = {
  hero: {
    name: 'Hero Section',
    icon: '🎯',
    defaultData: {
      title: 'Welcome to Our Website',
      subtitle: 'Create amazing experiences with our platform',
      buttonText: 'Get Started',
      buttonUrl: '#',
      backgroundImage: '',
      backgroundColor: '#3b82f6'
    }
  },
  about: {
    name: 'About Section',
    icon: '📖',
    defaultData: {
      title: 'About Us',
      content: 'Tell your story and showcase what makes you unique. This is where you can share your mission, values, and what drives your business.',
      image: '',
      alignment: 'left'
    }
  },
  services: {
    name: 'Services Section',
    icon: '⚡',
    defaultData: {
      title: 'Our Services',
      subtitle: 'What we offer',
      services: [
        { title: 'Service 1', description: 'Description of service 1', icon: '🔧' },
        { title: 'Service 2', description: 'Description of service 2', icon: '🚀' },
        { title: 'Service 3', description: 'Description of service 3', icon: '💡' }
      ]
    }
  },
  features: {
    name: 'Features Section',
    icon: '✨',
    defaultData: {
      title: 'Features',
      subtitle: 'Why choose us',
      features: [
        { title: 'Feature 1', description: 'Amazing feature description', icon: '⭐' },
        { title: 'Feature 2', description: 'Another great feature', icon: '🔥' },
        { title: 'Feature 3', description: 'Third awesome feature', icon: '🎉' }
      ]
    }
  },
  contact: {
    name: 'Contact Section',
    icon: '📞',
    defaultData: {
      title: 'Get In Touch',
      subtitle: 'We would love to hear from you',
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345'
    }
  },
  testimonials: {
    name: 'Testimonials',
    icon: '💬',
    defaultData: {
      title: 'What Our Clients Say',
      testimonials: [
        { name: 'John Doe', role: 'CEO', company: 'Company Inc', content: 'Amazing service!', avatar: '' },
        { name: 'Jane Smith', role: 'Manager', company: 'Tech Corp', content: 'Highly recommended!', avatar: '' }
      ]
    }
  }
};

const LandingPageBuilder = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const alert = useAlert();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      alert.error('Failed to load landing pages');
    } finally {
      setLoading(false);
    }
  };

  const createNewPage = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const newPage = {
        user_id: user.id,
        title: 'New Landing Page',
        slug: `landing-${Date.now()}`,
        content: [],
        is_active: false
      };

      const { data, error } = await supabase
        .from('landing_pages')
        .insert([newPage])
        .select()
        .single();

      if (error) throw error;
      
      setPages([data, ...pages]);
      setCurrentPage(data);
      alert.success('New landing page created!');
    } catch (error) {
      console.error('Error creating page:', error);
      alert.error('Failed to create landing page');
    } finally {
      setSaving(false);
    }
  };

  const savePage = async () => {
    if (!currentPage) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({
          title: currentPage.title,
          slug: currentPage.slug,
          content: currentPage.content,
          is_active: currentPage.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentPage.id);

      if (error) throw error;
      
      setPages(pages.map(p => p.id === currentPage.id ? currentPage : p));
      alert.success('Landing page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      alert.error('Failed to save landing page');
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async (pageId) => {
    if (!confirm('Are you sure you want to delete this landing page?')) return;

    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      
      setPages(pages.filter(p => p.id !== pageId));
      if (currentPage?.id === pageId) {
        setCurrentPage(null);
      }
      alert.success('Landing page deleted successfully!');
    } catch (error) {
      console.error('Error deleting page:', error);
      alert.error('Failed to delete landing page');
    }
  };

  const addComponent = (type) => {
    if (!currentPage) return;

    const componentData = {
      id: `comp_${Date.now()}`,
      type,
      data: { ...COMPONENT_TYPES[type].defaultData }
    };

    const updatedPage = {
      ...currentPage,
      content: [...currentPage.content, componentData]
    };

    setCurrentPage(updatedPage);
  };

  const updateComponent = (componentId, newData) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      content: currentPage.content.map(comp => 
        comp.id === componentId ? { ...comp, data: { ...comp.data, ...newData } } : comp
      )
    };

    setCurrentPage(updatedPage);
  };

  const removeComponent = (componentId) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      content: currentPage.content.filter(comp => comp.id !== componentId)
    };

    setCurrentPage(updatedPage);
  };

  const moveComponent = (fromIndex, toIndex) => {
    if (!currentPage) return;

    const newContent = [...currentPage.content];
    const [movedComponent] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, movedComponent);

    const updatedPage = {
      ...currentPage,
      content: newContent
    };

    setCurrentPage(updatedPage);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton iconOnly={true} size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Landing Page Builder
          </h1>
        </div>

        {!currentPage ? (
          /* Pages List */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Landing Pages
              </h2>
              <button
                onClick={createNewPage}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus size={18} />
                {saving ? 'Creating...' : 'Create New Page'}
              </button>
            </div>

            {pages.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <div key={page.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {page.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {page.is_active && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                            Active
                          </span>
                        )}
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {page.content?.length || 0} components
                    </p>
                    
                    <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">
                      Slug: /{page.slug}
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(page)}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                      >
                        <FiEdit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage({ ...page });
                          setShowPreview(true);
                        }}
                        className="btn-primary flex items-center justify-center gap-2 text-sm"
                      >
                        <FiEye size={14} />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Landing Pages Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first landing page to get started
                </p>
                <button
                  onClick={createNewPage}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <FiPlus size={18} />
                  {saving ? 'Creating...' : 'Create Your First Page'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Page Builder */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Components Panel */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Components
              </h3>
              
              <div className="space-y-2">
                {Object.entries(COMPONENT_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => addComponent(type)}
                    className="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {config.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex gap-2">
                  <button
                    onClick={savePage}
                    disabled={saving}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    <FiSave size={14} />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setCurrentPage(null)}
                    className="btn-secondary text-sm"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            {/* Page Builder */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={currentPage.title}
                    onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                    className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={currentPage.slug}
                    onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                    className="text-sm text-gray-500 bg-transparent border-none outline-none"
                    placeholder="page-slug"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={currentPage.is_active}
                      onChange={(e) => setCurrentPage({ ...currentPage, is_active: e.target.checked })}
                      className="rounded"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="space-y-4 min-h-[400px]">
                {currentPage.content.length > 0 ? (
                  currentPage.content.map((component, index) => (
                    <ComponentEditor
                      key={component.id}
                      component={component}
                      index={index}
                      onUpdate={(data) => updateComponent(component.id, data)}
                      onRemove={() => removeComponent(component.id)}
                      onMoveUp={index > 0 ? () => moveComponent(index, index - 1) : null}
                      onMoveDown={index < currentPage.content.length - 1 ? () => moveComponent(index, index + 1) : null}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-4">🎨</div>
                    <p>Start building your page by adding components from the left panel</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component Editor for each component type
const ComponentEditor = ({ component, index, onUpdate, onRemove, onMoveUp, onMoveDown }) => {
  const config = COMPONENT_TYPES[component.type];
  const [isExpanded, setIsExpanded] = useState(false);

  const renderComponentPreview = () => {
    switch (component.type) {
      case 'hero':
        return (
          <div className="p-8 text-center text-white rounded-lg" style={{ backgroundColor: component.data.backgroundColor }}>
            <h1 className="text-4xl font-bold mb-4">{component.data.title}</h1>
            <p className="text-xl mb-6">{component.data.subtitle}</p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">
              {component.data.buttonText}
            </button>
          </div>
        );
      case 'about':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">{component.data.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{component.data.content}</p>
          </div>
        );
      case 'services':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-4">{component.data.title}</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">{component.data.subtitle}</p>
            <div className="grid md:grid-cols-3 gap-6">
              {component.data.services.map((service, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <span className="text-4xl mb-2 block">{config.icon}</span>
            <p className="text-gray-600 dark:text-gray-400">{config.name} Component</p>
          </div>
        );
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
      {/* Component Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {config.name} #{index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            title="Move up"
          >
            <FiMove size={16} className="rotate-[-90deg]" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            title="Move down"
          >
            <FiMove size={16} className="rotate-90" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <FiEdit3 size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-red-500 hover:text-red-700"
            title="Remove component"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Component Preview */}
      <div className="p-4">
        {renderComponentPreview()}
      </div>

      {/* Component Editor */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700">
          <ComponentForm
            type={component.type}
            data={component.data}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
};

// Component Form for editing component data
const ComponentForm = ({ type, data, onUpdate }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={data.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Button Text</label>
            <input
              type="text"
              value={data.buttonText}
              onChange={(e) => handleInputChange('buttonText', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Button URL</label>
            <input
              type="text"
              value={data.buttonUrl}
              onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={data.backgroundColor}
              onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      );
    
    case 'about':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={data.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows="4"
              className="w-full input-field"
            />
          </div>
        </div>
      );
    
    case 'services':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={data.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="w-full input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Services</label>
            {data.services.map((service, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Icon</label>
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].icon = e.target.value;
                        handleInputChange('services', newServices);
                      }}
                      className="w-full input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].title = e.target.value;
                        handleInputChange('services', newServices);
                      }}
                      className="w-full input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].description = e.target.value;
                        handleInputChange('services', newServices);
                      }}
                      className="w-full input-field"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          Component editor for {type} coming soon...
        </div>
      );
  }
};

export default LandingPageBuilder;
