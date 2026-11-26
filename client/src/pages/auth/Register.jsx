import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, User, Mail, Phone, Lock, BookOpen, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    educationLevel: 'School Level',
    gradeOrCourse: 'Class 10',
    parentName: '',
    parentPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg, #ea580c, #f97316)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)', marginBottom: '12px' }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#0a142f' }}>Student Registration</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Join VM Eduvera Online Academy evening tuition batches (5 PM – 8 PM)
          </p>
        </div>

        <div className="card" style={{ padding: '32px', border: '1px solid #e2e8f0' }}>
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.88rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Education Stream *</label>
                <select
                  className="form-select"
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                >
                  <option value="School Level">School Level (Classes 6–10)</option>
                  <option value="Commerce Stream">Commerce Stream (Classes 11–12)</option>
                  <option value="Higher Education">Higher Education (BBA, BCom, MBA)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Grade / Course *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Class 10 or Class 12"
                  value={formData.gradeOrCourse}
                  onChange={(e) => setFormData({ ...formData, gradeOrCourse: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Create Password (minimum 6 characters) *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '8px' }}
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
            Already registered with VM Eduvera?{' '}
            <Link to="/login" style={{ color: '#ea580c', fontWeight: 600 }}>
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
