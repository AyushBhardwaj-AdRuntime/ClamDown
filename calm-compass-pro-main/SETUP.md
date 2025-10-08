# Mental Health Platform - Setup Guide

This is a comprehensive mental health platform built with React, TypeScript, Supabase, and Tailwind CSS. It includes mood tracking, clinic search, appointment booking, and clinic registration features.

## Features Implemented

### 1. Mood Tracking + Notes
- ✅ Mood selection with emoji icons (😀 😐 😟 😢 😡)
- ✅ Modal popup for mood logging with notes
- ✅ Mood trend chart showing progress over time
- ✅ Database integration with Supabase
- ✅ Recent mood logs display

### 2. Clinic Search + Filters
- ✅ Search functionality by name/location
- ✅ Category filters (Anxiety, Depression, Stress, etc.)
- ✅ Professional clinic cards with contact info
- ✅ Map integration for directions
- ✅ Clinic details page

### 3. Appointment Booking System
- ✅ Date picker with calendar interface
- ✅ Time slot selection with availability checking
- ✅ Real-time slot availability
- ✅ Appointment confirmation
- ✅ User appointment management
- ✅ Appointment cancellation

### 4. Clinic Registration
- ✅ Clinic registration form
- ✅ Admin approval workflow
- ✅ Clinic profile management

## Database Schema

### Tables Created:
- `profiles` - User profiles
- `mood_logs` - Mood tracking data
- `clinics` - Clinic information
- `appointments` - Appointment bookings
- `clinic_registrations` - Pending clinic registrations
- `emergency_contacts` - Emergency contact information

## Setup Instructions

### 1. Environment Setup

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 2. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database migrations:
   - `supabase/migrations/20251007210332_3e89302b-6932-4bd5-a8f7-d4e73b16ed39.sql` (existing)
   - `supabase/migrations/20250115000000_appointments.sql` (new)

3. Enable Row Level Security (RLS) is already configured in the migrations

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## API Endpoints

The project includes serverless API functions in the `/api` directory:

- `POST /api/mood` - Log mood entries
- `GET /api/mood?user_id=123` - Get user's mood logs
- `GET /api/clinics` - List clinics with filters
- `POST /api/appointments` - Book appointments
- `GET /api/appointments?user_id=123` - Get user appointments
- `GET /api/appointments?clinic_id=123&date=2025-01-15` - Get available slots

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend API (Vercel Functions)
The API functions in `/api` directory will be automatically deployed as Vercel serverless functions.

### Database (Supabase)
Already hosted on Supabase cloud.

## Usage

### For Users:
1. Sign up/Sign in
2. Track mood with notes
3. Search and filter clinics
4. Book appointments
5. View appointment history

### For Clinics:
1. Register clinic through the platform
2. Wait for admin approval
3. Manage appointments (future feature)

## Security Features

- JWT authentication via Supabase Auth
- Row Level Security (RLS) on all tables
- User-specific data access
- Secure API endpoints
- Input validation and sanitization

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Deployment**: Vercel (frontend + API)

## Future Enhancements

- [ ] Clinic admin dashboard
- [ ] Real-time notifications
- [ ] Video consultation booking
- [ ] Progress tracking analytics
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Clinic ratings and reviews
