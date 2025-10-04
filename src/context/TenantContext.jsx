import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { getSubdomain, isSubdomain } from '../utils/subdomainHelper';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [hasLandingPage, setHasLandingPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    detectTenant();
  }, [location.pathname]);

  const detectTenant = async () => {
    // Skip tenant detection for admin routes
    if (location.pathname.startsWith('/admin')) {
      setCurrentTenant(null);
      setLoading(false);
      return;
    }

    let slug = null;

    // Method 1: Detect from subdomain (Priority)
    const subdomain = getSubdomain();
    if (subdomain) {
      slug = subdomain;
      console.log('Detected tenant from subdomain:', slug);
    } 
    // Method 2: Detect from path (Fallback)
    else {
      const pathParts = location.pathname.split('/').filter(Boolean);
      const knownRoutes = ['about', 'contact'];
      
      if (pathParts.length === 0 || knownRoutes.includes(pathParts[0])) {
        setCurrentTenant(null);
        setLoading(false);
        return;
      }
      
      slug = pathParts[0];
      console.log('Detected tenant from path:', slug);
    }

    if (!slug) {
      setCurrentTenant(null);
      setLoading(false);
      return;
    }

    try {
      // Fetch portfolio by slug
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setCurrentTenant(data);
      
      // Check if tenant has an active landing page
      if (data?.user_id) {
        await checkLandingPage(data.user_id);
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
      setCurrentTenant(null);
      setHasLandingPage(false);
    } finally {
      setLoading(false);
    }
  };

  const checkLandingPage = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking tenant landing page:', error);
      }

      setHasLandingPage(data && data.length > 0);
    } catch (error) {
      console.error('Error checking tenant landing page:', error);
      setHasLandingPage(false);
    }
  };

  const refreshTenant = async () => {
    await detectTenant();
  };

  const value = {
    currentTenant,
    hasLandingPage,
    loading,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

