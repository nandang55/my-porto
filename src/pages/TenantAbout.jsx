import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiBriefcase, FiClock } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import TenantNavbar from '../components/TenantNavbar';
import TechTag from '../components/TechTag';

const TenantAbout = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!portfolio) {
    return <div className="min-h-screen flex items-center justify-center">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TenantNavbar portfolio={portfolio} />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            {portfolio.avatar_url && (
              <img
                src={portfolio.avatar_url}
                alt={portfolio.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-primary-500"
              />
            )}
            <h1 className="text-4xl font-bold mb-4">{portfolio.name}</h1>
            {portfolio.title && (
              <p className="text-xl text-primary-600 dark:text-primary-400 mb-2">
                {portfolio.title}
              </p>
            )}
            {portfolio.tagline && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {portfolio.tagline}
              </p>
            )}
          </div>

          {/* Bio */}
          {portfolio.bio && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {portfolio.bio}
                </p>
              </div>
            </div>
          )}

          {/* Professional Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Experience & Company */}
            {(portfolio.company || portfolio.years_experience) && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-primary-600 dark:text-primary-400" />
                  Professional Details
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  {portfolio.company && (
                    <p>
                      <span className="font-medium">Company:</span> {portfolio.company}
                    </p>
                  )}
                  {portfolio.years_experience && (
                    <p>
                      <span className="font-medium">Experience:</span> {portfolio.years_experience} years
                    </p>
                  )}
                  {portfolio.hourly_rate && (
                    <p>
                      <span className="font-medium">Hourly Rate:</span> {portfolio.hourly_rate}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Availability */}
            {portfolio.availability_status && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiClock className="text-primary-600 dark:text-primary-400" />
                  Availability
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    portfolio.availability_status === 'available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : portfolio.availability_status === 'busy'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {portfolio.availability_status.charAt(0).toUpperCase() + portfolio.availability_status.slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-xl font-semibold mb-4">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill, index) => (
                  <TechTag key={index} tech={skill} />
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {portfolio.languages && portfolio.languages.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-xl font-semibold mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="card mb-8">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {portfolio.email && (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiMail className="text-xl" />
                  {portfolio.email}
                </a>
              )}
              {portfolio.phone && (
                <a
                  href={`tel:${portfolio.phone}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiPhone className="text-xl" />
                  {portfolio.phone}
                </a>
              )}
              {portfolio.location && (
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FiMapPin className="text-xl" />
                  {portfolio.location}
                  {portfolio.timezone && <span className="text-sm text-gray-500">({portfolio.timezone})</span>}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
            <div className="flex flex-wrap gap-4">
              {portfolio.website && (
                <a
                  href={portfolio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                >
                  <FiGlobe className="text-xl" />
                  Website
                </a>
              )}
              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                >
                  <FiGithub className="text-xl" />
                  GitHub
                </a>
              )}
              {portfolio.linkedin_url && (
                <a
                  href={portfolio.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                >
                  <FiLinkedin className="text-xl" />
                  LinkedIn
                </a>
              )}
              {portfolio.twitter_url && (
                <a
                  href={portfolio.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                >
                  <FiTwitter className="text-xl" />
                  Twitter
                </a>
              )}
              {portfolio.instagram_url && (
                <a
                  href={portfolio.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                >
                  <FiInstagram className="text-xl" />
                  Instagram
                </a>
              )}
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

export default TenantAbout;

