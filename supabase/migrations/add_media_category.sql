-- Add category column to media table
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('general', 'ai_photos', 'room'));

-- Update existing records if needed
UPDATE public.media SET category = 'general' WHERE category IS NULL;
