-- Create Table for Visitor Logs
CREATE TABLE IF NOT EXISTS visitor_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_hint TEXT,
    user_agent TEXT,
    device_info JSONB,
    location_data JSONB,
    entry_type TEXT, -- 'SITE', 'ISLAMIC', 'FAILED', 'ADMIN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (anyone visiting)
CREATE POLICY "Allow Public Insert Visitor Logs" ON visitor_logs
    FOR INSERT WITH CHECK (true);

-- Allow admin to read
CREATE POLICY "Allow Admin Read Visitor Logs" ON visitor_logs
    FOR SELECT USING (true);
