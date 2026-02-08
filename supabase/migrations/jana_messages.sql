-- Create jana_messages table for Jana's message board
CREATE TABLE IF NOT EXISTS jana_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  author TEXT DEFAULT 'جنى',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE jana_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a personal project)
CREATE POLICY "Allow all operations on jana_messages" 
  ON jana_messages 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jana_messages_updated_at
  BEFORE UPDATE ON jana_messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
