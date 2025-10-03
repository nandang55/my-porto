/**
 * Strip HTML tags from string and return plain text
 * @param {string} html - HTML string
 * @returns {string} Plain text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // Get text content (automatically strips HTML)
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 200)
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Truncate and add ellipsis
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Extract plain text from HTML and truncate to specified length
 * @param {string} html - HTML string
 * @param {number} maxLength - Maximum length (default: 200)
 * @returns {string} Plain text preview
 */
export const getTextPreview = (html, maxLength = 200) => {
  const plainText = stripHtml(html);
  return truncateText(plainText, maxLength);
};
