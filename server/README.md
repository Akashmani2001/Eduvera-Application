# VM Eduvera Online Academy - Backend Server

Express.js REST API backend supporting the VM Eduvera Online Academy MERN application.

## Quick Start

```bash
# In the server directory
npm install
npm start
```

## Features
- **Authentication**: JWT-based auth with bcrypt password hashing and role enforcement (`tutor`, `student`, `admin`).
- **Programs & Courses**: Catalog for School (6-10), Commerce (11-12), and Higher Education (BBA/BCom/MBA).
- **Enrolment Management**: Enrolment requests with Tutor review (Approve / Reject).
- **Live Class Timetable**: 5:00 PM - 8:00 PM session scheduling, status tracking, and secure join link protection.
- **Study Materials**: PDF notes and worksheet distribution with permission scoping.
- **Assignments & Assessments**: Student submissions and teacher grading with feedback.
- **Attendance**: Session-by-session attendance tracking with duplicate prevention.
- **Progress Tracking**: Personal attendance rate and assessment score summaries.

## Pre-configured Demo Accounts
- **Tutor / Admin**: `tutor@vmeduvera.com` / `admin123`
- **Student (Class 10)**: `student@vmeduvera.com` / `student123`
- **Student (Class 12)**: `ananya.iyer@example.com` / `student123`
