# 🎨 Media Upload Feature - Upgrade Guide

## Overview

The portfolio now supports **multiple images and videos** with a beautiful drag-and-drop interface! This is a major upgrade from the single image URL field.

## ✨ New Features

### 1. **Multiple Media Upload**
- Upload up to **10 images/videos per project**
- Mix images and videos in the same project
- Drag & drop or click to upload

### 2. **Instant Preview**
- See uploaded files immediately
- Automatic thumbnail generation for videos
- Loading indicators during upload

### 3. **Featured Media**
- Mark any image/video as "featured"
- Featured media shows as primary on portfolio page
- Easy to change with star icon

### 4. **Media Gallery**
- Beautiful thumbnail grid on portfolio page
- Click to view full-size in lightbox
- Navigate with arrows or keyboard (← →)
- Counter shows current position (e.g., "2 / 5")

### 5. **Supabase Storage Integration**
- Files uploaded directly to Supabase Storage
- Automatic unique filenames
- Public CDN URLs for fast loading
- Easy file management and deletion

## 🎯 User Interface

### Admin Panel - Add/Edit Project

```
┌─────────────────────────────────────────────────┐
│  Upload Area (Drag & Drop)                     │
│  ┌───────────────────────────────────────────┐ │
│  │         📤 Upload Icon                    │ │
│  │   Drag & drop files here                  │ │
│  │   or click to browse                      │ │
│  │   [Choose Files Button]                   │ │
│  │   0 / 10 files uploaded                   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Uploaded Media Grid                            │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │
│  │ 🖼️ │ │ 🎬 │ │ 🖼️ │ │ 🖼️ │                  │
│  │⭐  │ │    │ │    │ │    │                  │
│  └────┘ └────┘ └────┘ └────┘                  │
│  Hover to ⭐ (featured) or 🗑️ (delete)         │
└─────────────────────────────────────────────────┘
```

### Public Portfolio Page

```
┌─────────────────────────────────────────────────┐
│  Featured Image/Video (Large)                   │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │         [Main Project Image]              │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Thumbnail Gallery (if multiple)                │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                       │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │                       │
│  └───┘ └───┘ └───┘ └───┘                       │
│  Click thumbnails to view in lightbox           │
└─────────────────────────────────────────────────┘
```

## 📦 What's New in the Codebase

### New Files

1. **`src/utils/storageHelper.js`**
   - Upload/delete file functions
   - File validation (type, size)
   - Video thumbnail generator
   - Storage bucket integration

2. **`src/components/MediaUploader.jsx`**
   - Drag & drop upload UI
   - Live preview with thumbnails
   - Featured media selection
   - Progress indicators
   - Delete functionality

3. **`src/components/MediaGallery.jsx`**
   - Public-facing media display
   - Lightbox modal for full-size view
   - Keyboard navigation (← → ESC)
   - Thumbnail navigation
   - Video play button overlay

4. **`supabase/migrations/20250103000000_add_media_support_to_projects.sql`**
   - Adds `media` JSONB column
   - Adds `featured_media` text column
   - Migrates existing `image` data
   - Creates indexes for performance

5. **`SUPABASE_STORAGE_SETUP.md`**
   - Complete setup guide
   - Troubleshooting tips
   - Security best practices

### Updated Files

1. **`src/pages/admin/AdminPortfolio.jsx`**
   - Integrated MediaUploader component
   - Updated form submission to handle media array
   - Enhanced edit mode with media loading
   - Display media count on cards

2. **`src/pages/Portfolio.jsx`**
   - Integrated MediaGallery component
   - Backward compatible with old single-image projects
   - Better media display logic

## 🔄 Database Schema Changes

### New Columns

```sql
media JSONB -- Array of media objects
```

Example:
```json
[
  {
    "type": "image",
    "url": "https://supabase.co/storage/v1/object/public/project-media/projects/abc123.jpg",
    "thumbnail": "https://...",
    "featured": true
  },
  {
    "type": "video",
    "url": "https://supabase.co/storage/v1/object/public/project-media/projects/def456.mp4",
    "thumbnail": "data:image/jpeg;base64,...",
    "featured": false
  }
]
```

```sql
featured_media TEXT -- URL of featured media (for quick access)
```

### Backward Compatibility

