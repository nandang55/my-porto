import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay, FiFile, FiFileText, FiArchive, FiDownload } from 'react-icons/fi';

const MediaGallery = ({ media = [], title = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!media || media.length === 0) return null;

  const currentMedia = media[selectedIndex];

  // Get appropriate icon for document type
  const getDocumentIcon = (url, size = 48) => {
    if (!url) return <FiFile size={size} />;
    const ext = url.toLowerCase().split('.').pop().split('?')[0];
    if (ext === 'pdf') return <FiFileText size={size} />;
    if (['doc', 'docx'].includes(ext)) return <FiFile size={size} />;
    if (['ppt', 'pptx'].includes(ext)) return <FiFile size={size} />;
    if (['zip', 'rar'].includes(ext)) return <FiArchive size={size} />;
    return <FiFile size={size} />;
  };

  // Get filename from URL
  const getFileName = (url) => {
    if (!url) return 'Document';
    return url.split('/').pop().split('?')[0];
  };

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      {/* Main Featured Media */}
      <div 
        className="relative overflow-hidden rounded-lg mb-4 h-64 cursor-pointer group"
        onClick={() => currentMedia.type === 'document' ? null : openLightbox(0)}
      >
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.thumbnail || currentMedia.url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : currentMedia.type === 'video' ? (
          <div className="relative w-full h-full">
            <video
              src={currentMedia.url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <FiPlay className="text-gray-900 ml-1" size={24} />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex flex-col items-center justify-center p-6">
            <div className="text-blue-600 dark:text-blue-300 mb-4">
              {getDocumentIcon(currentMedia.url, 64)}
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200 text-center mb-4 font-medium max-w-full break-all px-4">
              {getFileName(currentMedia.url)}
            </div>
            <a
              href={currentMedia.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
            >
              <FiDownload size={20} />
              Download File
            </a>
          </div>
        )}
        
        {/* Hover overlay */}
        {currentMedia.type !== 'document' && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        )}
      </div>

      {/* Thumbnail Grid (if multiple media) */}
      {media.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {media.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded cursor-pointer aspect-square border-2 transition-all duration-200 ${
                selectedIndex === index
                  ? 'border-primary-500 scale-95'
                  : 'border-transparent hover:border-primary-300'
              }`}
              onClick={() => {
                setSelectedIndex(index);
                if (item.type !== 'document') {
                  openLightbox(index);
                }
              }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.thumbnail || item.url}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : item.type === 'video' ? (
                <div className="relative w-full h-full">
                  {item.thumbnail && item.thumbnail.startsWith('data:') ? (
                    <img
                      src={item.thumbnail}
                      alt={`Video ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <FiPlay className="text-white" size={20} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                  <div className="text-blue-600 dark:text-blue-300">
                    {getDocumentIcon(item.url, 24)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <FiX size={32} />
          </button>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 z-50"
              >
                <FiChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 z-50"
              >
                <FiChevronRight size={32} />
              </button>
            </>
          )}

          {/* Media Display */}
          <div
            className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={`${title} ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-2xl mx-auto flex flex-col items-center">
                <div className="text-blue-600 dark:text-blue-400 mb-6">
                  {getDocumentIcon(currentMedia.url, 96)}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-8 break-all px-4">
                  {getFileName(currentMedia.url)}
                </div>
                <a
                  href={currentMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-xl text-lg"
                >
                  <FiDownload size={24} />
                  Download File
                </a>
              </div>
            )}
          </div>

          {/* Counter */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {selectedIndex + 1} / {media.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MediaGallery;

