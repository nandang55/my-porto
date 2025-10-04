import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const AdminThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('admin-theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
  };

  const setSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
    applyTheme(systemTheme);
    localStorage.setItem('admin-theme', 'system');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <FiMoon size={18} />;
      case 'light':
        return <FiSun size={18} />;
      default:
        return <FiMonitor size={18} />;
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105"
        title={`Current theme: ${theme}. Click to toggle.`}
      >
        {getThemeIcon()}
      </button>
      
      {/* Theme Options Dropdown */}
      <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px]">
        <div className="py-2">
          <button
            onClick={() => {
              setTheme('light');
              applyTheme('light');
              localStorage.setItem('admin-theme', 'light');
            }}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              theme === 'light' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiSun size={16} />
            Light
          </button>
          <button
            onClick={() => {
              setTheme('dark');
              applyTheme('dark');
              localStorage.setItem('admin-theme', 'dark');
            }}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              theme === 'dark' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiMoon size={16} />
            Dark
          </button>
          <button
            onClick={setSystemTheme}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              localStorage.getItem('admin-theme') === 'system' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiMonitor size={16} />
            System
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeToggle;