✅ Old `image` column is **kept** for backward compatibility  
✅ Existing projects automatically work  
✅ Migration script converts old `image` to new `media` format  

## 🚀 Setup Instructions

### Step 1: Apply Database Migration

```bash
npm run db:push
```

This will:
- Add `media` and `featured_media` columns
- Migrate existing image data
- Create necessary indexes

### Step 2: Setup Supabase Storage

Follow the detailed guide in **`SUPABASE_STORAGE_SETUP.md`**

Quick steps:
1. Create bucket named `project-media` (public)
2. Set up storage policies (read, insert, delete)
3. Test upload in admin panel

### Step 3: Test the Feature

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Login to admin panel

3. Create/edit a project

4. Upload some images and videos

5. View the project on public portfolio page

## 🎨 UI/UX Highlights

### Drag & Drop Experience
- Highlight border when dragging files over
- Smooth animations
- Visual feedback during upload
- Error messages for invalid files

### Image Preview
- Instant thumbnail display
- Responsive grid layout
- Hover effects with actions
- Featured badge indicator
- Media type badges (image/video)

### Video Support
- Auto-thumbnail from first frame
- Play button overlay
- Full video player in lightbox
- Muted preview in thumbnails

### Lightbox Gallery
- Full-screen modal view
- Swipe/arrow navigation
- Image zoom and pan
- Video controls (play, pause, volume)
- ESC key to close
- Click outside to close

## 📊 File Support

### Supported Formats

**Images:**
- ✅ JPEG/JPG
- ✅ PNG
- ✅ GIF
- ✅ WebP

**Videos:**
- ✅ MP4 (recommended)
- ✅ MOV (QuickTime/Apple)
- ✅ WebM
- ✅ OGG

### File Limits

- **Max file size**: 50MB per file
- **Max files per project**: 10 files
- **Total storage (free tier)**: 1GB

## 🔐 Security Features

✅ **Client-side validation** - Type and size checks before upload  
✅ **Server-side RLS** - Supabase Row Level Security policies  
✅ **Authenticated uploads** - Only logged-in users can upload  
✅ **Public read** - Anyone can view uploaded media  
✅ **File sanitization** - Unique filenames prevent conflicts  

## 💡 Usage Tips

### For Best Results

1. **Featured Image**: Always set one image as featured - it shows first
2. **Image Quality**: Use high-quality images (1920x1080 or higher)
3. **Video Format**: MP4 works best across all browsers
4. **File Size**: Compress large files before uploading
5. **Multiple Angles**: Upload different views of your project
6. **Demo Videos**: Short demo videos are great for showcasing features

### Recommended Image Sizes

- **Featured**: 1920x1080 (landscape)
- **Thumbnails**: 800x600 (landscape)
- **Mobile**: 600x800 (portrait)

### Video Optimization

- **Resolution**: 1080p or 720p
- **Duration**: 30-60 seconds for demos
- **Compression**: Use H.264 codec
- **Audio**: Optional (usually muted on autoplay)

## 🐛 Troubleshooting

### "Upload failed" error
- Check internet connection
- Verify Supabase Storage is configured
- Check browser console for details

### Videos not playing
- Try MP4 format
- Check file size (< 50MB)
- Ensure video codec is H.264

### Thumbnails not showing
- Wait for upload to complete
- Refresh the page
- Check if file is valid video format

## 📈 Performance Optimizations

✅ **Lazy loading** - Images load as needed  
✅ **Thumbnail preview** - Smaller files for grid display  
✅ **CDN delivery** - Supabase provides global CDN  
✅ **Compressed uploads** - Files are optimized  
✅ **Efficient queries** - Database indexes for fast access  

## 🎉 Migration from Old System

If you have existing projects with single `image` field:

1. **Automatic migration**: Run `npm run db:push`
2. **No manual work needed**: Old images automatically converted to media array
3. **Edit mode**: Open old projects in admin panel to see images loaded
4. **Add more media**: Upload additional images/videos to existing projects
5. **Set featured**: Select which image should be featured

## 📚 Related Documentation

- **Setup Guide**: `SUPABASE_STORAGE_SETUP.md`
- **Main README**: `README.md`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`

---

🎊 **Enjoy the new media upload feature!** Your portfolio just got a major upgrade.

