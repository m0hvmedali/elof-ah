-- Create Table for App Settings
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow Public Read App Settings" ON app_settings
    FOR SELECT USING (true);

-- Allow authenticated/admin update
CREATE POLICY "Allow Admin Update App Settings" ON app_settings
    FOR ALL USING (true);

-- Seed initial values if not exists
INSERT INTO app_settings (key, value)
VALUES 
    ('admin_password', '169'),
    ('site_password', '0000')
ON CONFLICT (key) DO NOTHING;
