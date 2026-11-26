import React, { useEffect, useState } from 'react';
import { sessionApi } from '../../api/sessionApi';
import { courseApi } from '../../api/courseApi';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Video, Plus, Clock, Calendar, ExternalLink, Trash2 } from 'lucide-react';

export const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    agenda: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:30', // 5:30 PM
    endTime: '19:00',   // 7:00 PM
    provider: 'Google Meet',
    meetingUrl: 'https://meet.google.com/edu-vera-live'
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: null });

  const fetchData = () => {
    setLoading(true);
    Promise.all([sessionApi.getSessions(), courseApi.getCourses()])
      .then(([sRes, cRes]) => {
        if (sRes.success) setSessions(sRes.sessions);
        if (cRes.success) {
          setCourses(cRes.courses);
          if (cRes.courses.length > 0 && !formData.courseId) {
            setFormData(prev => ({ ...prev, courseId: cRes.courses[0]._id || cRes.courses[0].id }));
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setFormData({
      courseId: courses[0]?._id || courses[0]?.id || '',
      title: '',
      agenda: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '17:30',
      endTime: '19:00',
      provider: 'Google Meet',
      meetingUrl: 'https://meet.google.com/edu-vera-live'
    });
    setFormStatus({ loading: false, error: null });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null });

    const startsAt = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
    const endsAt = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();

    try {
      await sessionApi.createSession({
        courseId: formData.courseId,
        title: formData.title,
        agenda: formData.agenda,
        startsAt,
        endsAt,
        timeZone: 'Asia/Kolkata',
        provider: formData.provider,
        meetingUrl: formData.meetingUrl
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormStatus({ loading: false, error: err.message });
    }
  };

  const handleCancelSession = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this class session?')) return;
    try {
      await sessionApi.updateSession(id, { status: 'cancelled' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Live Class Scheduler</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Schedule and launch live video sessions within 5:00 PM – 8:00 PM brochure timings
          </p>
        </div>
        <button onClick={openModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Schedule New Session</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading class schedule...
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No sessions scheduled"
          description="Schedule a class to conduct live interactive tuition with video conferencing."
          actionLabel="Schedule Class"
          onAction={openModal}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sessions.map(sess => (
            <div key={sess._id || sess.id} className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Badge status={sess.status} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ea580c' }}>
                    {sess.courseTitle}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#0a142f', margin: '4px 0' }}>
                  {sess.title}
                </h3>

                {sess.agenda && (
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 10px' }}>
                    {sess.agenda}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#ea580c" />
                    <span>{new Date(sess.startsAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#ea580c" />
                    <span>{new Date(sess.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(sess.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (IST)</span>
                  </div>
                  <div>
                    Meeting Link: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{sess.meetingUrl}</code>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a
                  href={sess.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <Video size={15} />
                  <span>Launch Meeting</span>
                  <ExternalLink size={13} />
                </a>

                {sess.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelSession(sess._id || sess.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                    title="Cancel Session"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Live Class Session"
      >
        <form onSubmit={handleSubmit}>
          {formStatus.error && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.88rem', marginBottom: '16px' }}>
              {formStatus.error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Course / Batch *</label>
            <select
              required
              className="form-select"
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
            >
              {courses.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session Topic / Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Chapter 4: Quadratic Equations - Board Problems"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Session Agenda / Highlights</label>
            <input
              type="text"
              className="form-input"
              placeholder="Topics to cover, materials needed by students..."
              value={formData.agenda}
              onChange={e => setFormData({ ...formData, agenda: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start (5–8 PM)</label>
              <input
                type="time"
                required
                className="form-input"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                required
                className="form-input"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Provider</label>
              <select
                className="form-select"
                value={formData.provider}
                onChange={e => setFormData({ ...formData, provider: e.target.value })}
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Meeting URL *</label>
              <input
                type="url"
                required
                className="form-input"
                placeholder="https://meet.google.com/..."
                value={formData.meetingUrl}
                onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formStatus.loading}
              className="btn btn-primary btn-sm"
            >
              {formStatus.loading ? 'Scheduling...' : 'Save & Publish Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
