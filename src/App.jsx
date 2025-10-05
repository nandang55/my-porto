import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { TenantProvider } from './context/TenantContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { getSubdomain } from './utils/subdomainHelper';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PublicPortfolio from './pages/PublicPortfolio';
import TenantBlog from './pages/TenantBlog';
import TenantBlogDetail from './pages/TenantBlogDetail';
import TenantProjectDetail from './pages/TenantProjectDetail';
import TenantAbout from './pages/TenantAbout';
import TenantContact from './pages/TenantContact';
import LandingPageRenderer from './components/LandingPageRenderer';

// Admin Pages
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Dashboard from './pages/admin/Dashboard';
import AdminLandingPage from './pages/admin/AdminLandingPage';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import ProjectForm from './pages/admin/ProjectForm';
import AdminBlog from './pages/admin/AdminBlog';
import BlogForm from './pages/admin/BlogForm';
import AdminMessages from './pages/admin/AdminMessages';
import Settings from './pages/admin/Settings';

// Subdomain Router Component
const SubdomainRouter = ({ children }) => {
  const subdomain = getSubdomain();
  
  // Debug logging
  console.log('=== SubdomainRouter Debug ===');
  console.log('Hostname:', window.location.hostname);
  console.log('Pathname:', window.location.pathname);
  console.log('Detected subdomain:', subdomain);
  console.log('Using subdomain routing:', !!subdomain);
  console.log('============================');
  
  // If subdomain detected, render tenant routes only
  if (subdomain) {
    console.log('✅ Subdomain mode activated for:', subdomain);
    return (
      <Routes>
        {/* Root path on subdomain goes to landing page */}
        <Route path="/" element={<LandingPageRenderer tenantSlug={subdomain} />} />
        
        {/* Tenant-specific routes */}
        <Route path="/projects" element={<PublicPortfolio />} />
        <Route path="/project/:slug" element={<TenantProjectDetail />} />
        <Route path="/blog" element={<TenantBlog />} />
        <Route path="/blog/:slug" element={<TenantBlogDetail />} />
        <Route path="/about" element={<TenantAbout />} />
        <Route path="/contact" element={<TenantContact />} />
        
        {/* Admin routes still accessible on subdomain */}
        <Route path="/admin/*" element={children} />
        
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  
  // No subdomain: render normal routes
  console.log('ℹ️ Normal routing mode (no subdomain)');
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AlertProvider>
          <Router>
            <TenantProvider>
              <SubdomainRouter>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/landing" element={<LandingPageRenderer />} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/landing-page"
              element={
                <ProtectedRoute>
                  <AdminLandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolio/new"
              element={
                <ProtectedRoute>
                  <ProjectForm key="new" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolio/edit/:id"
              element={
                <ProtectedRoute>
                  <ProjectForm key="edit" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolio"
              element={
                <ProtectedRoute>
                  <AdminPortfolio key="list" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/new"
              element={
                <ProtectedRoute>
                  <BlogForm key="new" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <ProtectedRoute>
                  <BlogForm key="edit" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute>
                  <AdminBlog key="list" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <AdminMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

                {/* Tenant Routes */}
                <Route path="/:slug" element={<PublicPortfolio />} />
                <Route path="/:slug/projects" element={<PublicPortfolio />} />
                <Route path="/:slug/project/:projectSlug" element={<TenantProjectDetail />} />
                <Route path="/:slug/blog" element={<TenantBlog />} />
                <Route path="/:slug/blog/:postSlug" element={<TenantBlogDetail />} />
                <Route path="/:slug/about" element={<TenantAbout />} />
                <Route path="/:slug/contact" element={<TenantContact />} />

                {/* 404 Not Found */}
                <Route
                  path="*"
                  element={
                    <Layout>
                      <div className="container mx-auto px-4 py-20 text-center">
                        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                          The page you're looking for doesn't exist.
                        </p>
                        <a href="/" className="btn-primary">
                          Go Home
                        </a>
                      </div>
                    </Layout>
                  }
                />
              </Routes>
              </SubdomainRouter>
            </TenantProvider>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
