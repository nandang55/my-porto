import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiExternalLink, FiUser, FiMail, FiShare2, FiCode, FiFileText } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import BackButton from '../../components/BackButton';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const alert = useAlert();
  const { user } = useAuth();

  const slug = watch('slug');
  const username = watch('username');
  
  // Portfolio URLs
  const portfolioUrl = slug ? `${window.location.origin}/${slug}` : '';
  const subdomainUrl = slug ? `https://${slug}.portofolio.bagdja.com` : '';

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiUser },
    { id: 'contact', label: 'Contact', icon: FiMail },
    { id: 'social', label: 'Social Links', icon: FiShare2 },
    { id: 'professional', label: 'Professional', icon: FiCode },
    { id: 'domain', label: 'Custom Domain', icon: FiExternalLink },
    { id: 'seo', label: 'SEO', icon: FiFileText },
  ];

  useEffect(() => {
    fetchPortfolio();
  }, []);

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
          skills: data.skills?.join(', ') || '',
          languages: data.languages?.join(', ') || '',
        });
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
      const portfolioData = {
        user_id: user.id,
        slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        username: data.username || data.slug,
        name: data.name,
        title: data.title,
        tagline: data.tagline,
        bio: data.bio,
        company: data.company,
        years_experience: data.years_experience ? parseInt(data.years_experience) : null,
        avatar_url: data.avatar_url,
        email: data.email,
        phone: data.phone,
        location: data.location,
        timezone: data.timezone,
        website: data.website,
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        twitter_url: data.twitter_url,
        instagram_url: data.instagram_url,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        languages: data.languages ? data.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
        resume_url: data.resume_url,
        availability_status: data.availability_status || 'available',
        hourly_rate: data.hourly_rate,
        custom_domain: data.custom_domain || null,
        theme_color: data.theme_color || '#0284c7',
        is_active: data.is_active !== false,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords ? data.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
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
        {/* Back Button */}
        <div className="mb-4">
          <BackButton iconOnly={true} size={32} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
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
                <label className="block font-medium mb-2">Avatar URL</label>
                <input
                  {...register('avatar_url')}
                  className="input-field"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Profile picture (recommended: 400x400px, square)
                </p>
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
                <label className="block font-medium mb-2">Skills (comma separated)</label>
                <input
                  {...register('skills')}
                  className="input-field"
                  placeholder="React, Node.js, TypeScript, PostgreSQL, AWS"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate skills with commas
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">Languages (comma separated)</label>
                <input
                  {...register('languages')}
                  className="input-field"
                  placeholder="English, Indonesian, Japanese"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Resume/CV URL</label>
                <input
                  {...register('resume_url')}
                  className="input-field"
                  placeholder="https://drive.google.com/your-resume.pdf"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Link to downloadable resume/CV
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
                  {slug}.portofolio.bagdja.com
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Theme Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...register('theme_color')}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      {...register('theme_color')}
                      className="input-field flex-1"
                      placeholder="#0284c7"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">Portfolio Status</label>
                  <label className="flex items-center gap-3 cursor-pointer h-10">
                    <input
                      type="checkbox"
                      {...register('is_active')}
                      className="w-5 h-5 text-primary-600 rounded"
                      defaultChecked
                    />
                    <span className="text-sm font-medium">
                      Active (publicly accessible)
                    </span>
                  </label>
                </div>
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

        {/* Help Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold mb-2 text-blue-900 dark:text-blue-300">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• <strong>Slug:</strong> Your unique URL (e.g., /john-doe) - lowercase only</li>
            <li>• <strong>Username:</strong> Display name (e.g., @JohnDoe) - can have uppercase</li>
            <li>• <strong>Bio:</strong> Write a compelling story about your journey and expertise</li>
            <li>• <strong>Skills:</strong> Add your top technical skills for better discovery</li>
            <li>• <strong>Resume:</strong> Link to Google Drive, Dropbox, or cloud storage</li>
            <li>• <strong>SEO:</strong> Good meta tags improve Google search ranking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
