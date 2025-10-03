import { Link } from 'react-router-dom';
import { FiFileText, FiBriefcase, FiMail, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projectsPublished: 0,
    projectsTotal: 0,
    blogPosts: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total projects count
      const { count: projectsTotal } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Fetch published projects count
      const { count: projectsPublished } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      // Fetch blog posts count
      const { count: blogCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      setStats({
        projectsPublished: projectsPublished || 0,
        projectsTotal: projectsTotal || 0,
        blogPosts: blogCount || 0,
        messages: messagesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Manage Portfolio',
      description: 'Add, edit, or delete portfolio projects',
      icon: FiBriefcase,
      link: '/admin/portfolio',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Manage Blog',
      description: 'Create and manage blog posts',
      icon: FiFileText,
      link: '/admin/blog',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      title: 'View Messages',
      description: 'Check messages from contact form',
      icon: FiMail,
      link: '/admin/messages',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Portfolio Settings',
      description: 'Customize your portfolio info & URL',
      icon: FiSettings,
      link: '/admin/settings',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-sm opacity-90 mb-1">Total Projects</p>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-9 bg-white/20 rounded w-20"></div>
                </div>
              ) : (
                <p className="text-3xl font-bold">
                  {stats.projectsPublished}
                  <span className="text-xl opacity-75">/{stats.projectsTotal}</span>
                </p>
              )}
              {!loading && (
                <p className="text-xs opacity-75 mt-1">Published / Total</p>
              )}
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <p className="text-sm opacity-90 mb-1">Blog Posts</p>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-9 bg-white/20 rounded w-12"></div>
                </div>
              ) : (
                <p className="text-3xl font-bold">{stats.blogPosts}</p>
              )}
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <p className="text-sm opacity-90 mb-1">Messages</p>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-9 bg-white/20 rounded w-12"></div>
                </div>
              ) : (
                <p className="text-3xl font-bold">{stats.messages}</p>
              )}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.link}
                className="card group hover:scale-105 transition-transform duration-200"
              >
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

