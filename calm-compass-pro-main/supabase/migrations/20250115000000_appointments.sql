-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(clinic_id, date, time_slot)
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow clinic owners to view appointments for their clinic
CREATE POLICY "Clinic owners can view their clinic appointments"
  ON public.appointments FOR SELECT
  USING (
    clinic_registration_id IN (
      SELECT id FROM public.clinic_registrations 
      WHERE email = auth.jwt() ->> 'email' AND status = 'approved'
    )
  );

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

-- Create trigger for appointments updated_at
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create clinic_registrations table for clinic management
CREATE TABLE public.clinic_registrations (
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

-- Add clinic_registration_id reference to appointments table to link with clinic_registrations
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS clinic_registration_id UUID REFERENCES public.clinic_registrations(id) ON DELETE SET NULL;

-- Create a view to combine clinics and clinic_registrations for easier querying
CREATE OR REPLACE VIEW public.all_clinics AS
SELECT 
  id,
  name,
  category,
  location,
  contact_info,
  map_link,
  'existing' as source_type,
  NULL::uuid as registration_id
FROM public.clinics
UNION ALL
SELECT 
  id,
  clinic_name as name,
  category,
  location,
  phone as contact_info,
  website as map_link,
  'registered' as source_type,
  id as registration_id
FROM public.clinic_registrations
WHERE status = 'approved';

-- Enable RLS on clinic_registrations
ALTER TABLE public.clinic_registrations ENABLE ROW LEVEL SECURITY;

-- Clinic registrations policies (allow public registration)
CREATE POLICY "Allow public to view approved clinic registrations"
  ON public.clinic_registrations FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Allow public to insert clinic registrations"
  ON public.clinic_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to view their own clinic registrations"
  ON public.clinic_registrations FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Create trigger for clinic_registrations updated_at
CREATE TRIGGER clinic_registrations_updated_at
  BEFORE UPDATE ON public.clinic_registrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
