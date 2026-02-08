-- Create audio_files table for Playlist  
CREATE TABLE IF NOT EXISTS audio_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'مستخدم',
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration TEXT DEFAULT '0:00',
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all operations on audio_files" 
  ON audio_files 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create storage bucket for audio (run this in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);
