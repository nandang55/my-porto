import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiVideo, FiStar, FiFile, FiFileText, FiArchive, FiDownload } from 'react-icons/fi';
import { uploadFile, deleteFile, validateFile, getFileType, createVideoThumbnail } from '../utils/storageHelper';
import { useAlert } from '../context/AlertContext';

const MediaUploader = ({ media = [], onChange, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const alert = useAlert();

  // Get appropriate icon for file type
  const getFileIcon = (fileType, url, size = 12) => {
    if (fileType === 'image') return <FiImage size={size} />;
    if (fileType === 'video') return <FiVideo size={size} />;
    
    // For documents, check extension from URL
    if (fileType === 'document' && url) {
      const ext = url.toLowerCase().split('.').pop().split('?')[0];
      if (ext === 'pdf') return <FiFileText size={size} />;
      if (['doc', 'docx'].includes(ext)) return <FiFile size={size} />;
      if (['ppt', 'pptx'].includes(ext)) return <FiFile size={size} />; // Using FiFile for PPT
      if (['zip', 'rar'].includes(ext)) return <FiArchive size={size} />;
    }
    
    return <FiFile size={size} />; // Default document icon
  };

  // Get filename from URL
  const getFileName = (url) => {
    if (!url) return 'Document';
    return url.split('/').pop().split('?')[0];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await handleFiles(files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleFiles = async (files) => {
    if (media.length + files.length > maxFiles) {
      alert.warning(`You can only upload up to ${maxFiles} files`);
      return;
    }

    setUploading(true);
    const newMedia = [...media];

    for (const file of files) {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        alert.error(validation.error, 'Invalid File');
        continue;
      }

      try {
        const fileType = getFileType(file);
        
        // Create preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        
        // For videos, generate thumbnail
        let thumbnail = previewUrl;
        if (fileType === 'video') {
          try {
            thumbnail = await createVideoThumbnail(file);
          } catch (error) {
            console.error('Failed to generate thumbnail:', error);
          }
        }

        // Add loading placeholder
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const tempMedia = {
          id: tempId,
          type: fileType,
          url: previewUrl,
          thumbnail: thumbnail,
          uploading: true,
          featured: newMedia.length === 0, // First one is featured
        };
        
        newMedia.push(tempMedia);
        onChange(newMedia);

        // Upload to Supabase
        const { url, path, error } = await uploadFile(file);

        if (error) {
          throw error;
        }

        // Update with actual URL
        const index = newMedia.findIndex(m => m.id === tempId);
        if (index !== -1) {
          newMedia[index] = {
            type: fileType,
            url: url,
            path: path,
            thumbnail: fileType === 'video' ? thumbnail : url,
            featured: newMedia[index].featured,
            uploading: false,
          };
          onChange([...newMedia]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert.error('Failed to upload file. Please try again.', 'Upload Failed');
        // Remove failed upload
        const filtered = newMedia.filter(m => !m.uploading);
        onChange(filtered);
      }
    }

    setUploading(false);
  };

  const handleRemove = async (index) => {
    const mediaItem = media[index];
    
    // Delete from Supabase if it has a path
    if (mediaItem.path) {
      await deleteFile(mediaItem.path);
    }

    const newMedia = media.filter((_, i) => i !== index);
    
    // If removed item was featured, make first item featured
    if (mediaItem.featured && newMedia.length > 0) {
      newMedia[0].featured = true;
    }
    
    onChange(newMedia);
  };

  const handleSetFeatured = (index) => {
    const newMedia = media.map((item, i) => ({
      ...item,
      featured: i === index,
    }));
    onChange(newMedia);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.zip,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <FiUpload className="text-primary-600 dark:text-primary-400" size={32} />
          </div>
          
          <div>
            <p className="text-lg font-medium mb-1">
              {dragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              or click to browse (Images, Videos, PDF, DOCX, PPT, ZIP - max 50MB)
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || media.length >= maxFiles}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </button>
          </div>
          
          <p className="text-xs text-gray-400">
            {media.length} / {maxFiles} files uploaded
          </p>
        </div>
      </div>

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <div
              key={item.id || index}
              className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square"
            >
              {/* Media Preview */}
              {item.type === 'image' ? (
                <img
                  src={item.uploading ? item.url : item.thumbnail || item.url}
                  alt={`Upload ${index + 1}`}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <FiVideo className="text-white" size={32} />
                  </div>
                </div>
              ) : (
                // Document preview
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                  <div className="text-blue-600 dark:text-blue-300 mb-2">
                    {getFileIcon(item.type, item.url, 32)}
                  </div>
                  <div className="text-xs text-blue-800 dark:text-blue-200 text-center px-2 break-all">
                    {getFileName(item.url)}
                  </div>
                </div>
              )}

              {/* Uploading Overlay */}
              {item.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}

              {/* Featured Badge */}
              {item.featured && !item.uploading && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <FiStar size={12} /> Featured
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                {getFileIcon(item.type, item.url)}
                {item.type}
              </div>

              {/* Hover Actions */}
              {!item.uploading && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* Download Button - Available for all files */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    title="Download"
                  >
                    <FiDownload size={16} />
                  </a>
                  
                  {/* Featured Button - Only for images and videos */}
                  {item.type !== 'document' && !item.featured && (
                    <button
                      type="button"
                      onClick={() => handleSetFeatured(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors"
                      title="Set as featured"
                    >
                      <FiStar size={16} />
                    </button>
                  )}
                  
                  {/* Remove Button - Available for all files */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    title="Remove"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      {media.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Click the star icon to set a featured image/video. Featured media will be shown as the main preview.
        </p>
      )}
    </div>
  );
};

export default MediaUploader;

