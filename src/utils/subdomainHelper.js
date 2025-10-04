/**
 * Subdomain Helper Utilities
 * Detects and parses subdomain from URL for multi-tenant routing
 */

/**
 * Get the subdomain from current hostname
 * @returns {string|null} - Subdomain or null if not found
 * 
 * Examples:
 * - poppy.porto.bagdja.com → "poppy"
 * - porto.bagdja.com → null
 * - localhost:5173 → null
 * - www.porto.bagdja.com → null
 */
export const getSubdomain = () => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Handle localhost and IP addresses
  if (
    hostname === 'localhost' || 
    hostname.includes('127.0.0.1') || 
    hostname.includes('192.168.') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname) // IP address pattern
  ) {
    return null;
  }
  
  // Split hostname into parts
  const parts = hostname.split('.');
  
  // Need at least 3 parts for subdomain: [subdomain].[domain].[tld]
  // Or 4+ for: [subdomain].[domain].[domain].[tld] (e.g., poppy.porto.bagdja.com)
  if (parts.length < 3) {
    return null;
  }
  
  // Get first part (potential subdomain)
  const potentialSubdomain = parts[0];
  
  // Exclude common non-tenant subdomains
  const excludedSubdomains = ['www', 'porto', 'admin', 'api', 'cdn', 'assets'];
  
  if (excludedSubdomains.includes(potentialSubdomain)) {
    return null;
  }
  
  // Valid subdomain found
  return potentialSubdomain;
};

/**
 * Check if current URL is using subdomain
 * @returns {boolean}
 */
export const isSubdomain = () => {
  return getSubdomain() !== null;
};

/**
 * Get tenant slug from either subdomain or URL path
 * Priority: subdomain > path
 * @returns {string|null} - Tenant slug or null
 * 
 * Examples:
 * - poppy.porto.bagdja.com → "poppy" (from subdomain)
 * - porto.bagdja.com/john → "john" (from path)
 * - poppy.porto.bagdja.com/john → "poppy" (subdomain takes priority)
 */
export const getTenantSlug = () => {
  // Try subdomain first
  const subdomain = getSubdomain();
  if (subdomain) {
    return subdomain;
  }
  
  // Fallback to path-based slug
  if (typeof window === 'undefined') return null;
  
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  
  // First path segment could be tenant slug
  // But exclude admin routes
  if (pathParts.length > 0 && pathParts[0] !== 'admin') {
    return pathParts[0];
  }
  
  return null;
};

/**
 * Build tenant URL based on current environment
 * @param {string} slug - Tenant slug
 * @param {string} path - Additional path (e.g., "/projects", "/blog")
 * @returns {string} - Full URL
 * 
 * Examples:
 * - buildTenantUrl("poppy", "/projects") → "https://poppy.porto.bagdja.com/projects"
 * - buildTenantUrl("poppy") → "https://poppy.porto.bagdja.com"
 */
export const buildTenantUrl = (slug, path = '') => {
  if (typeof window === 'undefined') return '';
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  
  // Development: use path-based
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    const portPart = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portPart}/${slug}${path}`;
  }
  
  // Production: use subdomain
  // Extract base domain (porto.bagdja.com)
  const parts = hostname.split('.');
  const baseDomain = parts.slice(-3).join('.'); // porto.bagdja.com or bagdja.com
  
  return `${protocol}//${slug}.${baseDomain}${path}`;
};

/**
 * Check if hostname matches expected pattern
 * @param {string} pattern - Expected pattern (e.g., "porto.bagdja.com")
 * @returns {boolean}
 */
export const matchesDomain = (pattern) => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname.includes(pattern);
};

/**
 * Get base domain without subdomain
 * @returns {string} - Base domain
 * 
 * Examples:
 * - poppy.porto.bagdja.com → "porto.bagdja.com"
 * - www.porto.bagdja.com → "porto.bagdja.com"
 * - porto.bagdja.com → "porto.bagdja.com"
 */
export const getBaseDomain = () => {
  if (typeof window === 'undefined') return '';
  
  const hostname = window.location.hostname;
  
  // Localhost
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return hostname;
  }
  
  // Extract last 2-3 parts
  const parts = hostname.split('.');
  
  // If 4+ parts (subdomain.porto.bagdja.com), take last 3
  if (parts.length >= 4) {
    return parts.slice(-3).join('.');
  }
  
  // If 3 parts (porto.bagdja.com), return as is
  if (parts.length === 3) {
    return hostname;
  }
  
  // If 2 parts (bagdja.com), return as is
  return hostname;
};

/**
 * Redirect to subdomain version of tenant
 * @param {string} slug - Tenant slug
 * @param {string} path - Additional path
 */
export const redirectToSubdomain = (slug, path = '') => {
  if (typeof window === 'undefined') return;
  
  const url = buildTenantUrl(slug, path);
  window.location.href = url;
};

