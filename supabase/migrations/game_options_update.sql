-- Update Game Questions Table for Multiple Choice
ALTER TABLE public.game_questions 
ADD COLUMN IF NOT EXISTS options TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS correct_option_index INTEGER DEFAULT 0;

-- Optional: If we want to store the answer as one of the options strictly
-- We can migration existing data if needed, but since it's a new feature, we'll start fresh or handle it in code.
