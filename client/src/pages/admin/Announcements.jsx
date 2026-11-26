import React, { useEffect, useState } from 'react';
import { announcementApi } from '../../api/announcementApi';
import { courseApi } from '../../api/courseApi';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Megaphone, Plus, Calendar } from 'lucide-react';

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    courseId: '',
    priority: 'normal'
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([announcementApi.getAnnouncements(), courseApi.getCourses()])
      .then(([aRes, cRes]) => {
        if (aRes.success) setAnnouncements(aRes.announcements);
        if (cRes.success) setCourses(cRes.courses);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setFormData({
      title: '',
      body: '',
      courseId: '',
      priority: 'normal'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await announcementApi.createAnnouncement({
        ...formData,
        courseId: formData.courseId || null
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Academy Announcements</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Broadcast notices, timetable shifts, or exam alerts to all students or specific batches
          </p>
        </div>
        <button onClick={openModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Post Announcement</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements posted"
          description="Send messages and academic updates to your enrolled students."
          actionLabel="Post Notice"
          onAction={openModal}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {announcements.map(ann => (
            <div key={ann._id || ann.id} className="card" style={{ padding: '22px 26px', borderLeft: ann.priority === 'high' ? '5px solid #ea580c' : '5px solid #14224c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-navy">{ann.courseTitle || 'All Academy'}</span>
                  {ann.priority === 'high' && (
                    <span className="badge badge-orange">Important Notice</span>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Posted {new Date(ann.createdAt).toLocaleDateString()} by {ann.authorName || 'Faculty'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#0a142f', marginBottom: '8px' }}>
                {ann.title}
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {ann.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Post New Announcement"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Audience Scope</label>
            <select
              className="form-select"
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
            >
              <option value="">All Academy Enrolled Students</option>
              {courses.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  Specific Course: {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Special Weekend Doubt-Clearing Session"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="normal">Standard Notice</option>
              <option value="high">High Priority / Urgent Alert</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message Content *</label>
            <textarea
              rows={4}
              required
              className="form-textarea"
              placeholder="Type your message clearly for students..."
              value={formData.body}
              onChange={e => setFormData({ ...formData, body: e.target.value })}
            />
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
              className="btn btn-primary btn-sm"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
