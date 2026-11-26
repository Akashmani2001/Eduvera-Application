import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Guards
import { AuthGuard } from '../components/guards/AuthGuard';
import { RoleGuard } from '../components/guards/RoleGuard';

// Public Pages
import { Home } from '../pages/public/Home';
import { Programs } from '../pages/public/Programs';
import { Contact } from '../pages/public/Contact';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Student Pages
import { Dashboard as StudentDashboard } from '../pages/student/Dashboard';
import { Classes as StudentClasses } from '../pages/student/Classes';
import { Materials as StudentMaterials } from '../pages/student/Materials';
import { Assignments as StudentAssignments } from '../pages/student/Assignments';
import { Results as StudentResults } from '../pages/student/Results';
import { Profile as StudentProfile } from '../pages/student/Profile';
import { Reviews as StudentReviews } from '../pages/student/Reviews';

// Admin Pages
import { Dashboard as AdminDashboard } from '../pages/admin/Dashboard';
import { Courses as AdminCourses } from '../pages/admin/Courses';
import { Students as AdminStudents } from '../pages/admin/Students';
import { Sessions as AdminSessions } from '../pages/admin/Sessions';
import { Materials as AdminMaterials } from '../pages/admin/Materials';
import { Assessments as AdminAssessments } from '../pages/admin/Assessments';
import { Attendance as AdminAttendance } from '../pages/admin/Attendance';
import { Announcements as AdminAnnouncements } from '../pages/admin/Announcements';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Student Protected Portal */}
      <Route
        path="/student"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['student']}>
              <StudentLayout />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="materials" element={<StudentMaterials />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="reviews" element={<StudentReviews />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin / Tutor Protected Portal */}
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['tutor', 'admin']}>
              <AdminLayout />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="sessions" element={<AdminSessions />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="assessments" element={<AdminAssessments />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
