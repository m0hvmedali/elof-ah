-- Fix RLS for subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert) and read (for admin purposes display)
CREATE POLICY "Allow anonymous insert on subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select on subscriptions" ON subscriptions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update on subscriptions" ON subscriptions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on subscriptions" ON subscriptions
  FOR DELETE USING (true);
