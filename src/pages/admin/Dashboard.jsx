import { Link } from 'react-router-dom';
import { FiFileText, FiBriefcase, FiMail, FiSettings, FiEye, FiTrendingUp, FiUsers, FiCalendar, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import AdminNavbar from '../../components/AdminNavbar';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projectsPublished: 0,
    projectsTotal: 0,
    blogPublished: 0,
    blogTotal: 0,
    messages: 0,
    totalViews: 0,
    recentViews: 0,
    portfolioViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentActivity();
      fetchChartData();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      // Fetch total projects count for current user
      const { count: projectsTotal } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch published projects count for current user
      const { count: projectsPublished } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('published', true);

      // Fetch blog posts count for current user
      const { count: blogTotal } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch published blog posts count for current user
      const { count: blogPublished } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('published', true);

      // Fetch messages count for current user
      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch total project views
      const { data: projectViews } = await supabase
        .from('project_views')
        .select('id')
        .in('project_id', 
          (await supabase.from('projects').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
        );

      // Fetch total blog views
      const { data: blogViews } = await supabase
        .from('blog_views')
        .select('id')
        .in('post_id', 
          (await supabase.from('blog_posts').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
        );

      // Fetch recent views (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentProjectViews } = await supabase
        .from('project_views')
        .select('*', { count: 'exact', head: true })
        .in('project_id', 
          (await supabase.from('projects').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
        )
        .gte('viewed_at', sevenDaysAgo.toISOString());

      const { count: recentBlogViews } = await supabase
        .from('blog_views')
        .select('*', { count: 'exact', head: true })
        .in('post_id', 
          (await supabase.from('blog_posts').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
        )
        .gte('viewed_at', sevenDaysAgo.toISOString());

      const totalViews = (projectViews?.length || 0) + (blogViews?.length || 0);
      const recentViews = (recentProjectViews || 0) + (recentBlogViews || 0);

      setStats({
        projectsPublished: projectsPublished || 0,
        projectsTotal: projectsTotal || 0,
        blogPublished: blogPublished || 0,
        blogTotal: blogTotal || 0,
        messages: messagesCount || 0,
        totalViews: totalViews,
        recentViews: recentViews,
        portfolioViews: totalViews, // Same as total views for now
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    if (!user?.id) return;

    try {
      // Fetch recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Fetch recent blog posts
      const { data: recentBlogs } = await supabase
        .from('blog_posts')
        .select('title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Fetch recent messages
      const { data: recentMessages } = await supabase
        .from('contact_messages')
        .select('name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort by date
      const activities = [
        ...(recentProjects || []).map(p => ({ ...p, type: 'project' })),
        ...(recentBlogs || []).map(p => ({ ...p, type: 'blog' })),
        ...(recentMessages || []).map(m => ({ ...m, type: 'message' }))
      ].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
       .slice(0, 8);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchChartData = async () => {
    if (!user?.id) return;

    try {
      // Get views for last 30 days grouped by day
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: projectViews } = await supabase
        .from('project_views')
        .select('viewed_at')
        .in('project_id', 
          (await supabase.from('projects').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
        )
        .gte('viewed_at', thirtyDaysAgo.toISOString());

      const { data: blogViews } = await supabase
        .from('blog_views')
        .select('viewed_at')
        .in('post_id', 
          (await supabase.from('blog_posts').select('id').eq('user_id', user.id)).data?.map(p => p.id) || []
        )
        .gte('viewed_at', thirtyDaysAgo.toISOString());

      // Group views by date
      const allViews = [...(projectViews || []), ...(blogViews || [])];
      const viewsByDate = {};

      allViews.forEach(view => {
        const date = new Date(view.viewed_at).toISOString().split('T')[0];
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      });

      // Create chart data for last 7 days
      const chartDataArray = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        chartDataArray.push({
          date: dateStr,
          views: viewsByDate[dateStr] || 0,
          label: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }

      setChartData(chartDataArray);
    } catch (error) {
      console.error('Error fetching chart data:', error);
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
      <AdminNavbar />
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.email?.split('@')[0] || 'Admin'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's your portfolio performance overview
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Views
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Quick Stats</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Projects Stat */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Projects
                  </p>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.projectsPublished}/{stats.projectsTotal}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Published / Total
                      </p>
                    </>
                  )}
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiBriefcase className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
            </div>

            {/* Blog Posts Stat */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Blog Posts
                  </p>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.blogPublished}/{stats.blogTotal}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Published / Total
                      </p>
                    </>
                  )}
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiFileText className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
            </div>

            {/* Messages Stat */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Messages
                  </p>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.messages}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Total received
                      </p>
                    </>
                  )}
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiMail className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>

            {/* Views Stat */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Views
                  </p>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalViews.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        All time
                      </p>
                    </>
                  )}
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiEye className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📈 Performance Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Recent Views */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Recent Views</p>
                  <p className="text-3xl font-bold">{stats.recentViews}</p>
                  <p className="text-sm text-blue-200">Last 7 days</p>
                </div>
                <FiTrendingUp size={32} className="text-blue-200" />
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Engagement</p>
                  <p className="text-3xl font-bold">
                    {stats.totalViews > 0 ? Math.round((stats.recentViews / stats.totalViews) * 100) : 0}%
                  </p>
                  <p className="text-sm text-green-200">This week</p>
                </div>
                <FiActivity size={32} className="text-green-200" />
              </div>
            </div>

            {/* Portfolio Status */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Portfolio Status</p>
                  <p className="text-3xl font-bold">
                    {stats.projectsPublished > 0 ? 'Active' : 'Setup'}
                  </p>
                  <p className="text-sm text-purple-200">
                    {stats.projectsPublished > 0 ? 'Published' : 'Needs setup'}
                  </p>
                </div>
                <FiUsers size={32} className="text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Views Chart */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📊 Views Analytics</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last 7 Days</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total: {chartData.reduce((sum, day) => sum + day.views, 0)} views
              </div>
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {chartData.map((day, index) => {
                const maxViews = Math.max(...chartData.map(d => d.views), 1);
                const height = (day.views / maxViews) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t transition-all duration-500 hover:from-primary-600 hover:to-primary-500 cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${day.views} views`}
                      ></div>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-b"></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      {day.label}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {day.views}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">🕒 Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 6).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          activity.type === 'blog' ? 'bg-green-100 dark:bg-green-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          {activity.type === 'project' && <FiBriefcase className="text-blue-600 dark:text-blue-400" size={16} />}
                          {activity.type === 'blog' && <FiFileText className="text-green-600 dark:text-green-400" size={16} />}
                          {activity.type === 'message' && <FiMail className="text-purple-600 dark:text-purple-400" size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.type === 'project' && 'Project updated: '}
                            {activity.type === 'blog' && 'Blog post: '}
                            {activity.type === 'message' && 'New message from '}
                            {activity.title || activity.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(activity.updated_at || activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.updated_at || activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiActivity className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                </div>
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

