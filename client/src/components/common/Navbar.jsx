import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Phone, Clock, User, LogOut, Menu, X, BookOpen, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardRoute = user?.role === 'student' ? '/student/dashboard' : '/admin/dashboard';

  return (
    <header className="site-header">
      {/* Top brochure info banner */}
      <div className="top-notice-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} />
            <span>Evening Tuition Batch: <strong>5:00 PM – 8:00 PM</strong> (Configurable by Tutor)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="tel:8056717286" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
              <Phone size={14} />
              <span>Admissions: <strong>80567 17286</strong></span>
            </a>
            <span style={{ opacity: 0.7 }}>|</span>
            <span>www.vmeduvera.com</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #ea580c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.4)' }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              VM EDUVERA
            </div>
            <div style={{ fontSize: '0.72rem', color: '#f97316', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Online Academy
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-links">
          <Link to="/" style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '0.94rem' }}>Home</Link>
          <Link to="/programs" style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '0.94rem' }}>Programs & Courses</Link>
          <a href="/#reviews" style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '0.94rem' }}>Student Reviews</a>
          <Link to="/contact" style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '0.94rem' }}>Contact & Enquiry</Link>
        </div>

        {/* User / CTA buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={dashboardRoute} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                <span>{user?.role === 'student' ? 'Student Workspace' : 'Tutor Portal'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign out" style={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', background: 'transparent' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)', background: 'transparent' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Enrol Now
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: '#ffffff', display: 'none' }}
            id="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </header>
  );
};
