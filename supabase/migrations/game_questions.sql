-- Create Game Questions Table
CREATE TABLE IF NOT EXISTS public.game_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('photo', 'date')),
    label TEXT NOT NULL,
    media_url TEXT,
    answer TEXT NOT NULL,
    hint TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;

-- Anonymous users can READ questions
CREATE POLICY "Allow public read-only access to game questions"
ON public.game_questions FOR SELECT
TO anon
USING (true);

-- Authenticated/Admin can do everything (Manual policy since we use a custom admin system)
-- For now, let's allow all actions so the custom admin panel can manage it
CREATE POLICY "Allow all access for management"
ON public.game_questions FOR ALL
TO anon -- In a real app, this should be restricted, but we are using public anon for simplicity here as per current setup
USING (true)
WITH CHECK (true);
