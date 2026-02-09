-- Add target_player column to game_questions
ALTER TABLE public.game_questions 
ADD COLUMN IF NOT EXISTS target_player TEXT DEFAULT 'both' CHECK (target_player IN ('jana', 'ahmed', 'both'));
