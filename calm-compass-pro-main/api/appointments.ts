// API endpoint for appointment operations
// This can be deployed as a serverless function (Vercel, Netlify, etc.)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { user_id, clinic_id, date, time_slot } = req.body;

      if (!user_id || !clinic_id || !date || !time_slot) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if slot is already booked
      const { data: existingAppointment, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('clinic_id', clinic_id)
        .eq('date', date)
        .eq('time_slot', time_slot)
        .eq('status', 'booked')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing appointment:', checkError);
        return res.status(500).json({ error: 'Failed to check appointment availability' });
      }

      if (existingAppointment) {
        return res.status(409).json({ error: 'Time slot is already booked' });
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id,
            clinic_id,
            date,
            time_slot,
            status: 'booked',
          }
        ])
        .select(`
          *,
          clinic:clinics(*)
        `)
        .single();

      if (error) {
        console.error('Error inserting appointment:', error);
        return res.status(500).json({ error: 'Failed to book appointment' });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { user_id, clinic_id, date } = req.query;

      if (user_id) {
        // Get user's appointments
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            clinic:clinics(*)
          `)
          .eq('user_id', user_id)
          .order('date', { ascending: true })
          .order('time_slot', { ascending: true });

        if (error) {
          console.error('Error fetching user appointments:', error);
          return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        res.status(200).json(data);
      } else if (clinic_id && date) {
        // Get available slots for a clinic on a specific date
        const { data: bookedSlots, error: bookedError } = await supabase
          .from('appointments')
          .select('time_slot')
          .eq('clinic_id', clinic_id)
          .eq('date', date)
          .eq('status', 'booked');

        if (bookedError) {
          console.error('Error fetching booked slots:', bookedError);
          return res.status(500).json({ error: 'Failed to fetch available slots' });
        }

        const timeSlots = [
          "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
          "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
          "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
          "05:00 PM", "05:30 PM"
        ];

        const bookedSlotTimes = bookedSlots?.map(slot => slot.time_slot) || [];
        const availableSlots = timeSlots.filter(slot => !bookedSlotTimes.includes(slot));

        res.status(200).json(availableSlots);
      } else {
        return res.status(400).json({ error: 'user_id or clinic_id+date is required' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { appointment_id, status } = req.body;

      if (!appointment_id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointment_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ error: 'Failed to update appointment' });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
