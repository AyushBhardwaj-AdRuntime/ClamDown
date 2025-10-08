-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create mood_logs table
CREATE TABLE public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('happy', 'sad', 'anxious', 'stressed', 'calm', 'excited', 'angry', 'neutral')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on mood_logs
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

-- Mood logs policies
CREATE POLICY "Users can view their own mood logs"
  ON public.mood_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood logs"
  ON public.mood_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood logs"
  ON public.mood_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood logs"
  ON public.mood_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create clinics table
CREATE TABLE public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('anxiety', 'depression', 'stress', 'trauma', 'addiction', 'general')),
  location TEXT NOT NULL,
  contact_info TEXT,
  map_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on clinics (public read)
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Clinics policies (all authenticated users can read)
CREATE POLICY "Anyone can view clinics"
  ON public.clinics FOR SELECT
  USING (true);

-- Create emergency_contacts table
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('national', 'campus', 'online')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on emergency_contacts (public read)
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Emergency contacts policies (all users can read)
CREATE POLICY "Anyone can view emergency contacts"
  ON public.emergency_contacts FOR SELECT
  USING (true);

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample clinics data
INSERT INTO public.clinics (name, category, location, contact_info, map_link) VALUES
  ('MindCare Wellness Center', 'anxiety', 'Delhi, India', '+91-11-2345-6789', 'https://maps.google.com/?q=MindCare+Delhi'),
  ('Serenity Mental Health Clinic', 'depression', 'Mumbai, India', '+91-22-3456-7890', 'https://maps.google.com/?q=Serenity+Mumbai'),
  ('Peaceful Mind Institute', 'stress', 'Bangalore, India', '+91-80-4567-8901', 'https://maps.google.com/?q=Peaceful+Bangalore'),
  ('Healing Hearts Center', 'trauma', 'Chennai, India', '+91-44-5678-9012', 'https://maps.google.com/?q=Healing+Chennai'),
  ('Recovery Path Clinic', 'addiction', 'Kolkata, India', '+91-33-6789-0123', 'https://maps.google.com/?q=Recovery+Kolkata'),
  ('Harmony Mental Wellness', 'general', 'Hyderabad, India', '+91-40-7890-1234', 'https://maps.google.com/?q=Harmony+Hyderabad');

-- Insert sample emergency contacts
INSERT INTO public.emergency_contacts (name, phone, type, description) VALUES
  ('National Mental Health Helpline', '1800-599-0019', 'national', '24/7 helpline for mental health emergencies in India'),
  ('Vandrevala Foundation Helpline', '1860-2662-345', 'national', 'Free mental health support and counseling'),
  ('iCall Psychosocial Helpline', '9152987821', 'national', 'Professional counseling service by TISS'),
  ('Campus Counseling Services', '1800-XXX-XXXX', 'campus', 'Available Mon-Fri 9AM-5PM for students'),
  ('Online Therapy Platform', 'therapy@example.com', 'online', 'Schedule video sessions with licensed therapists');