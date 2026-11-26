import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { enrolmentApi } from '../../api/enrolmentApi';
import { Badge } from '../../components/common/Badge';
import { User, Mail, Phone, BookOpen, Save, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    educationLevel: user?.profile?.educationLevel || '',
    gradeOrCourse: user?.profile?.gradeOrCourse || '',
    bio: user?.profile?.bio || '',
    parentName: user?.profile?.parentName || '',
    parentPhone: user?.profile?.parentPhone || ''
  });
  const [enrolments, setEnrolments] = useState([]);
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    enrolmentApi.getEnrolments()
      .then(res => {
        if (res.success) setEnrolments(res.enrolments);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await authApi.updateProfile(formData);
      if (res.success) {
        updateUser(res.user);
        setStatus({ loading: false, success: 'Profile updated successfully!', error: null });
        setTimeout(() => setStatus(prev => ({ ...prev, success: null })), 4000);
      }
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Student Profile</h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
          Manage your personal information, grade level, and emergency guardian contact
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {/* Profile Edit Card */}
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0a142f', marginBottom: '20px' }}>Personal Details</h3>

          {status.success && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              <span>{status.success}</span>
            </div>
          )}

          {status.error && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.9rem', marginBottom: '20px' }}>
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                className="form-input"
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                value={user?.email || ''}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Education Stream</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.educationLevel}
                  onChange={e => setFormData({ ...formData, educationLevel: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Grade / Course Level</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.gradeOrCourse}
                  onChange={e => setFormData({ ...formData, gradeOrCourse: e.target.value })}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', color: '#0a142f', margin: '20px 0 12px' }}>Parent / Guardian Information</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Parent / Guardian Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Suresh Sharma"
                  value={formData.parentName}
                  onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Parent Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 98765 43211"
                  value={formData.parentPhone}
                  onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Goals & Bio</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Target board exam marks, competitive goals..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{status.loading ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Enrolment Status Card */}
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0a142f', marginBottom: '16px' }}>Enrolled Batches & Status</h3>

          {enrolments.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              You have not submitted any course enrolment requests yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {enrolments.map(enr => (
                <div key={enr._id || enr.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#0a142f', margin: 0 }}>{enr.courseTitle}</h4>
                    <Badge status={enr.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Requested: {new Date(enr.requestedAt).toLocaleDateString()}
                  </div>
                  {enr.notes && (
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '6px' }}>
                      <em>Note: {enr.notes}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
