-- Supabase Storage Policies for project-media bucket
-- Run this in Supabase SQL Editor to fix Error 400

-- Drop existing policies if any (optional, only if recreating)
DROP POLICY IF EXISTS "Public read access for project-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to project-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from project-media" ON storage.objects;

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

-- Verify policies are created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
