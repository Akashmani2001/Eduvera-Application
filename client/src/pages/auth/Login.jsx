import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const user = await demoLogin(role);
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'linear-gradient(135deg, #ea580c, #f97316)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)', marginBottom: '14px' }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#0a142f' }}>Sign In to VM Eduvera</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px' }}>
            Access live classes, study materials, and assessments
          </p>
        </div>

        {/* Demo Fast Login Box */}
        <div style={{
          backgroundColor: '#fff7ed',
          border: '1.5px solid #ffedd5',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
            <UserCheck size={16} />
            <span>Instant Demo Logins (1-Click)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('tutor')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <ShieldCheck size={14} />
              <span>Tutor / Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <span>Student (Class 10)</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '32px', border: '1px solid #e2e8f0' }}>
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.88rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@vmeduvera.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#ea580c', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '8px' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
            Don't have a student account yet?{' '}
            <Link to="/register" style={{ color: '#ea580c', fontWeight: 600 }}>
              Enrol / Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
