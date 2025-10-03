import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiExternalLink, FiUser, FiMail, FiShare2, FiCode, FiFileText, FiUpload, FiX, FiDroplet } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import BackButton from '../../components/BackButton';
import SkillsInput from '../../components/SkillsInput';
import LanguagesInput from '../../components/LanguagesInput';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [themeColor, setThemeColor] = useState('#0284c7');
  const [secondaryColor, setSecondaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [textPrimary, setTextPrimary] = useState('#1f2937');
  const [textSecondary, setTextSecondary] = useState('#6b7280');
  const [bgLight, setBgLight] = useState('#ffffff');
  const [bgDark, setBgDark] = useState('#111827');
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm();
  const alert = useAlert();
  const { user } = useAuth();

  const slug = watch('slug');
  const username = watch('username');
  
  // Portfolio URLs
  const portfolioUrl = slug ? `${window.location.origin}/${slug}` : '';
  const subdomainUrl = slug ? `https://${slug}.porto.bagdja.com` : '';

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiUser },
    { id: 'contact', label: 'Contact', icon: FiMail },
    { id: 'social', label: 'Social Links', icon: FiShare2 },
    { id: 'professional', label: 'Professional', icon: FiCode },
    { id: 'theme', label: 'Theme & Colors', icon: FiDroplet },
    { id: 'domain', label: 'Custom Domain', icon: FiExternalLink },
    { id: 'seo', label: 'SEO', icon: FiFileText },
  ];

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert.error('Image size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;

    setUploadingAvatar(true);
    try {
      // Delete old avatar if exists
      if (portfolio?.avatar_url) {
        const oldPath = portfolio.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert.error('Failed to upload avatar');
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setValue('avatar_url', '');
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      alert.error('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert.error('Resume file size must be less than 10MB');
      return;
    }

    setResumeFile(file);
  };

  const uploadResume = async () => {
    if (!resumeFile || !user) return null;

    setUploadingResume(true);
    try {
      // Delete old resume if exists
      if (portfolio?.resume_url) {
        const oldPath = portfolio.resume_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('resumes')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new resume
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `resume_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert.error('Failed to upload resume');
      return null;
    } finally {
      setUploadingResume(false);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setValue('resume_url', '');
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert.error('Cover image size must be less than 5MB');
      return;
    }

    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadCoverImage = async () => {
    if (!coverImageFile || !user) return null;

    setUploadingCover(true);
    try {
      if (portfolio?.cover_image) {
        const oldPath = portfolio.cover_image.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('covers').remove([`${user.id}/${oldPath}`]);
        }
      }

      const fileExt = coverImageFile.name.split('.').pop();
      const fileName = `cover_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, coverImageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert.error('Failed to upload cover image');
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setValue('cover_image', '');
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert.error('Please select an image file');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert.error('Favicon size must be less than 1MB');
      return;
    }

    setFaviconFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFaviconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadFavicon = async () => {
    if (!faviconFile || !user) return null;

    setUploadingFavicon(true);
    try {
      if (portfolio?.favicon_url) {
        const oldPath = portfolio.favicon_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('favicons').remove([`${user.id}/${oldPath}`]);
        }
      }

      const fileExt = faviconFile.name.split('.').pop();
      const fileName = `favicon_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('favicons')
        .upload(filePath, faviconFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('favicons')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading favicon:', error);
      alert.error('Failed to upload favicon');
      return null;
    } finally {
      setUploadingFavicon(false);
    }
  };

  const removeFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(null);
    setValue('favicon_url', '');
  };

  const fetchPortfolio = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPortfolio(data);
        reset({
          ...data,
        });
        // Set skills and languages
        setSkills(data.skills || []);
        setLanguages(data.languages || []);
        // Set theme colors
        setThemeColor(data.theme_color || '#0284c7');
        setSecondaryColor(data.secondary_color || '#6366f1');
        setAccentColor(data.accent_color || '#f59e0b');
        setTextPrimary(data.text_primary || '#1f2937');
        setTextSecondary(data.text_secondary || '#6b7280');
        setBgLight(data.bg_light || '#ffffff');
        setBgDark(data.bg_dark || '#111827');
        // Set avatar preview if exists
        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url);
        }
        // Set cover image preview if exists
        if (data.cover_image) {
          setCoverImagePreview(data.cover_image);
        }
        // Set favicon preview if exists
        if (data.favicon_url) {
          setFaviconPreview(data.favicon_url);
        }
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      // Validate required fields
      if (!data.slug || !data.name) {
        alert.error('Slug and Name are required fields.');
        setSaving(false);
        return;
      }

      // Upload avatar if there's a new file
      let avatarUrl = data.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Upload resume if there's a new file
      let resumeUrl = data.resume_url;
      if (resumeFile) {
        const uploadedUrl = await uploadResume();
        if (uploadedUrl) {
          resumeUrl = uploadedUrl;
        }
      }

      // Upload cover image if there's a new file
      let coverImageUrl = data.cover_image;
      if (coverImageFile) {
        const uploadedUrl = await uploadCoverImage();
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        }
      }

      // Upload favicon if there's a new file
      let faviconUrl = data.favicon_url;
      if (faviconFile) {
        const uploadedUrl = await uploadFavicon();
        if (uploadedUrl) {
          faviconUrl = uploadedUrl;
        }
      }

      const portfolioData = {
        user_id: user.id,
        slug: data.slug ? data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '') : '',
        username: data.username || data.slug || '',
        name: data.name || '',
        title: data.title || null,
        tagline: data.tagline || null,
        bio: data.bio || null,
        company: data.company || null,
        years_experience: data.years_experience ? parseInt(data.years_experience) : null,
        avatar_url: avatarUrl || null,
        email: data.email || null,
        phone: data.phone || null,
        location: data.location || null,
        timezone: data.timezone || null,
        website: data.website || null,
        github_url: data.github_url || null,
        linkedin_url: data.linkedin_url || null,
        twitter_url: data.twitter_url || null,
        instagram_url: data.instagram_url || null,
        skills: skills || [],
        languages: languages || [],
        resume_url: resumeUrl || null,
        availability_status: data.availability_status || 'available',
        hourly_rate: data.hourly_rate || null,
        custom_domain: data.custom_domain || null,
        theme_color: themeColor || '#0284c7',
        secondary_color: secondaryColor || '#6366f1',
        accent_color: accentColor || '#f59e0b',
        text_primary: textPrimary || '#1f2937',
        text_secondary: textSecondary || '#6b7280',
        bg_light: bgLight || '#ffffff',
        bg_dark: bgDark || '#111827',
        cover_image: coverImageUrl || null,
        favicon_url: faviconUrl || null,
        is_active: data.is_active !== false,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        meta_keywords: (data.meta_keywords && typeof data.meta_keywords === 'string') ? data.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
      };

      if (portfolio) {
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', portfolio.id);

        if (error) throw error;
        alert.success('Portfolio updated successfully!');
      } else {
        const { error } = await supabase
          .from('portfolios')
          .insert([portfolioData]);

        if (error) throw error;
        alert.success('Portfolio created successfully!');
      }

      await fetchPortfolio();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      if (error.code === '23505') {
        alert.error('Slug or username is already taken. Please choose another one.');
      } else if (error.message) {
        alert.error(`Error: ${error.message}`);
      } else {
        alert.error('Failed to save portfolio settings. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <BackButton iconOnly={true} size={32} />
            <h1 className="text-3xl font-bold">Portfolio Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            Customize your public portfolio appearance and information
          </p>
        </div>

        {/* Portfolio URLs Preview */}
        {slug && (
          <div className="mb-6 space-y-3">
            {/* Primary URL (Path-based) */}
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
              <p className="text-sm text-primary-700 dark:text-primary-300 mb-2 font-medium">
                🌐 Portfolio URL (Path):
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-base font-mono text-primary-600 dark:text-primary-400 break-all">
                  {portfolioUrl}
                </code>
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <FiExternalLink size={16} /> Visit
                </a>
              </div>
            </div>

            {/* Subdomain URL */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-2 font-medium">
                🚀 Subdomain URL (Recommended):
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-base font-mono text-purple-600 dark:text-purple-400 break-all">
                  {subdomainUrl}
                </code>
                <a
                  href={subdomainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <FiExternalLink size={16} /> Visit
                </a>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                💡 More professional URL with subdomain pattern
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Basic Information</h2>
              
              {/* Slug & Username */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">
                    Portfolio Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">.../</span>
                    <input
                      {...register('slug', { 
                        required: 'Slug is required',
                        pattern: {
                          value: /^[a-z0-9-]+$/,
                          message: 'Only lowercase, numbers, hyphens'
                        },
                        minLength: { value: 3, message: 'Min 3 characters' }
                      })}
                      className="input-field flex-1"
                      placeholder="john-doe"
                    />
                  </div>
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your portfolio URL (lowercase only)
                  </p>
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('username', { 
                      required: 'Username is required',
                      pattern: {
                        value: /^[a-zA-Z0-9_-]{3,30}$/,
                        message: 'Letters, numbers, underscore, hyphen only'
                      }
                    })}
                    className="input-field"
                    placeholder="JohnDoe"
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Display name (can have uppercase)
                  </p>
                </div>
              </div>

              {/* Full Name & Title */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-2">Professional Title</label>
                  <input
                    {...register('title')}
                    className="input-field"
                    placeholder="Senior Full-Stack Developer"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-medium mb-2">Tagline</label>
                <input
                  {...register('tagline')}
                  className="input-field"
                  placeholder="Building innovative solutions with modern technologies"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Short catchy phrase for your hero section
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-medium mb-2">Bio</label>
                <textarea
                  {...register('bio')}
                  className="input-field"
                  rows="5"
                  placeholder="Tell visitors about yourself, your expertise, and what makes you unique..."
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block font-medium mb-2">Avatar</label>
                
                {/* Avatar Preview */}
                <div className="mb-4">
                  {(avatarPreview || watch('avatar_url')) && (
                    <div className="relative inline-block">
                      <img
                        src={avatarPreview || watch('avatar_url')}
                        alt="Avatar preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="flex items-center gap-4">
                  <label className="btn-secondary cursor-pointer flex items-center gap-2">
                    <FiUpload />
                    {uploadingAvatar ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                  
                  {avatarFile && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {avatarFile.name}
                    </span>
                  )}
                </div>

                {/* Hidden input to store avatar URL */}
                <input type="hidden" {...register('avatar_url')} />

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Recommended: 400x400px, square, max 5MB (JPG, PNG, GIF, WebP)
                </p>
              </div>

              {/* Help Tips */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold mb-2 text-blue-900 dark:text-blue-300">💡 Tips:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• <strong>Slug:</strong> Your unique URL (e.g., /john-doe) - lowercase only</li>
                  <li>• <strong>Username:</strong> Display name (e.g., @JohnDoe) - can have uppercase</li>
                  <li>• <strong>Bio:</strong> Write a compelling story about your journey and expertise</li>
                  <li>• <strong>Avatar:</strong> Upload a professional photo (square, 400x400px recommended)</li>
                  <li>• <strong>Tagline:</strong> Short catchy phrase that describes what you do</li>
                </ul>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Contact Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Phone</label>
                  <input
                    {...register('phone')}
                    className="input-field"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Location</label>
                  <input
                    {...register('location')}
                    className="input-field"
                    placeholder="San Francisco, CA, USA"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Timezone</label>
                  <input
                    {...register('timezone')}
                    className="input-field"
                    placeholder="America/Los_Angeles"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Website</label>
                  <input
                    {...register('website')}
                    className="input-field"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">GitHub</label>
                  <input
                    {...register('github_url')}
                    className="input-field"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">LinkedIn</label>
                  <input
                    {...register('linkedin_url')}
                    className="input-field"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Twitter</label>
                  <input
                    {...register('twitter_url')}
                    className="input-field"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Instagram</label>
                  <input
                    {...register('instagram_url')}
                    className="input-field"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Professional Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Professional Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Current Company</label>
                  <input
                    {...register('company')}
                    className="input-field"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Years of Experience</label>
                  <input
                    type="number"
                    {...register('years_experience')}
                    className="input-field"
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Skills</label>
                <SkillsInput
                  value={skills}
                  onChange={setSkills}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Languages</label>
                <LanguagesInput
                  value={languages}
                  onChange={setLanguages}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Resume/CV</label>
                
                {/* Current Resume Display */}
                {watch('resume_url') && !resumeFile && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Current Resume</p>
                          <a
                            href={watch('resume_url')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeResume}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected File Display */}
                {resumeFile && (
                  <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{resumeFile.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <label className="btn-secondary cursor-pointer flex items-center gap-2 w-fit">
                  <FiUpload />
                  {uploadingResume ? 'Uploading...' : resumeFile ? 'Change PDF' : 'Upload PDF'}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                    disabled={uploadingResume}
                  />
                </label>

                {/* Hidden input to store resume URL */}
                <input type="hidden" {...register('resume_url')} />

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Upload your resume/CV in PDF format (max 10MB)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Availability Status</label>
                  <select
                    {...register('availability_status')}
                    className="input-field"
                  >
                    <option value="available">✅ Available for hire</option>
                    <option value="busy">⏰ Busy (limited availability)</option>
                    <option value="unavailable">❌ Not available</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Hourly Rate (Optional)</label>
                  <input
                    {...register('hourly_rate')}
                    className="input-field"
                    placeholder="$50/hour"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Theme & Colors Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-2">Theme & Color Customization</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your portfolio's color scheme to match your personal brand
                </p>
              </div>

              {/* Color Preview */}
              <div className="card bg-gradient-to-r" style={{
                backgroundImage: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`
              }}>
                <div className="text-white text-center py-8">
                  <h3 className="text-2xl font-bold mb-2">Color Preview</h3>
                  <p className="opacity-90">This is how your theme colors will look</p>
                </div>
              </div>

              {/* Cover Image & Favicon */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiUpload className="text-primary-600" />
                  Visual Assets
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Cover Image */}
                  <div>
                    <label className="block font-medium mb-2">Cover Image</label>
                    
                    {/* Preview */}
                    {(coverImagePreview || watch('cover_image')) && (
                      <div className="relative mb-4">
                        <img
                          src={coverImagePreview || watch('cover_image')}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg border-2"
                          style={{ borderColor: themeColor }}
                        />
                        <button
                          type="button"
                          onClick={removeCoverImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <label className="btn-secondary cursor-pointer flex items-center gap-2 w-fit">
                      <FiUpload />
                      {uploadingCover ? 'Uploading...' : coverImageFile ? 'Change Image' : 'Upload Cover'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                        disabled={uploadingCover}
                      />
                    </label>

                    <input type="hidden" {...register('cover_image')} />

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Hero banner image (recommended: 1920x600px, max 5MB)
                    </p>
                  </div>

                  {/* Favicon */}
                  <div>
                    <label className="block font-medium mb-2">Favicon</label>
                    
                    {/* Preview */}
                    {(faviconPreview || watch('favicon_url')) && (
                      <div className="relative inline-block mb-4">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
                          <img
                            src={faviconPreview || watch('favicon_url')}
                            alt="Favicon preview"
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeFavicon}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <label className="btn-secondary cursor-pointer flex items-center gap-2 w-fit">
                      <FiUpload />
                      {uploadingFavicon ? 'Uploading...' : faviconFile ? 'Change Icon' : 'Upload Favicon'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconChange}
                        className="hidden"
                        disabled={uploadingFavicon}
                      />
                    </label>

                    <input type="hidden" {...register('favicon_url')} />

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Browser tab icon (recommended: 32x32px or 64x64px, PNG/ICO, max 1MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiDroplet className="text-primary-600" />
                  Primary Colors
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Theme Color */}
                  <div>
                    <label className="block font-medium mb-2">Primary Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="input flex-1"
                        placeholder="#0284c7"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Main brand color (buttons, links, accents)
                    </p>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block font-medium mb-2">Secondary Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="input flex-1"
                        placeholder="#6366f1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Supporting brand color (secondary elements)
                    </p>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block font-medium mb-2">Accent Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="input flex-1"
                        placeholder="#f59e0b"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Highlight color (badges, special elements)
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiFileText className="text-primary-600" />
                  Text Colors
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Primary Text */}
                  <div>
                    <label className="block font-medium mb-2">Primary Text Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={textPrimary}
                        onChange={(e) => setTextPrimary(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textPrimary}
                        onChange={(e) => setTextPrimary(e.target.value)}
                        className="input flex-1"
                        placeholder="#1f2937"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Main text color (headings, important text)
                    </p>
                  </div>

                  {/* Secondary Text */}
                  <div>
                    <label className="block font-medium mb-2">Secondary Text Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={textSecondary}
                        onChange={(e) => setTextSecondary(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textSecondary}
                        onChange={(e) => setTextSecondary(e.target.value)}
                        className="input flex-1"
                        placeholder="#6b7280"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Muted text color (descriptions, captions)
                    </p>
                  </div>
                </div>
              </div>

              {/* Background Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiUser className="text-primary-600" />
                  Background Colors
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Light Background */}
                  <div>
                    <label className="block font-medium mb-2">Light Background</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={bgLight}
                        onChange={(e) => setBgLight(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgLight}
                        onChange={(e) => setBgLight(e.target.value)}
                        className="input flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Main background color (light mode)
                    </p>
                  </div>

                  {/* Dark Background */}
                  <div>
                    <label className="block font-medium mb-2">Dark Background</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={bgDark}
                        onChange={(e) => setBgDark(e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgDark}
                        onChange={(e) => setBgDark(e.target.value)}
                        className="input flex-1"
                        placeholder="#111827"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Main background color (dark mode)
                    </p>
                  </div>
                </div>
              </div>

              {/* Preset Themes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Ocean Blue */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#0284c7');
                      setSecondaryColor('#0ea5e9');
                      setAccentColor('#38bdf8');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-cyan-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-cyan-600 to-blue-500 mb-2"></div>
                    <p className="text-sm font-medium">Ocean Blue</p>
                  </button>

                  {/* Purple Dream */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#7c3aed');
                      setSecondaryColor('#a78bfa');
                      setAccentColor('#c084fc');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-purple-600 to-violet-500 mb-2"></div>
                    <p className="text-sm font-medium">Purple Dream</p>
                  </button>

                  {/* Emerald Fresh */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#059669');
                      setSecondaryColor('#10b981');
                      setAccentColor('#34d399');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-emerald-600 to-green-500 mb-2"></div>
                    <p className="text-sm font-medium">Emerald Fresh</p>
                  </button>

                  {/* Sunset Orange */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#ea580c');
                      setSecondaryColor('#f97316');
                      setAccentColor('#fb923c');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-orange-600 to-amber-500 mb-2"></div>
                    <p className="text-sm font-medium">Sunset Orange</p>
                  </button>

                  {/* Rose Pink */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#e11d48');
                      setSecondaryColor('#f43f5e');
                      setAccentColor('#fb7185');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-rose-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-rose-600 to-pink-500 mb-2"></div>
                    <p className="text-sm font-medium">Rose Pink</p>
                  </button>

                  {/* Teal Fresh */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#0d9488');
                      setSecondaryColor('#14b8a6');
                      setAccentColor('#2dd4bf');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-teal-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-teal-600 to-cyan-500 mb-2"></div>
                    <p className="text-sm font-medium">Teal Fresh</p>
                  </button>

                  {/* Slate Professional */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#475569');
                      setSecondaryColor('#64748b');
                      setAccentColor('#94a3b8');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-slate-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-slate-600 to-gray-500 mb-2"></div>
                    <p className="text-sm font-medium">Slate Pro</p>
                  </button>

                  {/* Crimson Bold */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeColor('#dc2626');
                      setSecondaryColor('#ef4444');
                      setAccentColor('#f87171');
                    }}
                    className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 transition-all group"
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-red-600 to-red-500 mb-2"></div>
                    <p className="text-sm font-medium">Crimson Bold</p>
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Theme Tips</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Use <strong>Primary Color</strong> for main elements (navbar, buttons, hero)</li>
                  <li>• Use <strong>Secondary Color</strong> for supporting elements</li>
                  <li>• Use <strong>Accent Color</strong> for highlights and special badges</li>
                  <li>• Choose colors that complement each other</li>
                  <li>• Test in both light and dark modes</li>
                  <li>• Try Quick Presets for instant professional color schemes</li>
                </ul>
              </div>
            </div>
          )}

          {/* Custom Domain Tab */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Domain & URL Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your portfolio is accessible via multiple URLs
              </p>

              {/* Current Access URLs */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                  🌐 Available Portfolio URLs:
                </p>
                
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Path-based URL:</p>
                  <code className="text-blue-700 dark:text-blue-400 font-mono text-sm break-all">
                    {portfolioUrl || 'Not set (configure slug first)'}
                  </code>
                </div>

                <div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mb-1">Subdomain URL (Recommended):</p>
                  <code className="text-purple-700 dark:text-purple-400 font-mono text-sm break-all">
                    {subdomainUrl || 'Not set (configure slug first)'}
                  </code>
                </div>
              </div>

              {/* Subdomain Info */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h3 className="font-bold mb-2 text-purple-900 dark:text-purple-300">
                  ✨ Subdomain Access
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-300 mb-3">
                  Your portfolio is automatically accessible via subdomain:
                </p>
                <code className="text-purple-700 dark:text-purple-400 font-mono text-sm break-all block mb-3">
                  {slug}.porto.bagdja.com
                </code>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  💡 This provides a more professional look than path-based URLs. No additional configuration needed!
                </p>
              </div>

              {/* Custom Domain Input */}
              <div>
                <label className="block font-medium mb-2">Custom Domain</label>
                <input
                  {...register('custom_domain', {
                    pattern: {
                      value: /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
                      message: 'Enter a valid domain (e.g., portfolio.com or www.portfolio.com)'
                    }
                  })}
                  className="input-field"
                  placeholder="www.yourdomain.com or yourdomain.com"
                />
                {errors.custom_domain && (
                  <p className="text-red-500 text-sm mt-1">{errors.custom_domain.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter your domain without https:// (e.g., portfolio.com or www.portfolio.com)
                </p>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-bold mb-3 text-yellow-900 dark:text-yellow-300">
                  📝 How to Setup Custom Domain:
                </h3>
                <ol className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2 list-decimal list-inside">
                  <li>
                    <strong>Buy a domain</strong> from registrar (Namecheap, GoDaddy, Cloudflare, etc.)
                  </li>
                  <li>
                    <strong>Add DNS records</strong> in your domain provider:
                    <div className="ml-6 mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded font-mono text-xs">
                      Type: CNAME<br/>
                      Name: www (or @)<br/>
                      Value: {window.location.hostname}<br/>
                      TTL: 3600
                    </div>
                  </li>
                  <li>
                    <strong>Enter domain</strong> in the field above (e.g., www.yourdomain.com)
                  </li>
                  <li>
                    <strong>Save settings</strong> and wait for DNS propagation (5-30 minutes)
                  </li>
                  <li>
                    <strong>Visit your domain</strong> - it should redirect to your portfolio!
                  </li>
                </ol>
              </div>

              {/* Verification Status */}
              {portfolio?.custom_domain && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-bold mb-2 text-green-900 dark:text-green-300">
                    ✅ Custom Domain Configured
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Your portfolio is accessible at:{' '}
                    <a 
                      href={`https://${portfolio.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono underline hover:opacity-70"
                    >
                      {portfolio.custom_domain}
                    </a>
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                    💡 Keep the original /{slug} URL as a backup access point
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-bold mb-2">🌟 Benefits of Custom Domain:</h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>✅ Professional branding (yourname.com)</li>
                  <li>✅ Better SEO and search rankings</li>
                  <li>✅ Memorable URL for clients/employers</li>
                  <li>✅ Personal brand identity</li>
                  <li>✅ Email on same domain possible (contact@yourdomain.com)</li>
                </ul>
              </div>

              {/* Warning */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-bold mb-2 text-red-900 dark:text-red-300">⚠️ Important Notes:</h3>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
                  <li>• DNS propagation can take 5-30 minutes (sometimes up to 48 hours)</li>
                  <li>• Make sure DNS records point to correct hosting</li>
                  <li>• Custom domain is optional - /{slug} will always work</li>
                  <li>• SSL certificate may need separate configuration</li>
                  <li>• Contact support if domain doesn't work after 24 hours</li>
                </ul>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">SEO & Meta Tags</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimize your portfolio for search engines
              </p>
              
              <div>
                <label className="block font-medium mb-2">Meta Title</label>
                <input
                  {...register('meta_title')}
                  className="input-field"
                  placeholder="John Doe - Full-Stack Developer Portfolio"
                  maxLength="60"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">Meta Description</label>
                <textarea
                  {...register('meta_description')}
                  className="input-field"
                  rows="3"
                  placeholder="Professional portfolio showcasing full-stack development projects, web applications, and technical expertise."
                  maxLength="160"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">Keywords (comma separated)</label>
                <input
                  {...register('meta_keywords')}
                  className="input-field"
                  placeholder="web developer, react, node.js, portfolio, full-stack"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Portfolio Status</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="w-5 h-5 text-primary-600 rounded"
                    defaultChecked
                  />
                  <div>
                    <span className="block font-medium">
                      Active (publicly accessible)
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Enable this to make your portfolio visible to the public
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave /> {saving ? 'Saving...' : portfolio ? 'Update Settings' : 'Create Portfolio'}
            </button>
            
            {portfolio && slug && (
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <FiExternalLink /> Preview Portfolio
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
