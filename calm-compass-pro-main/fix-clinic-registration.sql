-- Fix clinic registration policies
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Anyone can insert clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Anyone can view their own clinic registrations" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Anonymous users can register clinics" ON public.clinic_registrations;
DROP POLICY IF EXISTS "Authenticated users can register clinics" ON public.clinic_registrations;

-- Create new, simpler policies
CREATE POLICY "Allow public to view approved clinic registrations"
  ON public.clinic_registrations FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Allow public to insert clinic registrations"
  ON public.clinic_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to view their own clinic registrations"
  ON public.clinic_registrations FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Verify the table exists and has the right structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clinic_registrations' 
AND table_schema = 'public';
