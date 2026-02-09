-- Create Extra Memory Table for AI Retrieval
CREATE TABLE IF NOT EXISTS extra_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE extra_memory ENABLE ROW LEVEL SECURITY;

-- Allow public read (for the AI)
CREATE POLICY "Public Read Extra Memory" ON extra_memory
    FOR SELECT USING (true);

-- Allow authenticated/admin write (we'll assume admin check is done in app logic for now, or use a secret key)
CREATE POLICY "Admin All Access Extra Memory" ON extra_memory
    FOR ALL USING (true);
