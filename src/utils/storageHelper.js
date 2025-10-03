import { supabase } from '../services/supabase';

const BUCKET_NAME = 'project-media'; // Supabase storage bucket name

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder path (e.g., 'projects', 'blog')
 * @returns {Promise<{url: string, path: string, error: any}>}
 */
export const uploadFile = async (file, folder = 'projects') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { url: null, path: null, error };
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - The file path to delete
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const deleteFile = async (filePath) => {
  try {
    // Extract path from URL if full URL is provided
    const path = filePath.includes(BUCKET_NAME) 
      ? filePath.split(`${BUCKET_NAME}/`)[1] 
      : filePath;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error };
  }
};

/**
 * Get file type from file object or URL
 * @param {File|string} file - File object or URL
 * @returns {string} - 'image' or 'video'
 */
export const getFileType = (file) => {
  if (file instanceof File) {
    return file.type.startsWith('image/') ? 'image' : 'video';
  }
  
  // If it's a URL/string, check extension
  const ext = file.toLowerCase().split('.').pop().split('?')[0];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'm4v'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  return 'unknown';
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error: string}}
 */
export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov files
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload images (JPG, PNG, GIF, WebP) or videos (MP4, WebM, OGG, MOV).',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 50MB limit.',
    };
  }

  return { valid: true, error: null };
};

/**
 * Create thumbnail from video file (generates preview from first frame)
 * @param {File} file - Video file
 * @returns {Promise<string>} - Data URL of thumbnail
 */
export const createVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      // Seek to 1 second or 10% of duration
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    };

    video.onerror = () => {
      reject(new Error('Failed to generate video thumbnail'));
    };

    video.src = URL.createObjectURL(file);
  });
};

