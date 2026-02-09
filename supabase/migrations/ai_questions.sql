-- Create Table to log user questions for AI
CREATE TABLE IF NOT EXISTS ai_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE ai_questions ENABLE ROW LEVEL SECURITY;

-- Allow public insert (so the chat can log it)
CREATE POLICY "Allow Public Insert AI Questions" ON ai_questions
    FOR INSERT WITH CHECK (true);

-- Allow authenticated/admin read (to view in the dashboard eventually)
CREATE POLICY "Allow Admin Read AI Questions" ON ai_questions
    FOR SELECT USING (true);
