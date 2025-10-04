import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { getTextPreview } from '../utils/textHelpers';

const BlogCard = ({ post, index = 0, baseUrl = '', themeColor = '#0284c7', showAnimation = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now - postDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <Link
      to={`${baseUrl}/blog/${post.slug}`}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden block"
      style={{ 
        animationDelay: showAnimation ? `${index * 0.1}s` : '0s'
      }}
    >
      {/* Cover Image */}
      {post.cover_image ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div 
          className="h-48 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${themeColor}dd 0%, ${themeColor}99 100%)`
          }}
        >
          <span className="text-6xl opacity-50">📝</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />
            <span>{formatTimeAgo(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock size={14} />
            <span>{getReadingTime(post.content)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt || getTextPreview(post.content, 150)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiEye size={14} />
            <span>{post.view_count || 0} views</span>
          </div>
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium group-hover:gap-3 transition-all">
            <span>Read more</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

