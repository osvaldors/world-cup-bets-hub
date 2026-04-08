
-- Create 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Fix RLS for participants: Allow users to update their own participant record
CREATE POLICY "Users can update own participant record"
  ON public.participants FOR UPDATE
  USING (
    id IN (
      SELECT participant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT participant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Storage policies for 'avatars' bucket
-- Note: This assumes the bucket 'avatars' exists. 
-- In Supabase, you usually create the bucket via UI or API first.

-- 1. Allow public read access to avatars
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- 2. Allow authenticated users to upload an avatar if the filename starts with their UID
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    name LIKE (auth.uid()::text || '%')
  );

-- 3. Allow users to update/delete their own avatar
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );
