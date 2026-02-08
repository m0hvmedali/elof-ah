-- Create table for Push Subscriptions
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  keys jsonb NOT NULL,
  created_at width_bucket timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_endpoint_key UNIQUE (endpoint)
);

-- Create table for Media (Images/Videos)
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT media_pkey PRIMARY KEY (id)
);

-- Create table for Songs
CREATE TABLE public.songs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text,
  url text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT songs_pkey PRIMARY KEY (id)
);

-- Create table for App Settings (e.g., Admin Password)
CREATE TABLE public.app_settings (
  key text NOT NULL,
  value text NOT NULL,
  CONSTRAINT app_settings_pkey PRIMARY KEY (key)
);

-- Insert default Admin Password (0000)
INSERT INTO public.app_settings (key, value)
VALUES ('admin_password', '0000')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow Public Read, Admin Write - simulated by logic for now, or just public for MVP)
-- For this personal gift app, we can allow public insert for subscriptions (anyone visiting can subscribe)
-- Media/Songs/Settings should only be writable by Admin, but since we handle auth in client for MVP via simple password,
-- we might just open RLS for now and rely on our client-side check + obscure admin URL/Password.
-- Ideally, we'd use Supabase Auth, but user wants simple password "0000".

-- Policy: Allow anyone to insert subscriptions
CREATE POLICY "Enable insert for everyone" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for everyone" ON public.subscriptions FOR SELECT USING (true); -- Needed for admin to see count? Or send?

-- Policy: Allow read/write for media/songs (Simplified for MVP)
CREATE POLICY "Enable read/write for everyone" ON public.media FOR ALL USING (true);
CREATE POLICY "Enable read/write for everyone" ON public.songs FOR ALL USING (true);
CREATE POLICY "Enable read/write for everyone" ON public.app_settings FOR ALL USING (true);
