🧘 ClamDown – Student Mental Wellness Platform

ClamDown is a mental wellness web application designed to support students in managing their mental health.
It provides mood tracking with notes, clinic search with filters, and appointment booking with doctors in a professional, easy-to-use interface.

🚀 Features (MVP)

✅ Mood Tracking with Notes

Select daily mood (😀 😐 😟 😢 😡)

Add personal notes about how you feel

View mood trends over time in a chart

✅ Clinic Search with Filters

Search for clinics by category, location, or service type

Filter results for quick access

View clinic details including contact info and map link

✅ Appointment Booking

Book appointments with clinic doctors

Pick available date + time slot

Get booking confirmation

View your upcoming appointments

✅ Emergency Help

One-click button to access crisis hotlines and support contacts

🛠️ Tech Stack
Frontend

React.js / Next.js

TailwindCSS + shadcn/ui for UI components

Recharts / Chart.js for mood tracking visualization

Backend

Node.js (Express.js)

REST APIs for authentication, moods, clinics, and appointments

Database

PostgreSQL (Supabase / AWS RDS)

Tables: Users, MoodLogs, Clinics, Appointments, EmergencyContacts

📂 Project Structure
ClamDown/
│── frontend/        # React.js frontend (UI)
│── backend/         # Node.js backend (APIs)
│── database/        # Database schema & migrations
│── README.md        # Project documentation

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/AyushBhardwaj-AdRuntime/ClamDown.git
cd ClamDown

2. Setup Backend
cd backend
npm install
npm start

3. Setup Frontend
cd frontend
npm install
npm run dev

4. Database Setup

Import schema (PostgreSQL)

Configure .env with DB connection string

🔐 Environment Variables

Create a .env file in both frontend and backend with:

Backend (.env)

PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/clamdown
JWT_SECRET=your-secret-key


Frontend (.env)

NEXT_PUBLIC_API_URL=http://localhost:5000

📊 Database Schema (MVP)

Users → id, name, email, password_hash
MoodLogs → id, user_id, mood, note, created_at
Clinics → id, name, category, location, contact_info, map_link
Appointments → id, user_id, clinic_id, date, time_slot, status
EmergencyContacts → id, name, phone, type

🤝 Contributing

Fork the repo

Create a new branch (feature/my-feature)

Commit changes

Push branch and create a Pull Request

📜 License

MIT License – free to use and modify.

🌟 Acknowledgements

Built for students to improve mental wellness

Inspired by CBT, mindfulness, and student wellness challenges
