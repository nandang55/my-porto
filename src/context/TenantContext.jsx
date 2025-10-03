import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

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

    // Method 1: Detect from subdomain (e.g., nandang.portofolio.bagdja.com)
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Check if subdomain pattern: {slug}.portofolio.bagdja.com
    if (parts.length >= 3 && parts[parts.length - 3] === 'portofolio' && parts[parts.length - 2] === 'bagdja') {
      slug = parts[0]; // First part is the slug
    } 
    // Check for other subdomain patterns (not localhost, not www)
    else if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      slug = parts[0];
    }
    // Method 2: Detect from path (e.g., /nandang)
    else {
      const pathParts = location.pathname.split('/').filter(Boolean);
      const knownRoutes = ['portfolio', 'blog', 'about', 'contact'];
      
      if (pathParts.length === 0 || knownRoutes.includes(pathParts[0])) {
        setCurrentTenant(null);
        setLoading(false);
        return;
      }
      
      slug = pathParts[0];
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
    } catch (error) {
      console.error('Error fetching tenant:', error);
      setCurrentTenant(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshTenant = async () => {
    await detectTenant();
  };

  const value = {
    currentTenant,
    loading,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

