import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome } from 'react-icons/fi';
import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

const TenantNavbar = ({ portfolio, hasLandingPage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (!portfolio) return null;

  const navLinks = [
    // Only show Home menu if landing page is active
    ...(hasLandingPage ? [{ name: 'Home', path: `/${portfolio.slug}`, icon: FiHome }] : []),
    { name: 'Projects', path: `/${portfolio.slug}/projects` },
    { name: 'Blog', path: `/${portfolio.slug}/blog` },
    { name: 'About', path: `/${portfolio.slug}/about` },
    { name: 'Contact', path: `/${portfolio.slug}/contact` },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Name */}
          <Link 
            to={`/${portfolio.slug}`} 
            className="flex items-center gap-3 group"
          >
            {portfolio.avatar_url && (
              <img
                src={portfolio.avatar_url}
                alt={portfolio.name}
                className="w-10 h-10 rounded-full object-cover border-2 group-hover:scale-110 transition-transform"
                style={{
                  borderColor: portfolio.theme_color || '#0284c7'
                }}
              />
            )}
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {portfolio.name}
              </span>
              {portfolio.username && (
                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                  @{portfolio.username}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? ''
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  style={isActive(link.path) ? { color: portfolio.theme_color || '#0284c7' } : {}}
                  onMouseEnter={(e) => !isActive(link.path) && (e.currentTarget.style.color = portfolio.theme_color || '#0284c7')}
                  onMouseLeave={(e) => !isActive(link.path) && (e.currentTarget.style.color = '')}
                >
                  {IconComponent && <IconComponent size={16} />}
                  {link.name}
                </Link>
              );
            })}
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 mt-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 font-medium transition-colors duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? ''
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  style={isActive(link.path) ? { color: portfolio.theme_color || '#0284c7' } : {}}
                  onMouseEnter={(e) => !isActive(link.path) && (e.currentTarget.style.color = portfolio.theme_color || '#0284c7')}
                  onMouseLeave={(e) => !isActive(link.path) && (e.currentTarget.style.color = '')}
                >
                  {IconComponent && <IconComponent size={16} />}
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default TenantNavbar;
