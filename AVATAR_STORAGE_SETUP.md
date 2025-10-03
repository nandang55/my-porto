# Storage Setup Guide (Avatar, Resume, Cover & Favicon)

## 🎯 Overview
This guide explains how to set up Supabase Storage for avatar, resume/CV, cover image, and favicon uploads in the Portfolio Settings.

## 📦 Create Storage Bucket

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**

### Step 2: Create "avatars" Bucket
Configure the bucket with these settings:

- **Name:** `avatars`
- **Public:** ✅ **Yes** (Enable public access)
- **File size limit:** 5MB (5242880 bytes)
- **Allowed MIME types:** `image/*` (all image types)

### Step 3: Set Bucket Policies (RLS)

Go to **Storage** → **Policies** → **avatars bucket** and create these policies:

#### 1. Allow Authenticated Users to Upload
```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### 2. Allow Authenticated Users to Update
```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### 3. Allow Authenticated Users to Delete
```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### 4. Allow Public Read Access
```sql
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## 📁 Storage Structure

Avatars are stored in this structure:
```
avatars/
  ├── {user_id}/
  │   ├── 1234567890.jpg
  │   ├── 1234567891.png
  │   └── ...
  ├── {another_user_id}/
  │   └── ...
```

## 🎨 Upload Features

### Supported Formats
- ✅ JPG / JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP
- ✅ SVG

### Validation
- **Max file size:** 5MB
- **File type:** Must be an image
- **Auto-delete:** Old avatar is deleted when uploading a new one

### Upload Process
1. User selects image file
2. Preview shown immediately
3. File validated (type & size)
4. On save:
   - Old avatar deleted from storage
   - New avatar uploaded to `{user_id}/{timestamp}.{ext}`
   - Public URL saved to `portfolios.avatar_url`

## 🔧 Code Implementation

### File: `src/pages/admin/Settings.jsx`

**Key Functions:**
- `handleAvatarChange(e)` - Handle file selection & preview
- `uploadAvatar()` - Upload to Supabase Storage
- `removeAvatar()` - Clear selection
- Auto-upload on form submit

## 🌐 Public URL Format

Uploaded avatars are accessible via:
```
https://{your-project}.supabase.co/storage/v1/object/public/avatars/{user_id}/{filename}
```

## ✅ Testing

1. Go to `/admin/settings`
2. Click "Choose Image" button
3. Select an image (< 5MB)
4. See preview appear
5. Click "Save Settings"
6. Avatar should upload and URL saved to database

## 🛡️ Security

- Each user can only upload/update/delete their own avatars
- Files are organized by user ID
- Public read access for portfolio display
- File type and size validation

## 🔄 Migration

If migrating from URL-based avatars:
- Old URL avatars will continue to work
- Users can upload new images to replace them
- No data loss

## 📊 Storage Usage

Monitor storage usage in:
**Supabase Dashboard** → **Storage** → **avatars** → **Usage**

---

## 📄 Resume/CV Storage Bucket

### Create "resumes" Bucket

Follow the same steps to create a **resumes** bucket:

1. **Name:** `resumes`
2. **Public:** ✅ **Yes**
3. **File size limit:** 10MB (10485760 bytes)
4. **Allowed MIME types:** `application/pdf`

### Resume Bucket Policies (RLS)

```sql
-- Allow users to upload their own resume
CREATE POLICY "Users can upload their own resume"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own resume
CREATE POLICY "Users can update their own resume"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own resume
CREATE POLICY "Users can delete their own resume"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access
CREATE POLICY "Public can view resumes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'resumes');
```

### Resume Storage Structure

```
resumes/
  ├── {user_id}/
  │   ├── resume_1704264000000.pdf
  │   └── resume_1704264123456.pdf
```

### Resume Upload Features

**Supported Format:**
- ✅ PDF only

**Validation:**
- **Max file size:** 10MB
- **File type:** PDF only
- **Auto-delete:** Old resume deleted when uploading new one

**Upload Process:**
1. User selects PDF file
2. File name and size displayed
3. File validated (type & size)
4. On save:
   - Old resume deleted from storage
   - New resume uploaded to `{user_id}/resume_{timestamp}.pdf`
   - Public URL saved to `portfolios.resume_url`

### Resume Public URL Format

```
https://{your-project}.supabase.co/storage/v1/object/public/resumes/{user_id}/resume_{timestamp}.pdf
```

---

## 📷 Cover Image Storage Bucket

### Create "covers" Bucket

1. **Name:** `covers`
2. **Public:** ✅ **Yes**
3. **File size limit:** 5MB (5242880 bytes)
4. **Allowed MIME types:** `image/*`

### Cover Bucket Policies (RLS)

```sql
-- Allow users to upload their own cover
CREATE POLICY "Users can upload their own cover"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'covers' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own cover
CREATE POLICY "Users can update their own cover"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'covers' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own cover
CREATE POLICY "Users can delete their own cover"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'covers' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access
CREATE POLICY "Public can view covers"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'covers');
```

### Cover Storage Structure

```
covers/
  ├── {user_id}/
  │   ├── cover_1704264000000.jpg
  │   └── cover_1704264123456.png
```

### Cover Image Features

**Recommended:**
- Size: 1920x600px (or similar wide banner)
- Formats: JPG, PNG, WebP, GIF
- Max size: 5MB

**Usage:**
- Displayed as hero section background
- Color overlay applied for better text contrast
- Falls back to gradient if not set

---

## 🎨 Favicon Storage Bucket

### Create "favicons" Bucket

1. **Name:** `favicons`
2. **Public:** ✅ **Yes**
3. **File size limit:** 1MB (1048576 bytes)
4. **Allowed MIME types:** `image/*`

### Favicon Bucket Policies (RLS)

```sql
-- Allow users to upload their own favicon
CREATE POLICY "Users can upload their own favicon"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'favicons' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own favicon
CREATE POLICY "Users can update their own favicon"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'favicons' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own favicon
CREATE POLICY "Users can delete their own favicon"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'favicons' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access
CREATE POLICY "Public can view favicons"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'favicons');
```

### Favicon Storage Structure

```
favicons/
  ├── {user_id}/
  │   ├── favicon_1704264000000.png
  │   └── favicon_1704264123456.ico
```

### Favicon Features

**Recommended:**
- Size: 32x32px or 64x64px
- Formats: PNG, ICO, SVG
- Max size: 1MB

**Usage:**
- Dynamically set via JavaScript
- Appears in browser tab
- Shows in bookmarks

---

## 📦 Summary: Required Storage Buckets

Create these 4 buckets in Supabase Storage:

1. **avatars** - User profile pictures (5MB, public)
2. **resumes** - PDF resumes/CVs (10MB, public)
3. **covers** - Hero banner images (5MB, public)
4. **favicons** - Browser tab icons (1MB, public)

All buckets should have:
- ✅ Public access enabled
- ✅ RLS policies for user isolation
- ✅ Public read policy

---

**Last Updated:** 2025-01-03

