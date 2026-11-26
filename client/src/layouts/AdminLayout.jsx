import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  FileText,
  CheckSquare,
  CalendarCheck,
  Megaphone,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Course Management', path: '/admin/courses', icon: BookOpen },
    { name: 'Student Enrolments', path: '/admin/students', icon: Users },
    { name: 'Live Class Sessions', path: '/admin/sessions', icon: Video },
    { name: 'Study Materials', path: '/admin/materials', icon: FileText },
    { name: 'Assessments & Grading', path: '/admin/assessments', icon: CheckSquare },
    { name: 'Attendance Register', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #ea580c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>VM EDUVERA</div>
              <div style={{ fontSize: '0.68rem', color: '#f97316', fontWeight: 600, letterSpacing: '0.05em' }}>TUTOR / ADMIN PORTAL</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#94a3b8', display: 'none' }}
            id="close-admin-sidebar-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Pill */}
        <div style={{ margin: '14px 12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Academic Director Mode
          </span>
        </div>

        {/* Navigation items */}
        <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin profile and logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700 }}>
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Head Tutor / Administrator
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm btn-block"
            style={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.15)', background: 'transparent' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', color: '#0f172a' }}
              id="open-admin-sidebar-btn"
            >
              <Menu size={22} />
            </button>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Academy Management</span>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>Tutor Administration Center</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/student/dashboard" className="btn btn-outline btn-sm" title="View Portal as Student">
              Switch to Student View
            </Link>
            <Link to="/admin/sessions" className="btn btn-primary btn-sm">
              <Video size={15} />
              <span>Schedule Class</span>
            </Link>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
