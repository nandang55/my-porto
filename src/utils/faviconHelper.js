/**
 * Utility functions for managing favicon
 */

/**
 * Set favicon dynamically
 * @param {string} faviconUrl - URL of the favicon
 */
export const setFavicon = (faviconUrl) => {
  if (!faviconUrl) return;
  
  // Remove existing favicon links
  const existingFavicons = document.querySelectorAll("link[rel*='icon']");
  existingFavicons.forEach(favicon => favicon.remove());
  
  // Create new favicon link
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = faviconUrl;
  document.head.appendChild(link);
};

/**
 * Reset favicon to default
 */
export const resetFavicon = () => {
  // Remove existing favicon links
  const existingFavicons = document.querySelectorAll("link[rel*='icon']");
  existingFavicons.forEach(favicon => favicon.remove());
  
  // Set default favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = '/icon_bagdja_porto.png';
  document.head.appendChild(link);
};
