import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin has access to tutor routes
  const effectiveRoles = [...allowedRoles];
  if (effectiveRoles.includes('tutor') && !effectiveRoles.includes('admin')) {
    effectiveRoles.push('admin');
  }

  if (!effectiveRoles.includes(user.role)) {
    // If student tries to access admin, redirect to student dashboard
    if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    // If tutor tries to access student, redirect to admin dashboard
    if (user.role === 'tutor' || user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
