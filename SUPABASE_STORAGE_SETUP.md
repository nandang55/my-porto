# Supabase Storage Setup Guide

This guide will help you setup Supabase Storage for uploading images and videos in your portfolio projects.

## 📋 Prerequisites

- Supabase account (free tier is enough)
- Project already created in Supabase
- `.env` file with Supabase credentials configured

## 🚀 Step-by-Step Setup

### Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section in the left sidebar
3. Click **"New Bucket"** button
4. Create a new bucket with these settings:
   - **Name**: `project-media`
   - **Public bucket**: ✅ **Yes** (Enable this to allow public access to uploaded files)
   - Click **"Create bucket"**

### Step 2: Configure Storage Policies (RLS)

After creating the bucket, you need to set up policies for file access.

#### **Method 1: Using SQL (Recommended - Fastest)**

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste the content from `supabase/storage_policies.sql`
3. Click **"Run"**
4. Done! ✅

Or manually run this SQL:

```sql
-- Policy 1: Allow public to read/view files
CREATE POLICY "Public read access for project-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-media');

-- Policy 2: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload to project-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-media');

-- Policy 3: Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete from project-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-media');
```

#### **Method 2: Using UI (Manual)**

1. Click on the `project-media` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"** → **"For full customization"**

**Policy 1: Public Read Access**
   - **Policy name**: `Public read access for project-media`
   - **Allowed operation**: ☑️ **SELECT** only
   - **Target roles**: `public` 
   - **USING expression**: `bucket_id = 'project-media'`
   - Click **"Review"** then **"Save policy"**

**Policy 2: Authenticated Upload**
   - **Policy name**: `Authenticated users can upload to project-media`
   - **Allowed operation**: ☑️ **INSERT** only
   - **Target roles**: `authenticated`
   - **WITH CHECK expression**: `bucket_id = 'project-media'`
   - Click **"Review"** then **"Save policy"**

**Policy 3: Authenticated Delete**
   - **Policy name**: `Authenticated users can delete from project-media`
   - **Allowed operation**: ☑️ **DELETE** only
   - **Target roles**: `authenticated`
   - **USING expression**: `bucket_id = 'project-media'`
   - Click **"Review"** then **"Save policy"**

### Step 3: Configure File Size Limits (Optional)

By default, Supabase allows up to 50MB per file. To change this:

1. Go to **Settings** → **Storage**
2. Adjust **Maximum file size** if needed
3. Click **"Save"**

### Step 4: Apply Database Migration

Run the migration to add media support to your projects table:

```bash
npm run db:push
```

This will add the `media` and `featured_media` columns to your `projects` table.

### Step 5: Test the Upload

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to **Admin Panel** (`http://localhost:5173/admin/login`)

3. Login with your credentials

4. Navigate to **Manage Portfolio**

5. Click **"Add Project"**

6. Try uploading an image or video:
   - Drag & drop files into the upload area
   - Or click "Choose Files" to browse
   - Files will be automatically uploaded to Supabase Storage
   - You'll see preview thumbnails immediately

## 🎨 Features

### Supported File Types

**Images:**
- JPG/JPEG
- PNG
- GIF
- WebP

**Videos:**
- MP4
- MOV (QuickTime)
- WebM
- OGG

### File Size Limits

- Maximum: **50MB per file**
- Maximum files per project: **10 files**

### Upload Features

✅ **Drag & Drop** - Drag files directly into the upload area  
✅ **Multiple Upload** - Upload multiple files at once  
✅ **Auto Upload** - Files upload immediately when selected  
✅ **Live Preview** - See thumbnails instantly  
✅ **Video Thumbnails** - Automatic thumbnail generation for videos  
✅ **Featured Media** - Mark one file as featured/primary  
✅ **Delete Support** - Remove uploaded files  
✅ **Progress Indication** - Visual feedback during upload  

## 🗄️ Storage Structure

Files are organized in this structure:

```
project-media/
└── projects/
    ├── abc123_1234567890.jpg
    ├── def456_1234567891.mp4
    ├── ghi789_1234567892.png
    └── ...
```

Each filename is unique with random prefix + timestamp to prevent conflicts.

## 🔧 Troubleshooting

### Issue: "Error 400 - Bad Request" ⚠️

This is the most common error! Usually caused by missing or incorrect policies.

**Solution:**
1. **Run the SQL script**: Copy content from `supabase/storage_policies.sql` and run in SQL Editor
2. **Verify policies**: Go to Storage → project-media → Policies tab
3. **Should see 3 policies**:
   - ✅ Public read access (SELECT)
   - ✅ Authenticated upload (INSERT)  
   - ✅ Authenticated delete (DELETE)
4. **Logout and login again** in admin panel
5. **Try upload again**

**Check browser console** for exact error:
```javascript
// Open Chrome DevTools (F12) → Console
// Look for error like:
// "new row violates row-level security policy"
```

### Issue: "Failed to upload file"

**Solution:**
- Check if bucket name is correct in `src/utils/storageHelper.js` (should be `project-media`)
- Verify storage policies are set correctly (run SQL script above)
- Check browser console for detailed error messages
- Make sure bucket is set to **Public** ✅

### Issue: "Permission denied" or "401 Unauthorized"

**Solution:**
- Make sure you're **logged in** as admin
- **Logout and login again** to refresh token
- Check if authenticated upload policy is enabled
- Verify your user has `authenticated` role in Supabase
- Check browser console: `await supabase.auth.getUser()`

### Issue: "File size too large"

**Solution:**
- Reduce file size (max 50MB)
- Compress images/videos before uploading
- Consider using cloud storage for very large files

### Issue: "Storage bucket not found"

**Solution:**
- Double-check bucket name is exactly `project-media`
- Make sure bucket is created in the correct Supabase project
- Verify your `.env` credentials point to the right project

## 📊 Storage Usage

To monitor your storage usage:

1. Go to Supabase Dashboard
2. Navigate to **Storage** → **project-media**
3. Check **Usage** section at the top

**Free Tier Limits:**
- Storage: 1GB
- Bandwidth: 2GB/month

## 🔐 Security Best Practices

1. ✅ **Never expose** your `service_role` key in frontend code
2. ✅ **Always use** `anon` key for client-side uploads
3. ✅ **Enable RLS** on storage buckets
4. ✅ **Validate files** before upload (already implemented)
5. ✅ **Set file size limits** to prevent abuse

## 🚀 Production Deployment

Before deploying to production:

1. ✅ Verify all storage policies are working
2. ✅ Test uploads with different file types
3. ✅ Monitor storage usage regularly
4. ✅ Set up Supabase alerts for storage limits
5. ✅ Consider CDN for better performance (Supabase has built-in CDN)

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [File Upload Best Practices](https://supabase.com/docs/guides/storage/uploads)

## 💡 Tips

- Use **WebP format** for images (smaller file size, better quality)
- Compress videos before uploading (use tools like HandBrake)
- Set **featured image** to control which media shows first
- Upload **multiple angles** of your projects for better showcase
- Add **demo videos** to make portfolios more engaging

---

🎉 **Setup Complete!** You can now upload images and videos to your portfolio projects.

