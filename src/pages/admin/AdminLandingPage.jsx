import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import AdvancedLandingPageBuilder from '../../components/AdvancedLandingPageBuilder';
import AdminNavbar from '../../components/AdminNavbar';
import BackButton from '../../components/BackButton';
import { FiPlus } from 'react-icons/fi';

const AdminLandingPage = () => {
  const { user } = useAuth();
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLandingPageUpdate = (updatedLandingPage) => {
    console.log('AdminLandingPage received update:', updatedLandingPage);
    setLandingPage(updatedLandingPage);
  };

  useEffect(() => {
    if (user) {
      fetchLandingPage();
    }
  }, [user]);

  const fetchLandingPage = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching landing page:', error);
      }

      setLandingPage(data);
    } catch (error) {
      console.error('Error fetching landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLandingPage = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          user_id: user.id,
          title: 'My Landing Page',
          slug: `landing-${Date.now()}`,
          content: [],
          is_active: true,
          meta_title: 'My Landing Page',
          meta_description: 'Custom landing page built with BagdjaPorto'
        })
        .select()
        .single();

      if (error) throw error;

      setLandingPage(data);
    } catch (error) {
      console.error('Error creating landing page:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      {!landingPage ? (
        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <BackButton iconOnly={true} size={32} />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Landing Page Builder
                </h1>
              </div>
            </div>

            {/* Create Landing Page */}
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiPlus className="text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Create Your Landing Page
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Build a beautiful, custom landing page for your portfolio using our drag-and-drop builder.
                </p>
                <button
                  onClick={createLandingPage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Create Landing Page
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Website Builder */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <AdvancedLandingPageBuilder landingPage={landingPage} onUpdate={handleLandingPageUpdate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandingPage;
