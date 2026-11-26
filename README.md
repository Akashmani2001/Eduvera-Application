# VM Eduvera Online Academy (`Eduvera-Application`)

Full-stack MERN tuition management portal for **VM Eduvera Online Academy**, supporting public program browsing, student learning portals, and tutor/admin academic management.

## Project Structure

```text
.
├── client/   # React 19 + Vite frontend
└── server/   # Express + Mongoose (with automatic local JSON DB fallback) backend
```

## Features

- **Public Portal**: Home page, Programs catalog (School Classes 6–10, Commerce Classes 11–12, Higher Education BBA/BCom/MBA), Contact enquiry form, and student reviews.
- **Authentication & Role Guards**: JWT authentication with bcrypt password hashing and role-based access (`student`, `tutor`, `admin`).
- **Student Portal (`/student`)**: Dashboard, live class timetable (`5:00 PM – 8:00 PM`), study materials, assignments & submissions, attendance/results summary, reviews, and profile management.
- **Tutor / Admin Portal (`/admin`)**: Dashboard, course & enrolment management (approve/reject), live session scheduling, material uploads, assignment grading, attendance tracking, and announcements.
- **Zero-Config Database Fallback**: Connects to MongoDB via `MONGODB_URI`, and automatically falls back to a local JSON document store (`server/data/db.json`) with seeded demo data if MongoDB is unavailable.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (optional — the backend automatically uses the built-in JSON document engine if MongoDB is not running)

### 1. Configure Environment Variables

Create `.env` files from the provided examples if not already present:

- **Backend (`server/.env`)**: Copy `server/.env.example` to `server/.env` and update `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, and `CLIENT_ORIGIN` as needed.
- **Frontend (`client/.env`)**: Copy `client/.env.example` to `client/.env` (defaults to `VITE_API_BASE_URL=http://localhost:5000/api`).

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Run the Application (Development)

Run the backend and frontend in separate terminals:

```bash
# Terminal 1 - Backend API (http://localhost:5000)
cd server
npm run dev
```

```bash
# Terminal 2 - Frontend App (http://localhost:5173)
cd client
npm run dev
```

### 4. Production Build & Lint

```bash
# Frontend lint and production build (outputs to client/dist)
cd client
npm run lint
npm run build

# Backend production start
cd ../server
npm start
```

## Demo Accounts (Seeded Automatically)

- **Tutor / Admin**: `tutor@vmeduvera.com` / `admin123`
- **Student (Class 10)**: `student@vmeduvera.com` / `student123`
- **Student (Class 12)**: `ananya.iyer@example.com` / `student123`

## Health Check

- `GET http://localhost:5000/api/health`
