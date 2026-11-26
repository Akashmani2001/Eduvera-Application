import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Video,
  FileText,
  CheckSquare,
  Award,
  User,
  LogOut,
  GraduationCap,
  Clock,
  Phone,
  Menu,
  X,
  Star
} from 'lucide-react';

export const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Live Classes & Timetable', path: '/student/classes', icon: Video },
    { name: 'Study Materials', path: '/student/materials', icon: FileText },
    { name: 'Assignments', path: '/student/assignments', icon: CheckSquare },
    { name: 'Results & Progress', path: '/student/results', icon: Award },
    { name: 'Tutor Reviews', path: '/student/reviews', icon: Star },
    { name: 'My Profile', path: '/student/profile', icon: User }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo / Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>VM EDUVERA</div>
              <div style={{ fontSize: '0.68rem', color: '#f97316', fontWeight: 600, letterSpacing: '0.05em' }}>STUDENT PORTAL</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#94a3b8', display: 'none' }}
            id="close-sidebar-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Brochure Batch Banner */}
        <div style={{ margin: '14px 12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.12)', border: '1px solid rgba(234, 88, 12, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <Clock size={12} />
            <span>Evening Batch</span>
          </div>
          <div style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 700, marginTop: '2px' }}>
            5:00 PM – 8:00 PM
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '10px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#1e293b', border: '1.5px solid #ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700 }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {user?.profile?.gradeOrCourse || 'Enrolled Student'}
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
              id="open-sidebar-btn"
            >
              <Menu size={22} />
            </button>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Welcome back,</span>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>{user?.name}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/programs" className="btn btn-outline btn-sm">
              Explore More Courses
            </Link>
            <a href="tel:8056717286" className="btn btn-primary btn-sm" title="Contact Tutor Helpdesk">
              <Phone size={15} />
              <span>Help: 80567 17286</span>
            </a>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
