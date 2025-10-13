-- Create clinic_registrations table if it doesn't exist
-- Run this in your Supabase SQL Editor

-- Create the clinic_registrations table
CREATE TABLE IF NOT EXISTS public.clinic_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('anxiety', 'depression', 'stress', 'trauma', 'addiction', 'general')),
  location TEXT NOT NULL,
  address TEXT,
  description TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clinic_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Anyone can insert clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Anyone can view their own clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Allow public to view approved clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Allow public to insert clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Allow users to view their own clinic registrations" ON public.clinic_registrations;

-- Create new policies
CREATE POLICY "Allow public to view approved clinic registrations"
  ON public.clinic_registrations FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Allow public to insert clinic registrations"
  ON public.clinic_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to view their own clinic registrations"
  ON public.clinic_registrations FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS clinic_registrations_updated_at ON public.clinic_registrations;
CREATE TRIGGER clinic_registrations_updated_at
  BEFORE UPDATE ON public.clinic_registrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Test the table
SELECT 'Table created successfully' as status;
