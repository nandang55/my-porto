import { Link, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AdminThemeToggle from './AdminThemeToggle';

const AdminNavbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiSettings className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/portfolio"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/portfolio')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Portfolio
            </Link>
            <Link
              to="/admin/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/blog')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Blog
            </Link>
            <Link
              to="/admin/messages"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/messages')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Messages
            </Link>
            <Link
              to="/admin/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/settings')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Settings
            </Link>
          </div>

          {/* Right Side - User Menu & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <AdminThemeToggle />

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <FiUser className="text-primary-600 dark:text-primary-400" size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.email?.split('@')[0] || 'Admin'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Logout"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
