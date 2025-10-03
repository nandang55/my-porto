import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';

const MediaGallery = ({ media = [], title = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!media || media.length === 0) return null;

  const currentMedia = media[selectedIndex];

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
        onClick={() => openLightbox(0)}
      >
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.thumbnail || currentMedia.url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
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
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
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
                openLightbox(index);
              }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.thumbnail || item.url}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
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
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
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

