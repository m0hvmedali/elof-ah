-- Add precision location columns to visitor_logs
ALTER TABLE visitor_logs 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
