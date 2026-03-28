-- COMPLETE SUPABASE OFFICIALS SCHEMA
-- This updates Supabase to handle Usernames, Emails, and Phone Numbers automatically during signup.

-- 1. Create the detailed officials table
DROP TABLE IF EXISTS public.officials CASCADE;

CREATE TABLE public.officials (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Security Policies (CRITICAL: Allow public select so the Login page can find emails by username!)
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to officials for login" ON public.officials FOR SELECT USING (true);
CREATE POLICY "Individuals can update their own profile" ON public.officials FOR UPDATE USING (auth.uid() = id);

-- 3. The Trigger Function to map signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_official()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.officials (id, email, username, phone_number)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone_number'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach the trigger to Supabase's authentication service
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_official();
