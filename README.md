# StudyAI — Personalized AI Study Scheduler

A full stack web app that generates adaptive, AI-powered study schedules based on your goals, deadlines, and daily availability.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Redux Toolkit
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o (mock mode available without an API key)

---

## Quick Start

### 1. PostgreSQL Setup
Create a database:
```sql
CREATE DATABASE study_scheduler;
```

### 2. Server Setup
```bash
cd server
cp .env.example .env
# Edit .env — update DATABASE_URL with your PostgreSQL credentials
# Optionally add OPENAI_API_KEY (mock mode is used if blank)

npm install
npm run migrate     # Run all DB migrations
npm run dev         # Start on http://localhost:5000
```

### 3. Client Setup
```bash
cd client
npm install
npm run dev         # Start on http://localhost:5173
```

---

## Features
- **AI Schedule Generation** — GPT-4o creates a personalized weekly plan (mock fallback if no API key)
- **Subject Management** — Track subjects with deadlines, difficulty, estimated hours
- **Progress Tracking** — Charts, completion stats, streaks
- **Gamification** — XP, levels, achievements for completing sessions
- **Smart Notifications** — Missed session alerts, daily reminders
- **Auto-Rescheduling** — Nightly cron job detects missed sessions and creates notifications

---

## Environment Variables

### Server (`server/.env`)
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/study_scheduler
JWT_SECRET=your_secret_here
OPENAI_API_KEY=       # Leave blank for mock AI mode
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Project Structure
```
study-scheduler/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios API calls
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── store/          # Redux Toolkit slices
│       └── utils/          # Helpers
└── server/                 # Express backend
    └── src/
        ├── config/         # DB, OpenAI, env config
        ├── middleware/      # Auth, error handler
        ├── modules/         # Feature modules (auth, subjects, sessions, ai...)
        ├── db/migrations/  # PostgreSQL migration files
        └── utils/          # JWT, XP, date helpers
```
