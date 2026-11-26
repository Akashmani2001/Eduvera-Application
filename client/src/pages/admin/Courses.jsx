import React, { useEffect, useState } from 'react';
import { courseApi } from '../../api/courseApi';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { BookOpen, Plus, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Course Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    programId: '',
    title: '',
    subject: '',
    level: '',
    description: '',
    scheduleTime: '5:00 PM - 8:00 PM',
    scheduleDays: 'Monday, Wednesday, Friday',
    syllabus: ''
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: null });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      courseApi.getCourses({ activeOnly: 'false' }),
      courseApi.getPrograms()
    ])
      .then(([cRes, pRes]) => {
        if (cRes.success) setCourses(cRes.courses);
        if (pRes.success) setPrograms(pRes.programs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      programId: programs[0]?._id || programs[0]?.id || '',
      title: '',
      subject: '',
      level: 'Class 10',
      description: '',
      scheduleTime: '5:00 PM - 8:00 PM',
      scheduleDays: 'Monday, Wednesday, Friday',
      syllabus: ''
    });
    setFormStatus({ loading: false, error: null });
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      programId: course.programId,
      title: course.title,
      subject: course.subject,
      level: course.level,
      description: course.description || '',
      scheduleTime: course.scheduleTime || '5:00 PM - 8:00 PM',
      scheduleDays: Array.isArray(course.scheduleDays) ? course.scheduleDays.join(', ') : 'Monday, Wednesday, Friday',
      syllabus: Array.isArray(course.syllabus) ? course.syllabus.join('\n') : ''
    });
    setFormStatus({ loading: false, error: null });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null });

    const payload = {
      ...formData,
      scheduleDays: formData.scheduleDays.split(',').map(s => s.trim()).filter(Boolean),
      syllabus: formData.syllabus.split('\n').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse._id || editingCourse.id, payload);
      } else {
        await courseApi.createCourse(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormStatus({ loading: false, error: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course offering?')) return;
    try {
      await courseApi.deleteCourse(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Course Catalog Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Configure subjects, education streams, and 5:00 PM – 8:00 PM schedules
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Course</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses configured"
          description="Create your first academic course offering for School, Commerce, or Higher Education."
          actionLabel="Create Course"
          onAction={openAddModal}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Subject & Stream</th>
                <th>Grade / Level</th>
                <th>Timetable Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => {
                const program = programs.find(p => String(p._id) === String(course.programId) || String(p.id) === String(course.programId));
                return (
                  <tr key={course._id || course.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0a142f' }}>{course.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{program?.name || 'Academic Stream'}</div>
                    </td>
                    <td>{course.subject}</td>
                    <td>
                      <span style={{ fontWeight: 600, background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.82rem' }}>
                        {course.level}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600 }}>{course.scheduleTime}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {Array.isArray(course.scheduleDays) ? course.scheduleDays.join(', ') : 'Mon, Wed, Fri'}
                      </div>
                    </td>
                    <td>
                      <Badge status={course.active ? 'active' : 'inactive'} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(course)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px' }}
                          title="Edit Course"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id || course.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px', color: '#ef4444', borderColor: '#fca5a5' }}
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Edit Course Offering' : 'Add New Course Offering'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          {formStatus.error && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.88rem', marginBottom: '16px' }}>
              {formStatus.error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Academic Program *</label>
            <select
              required
              className="form-select"
              value={formData.programId}
              onChange={e => setFormData({ ...formData, programId: e.target.value })}
            >
              {programs.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Class 10: Complete Mathematics & Science Mastery"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Subject(s) *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Mathematics, Accountancy"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Level / Grade *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Class 10, Class 12, BBA"
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Daily Schedule Time *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="5:00 PM - 8:00 PM"
                value={formData.scheduleTime}
                onChange={e => setFormData({ ...formData, scheduleTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Batch Days (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Monday, Wednesday, Friday"
                value={formData.scheduleDays}
                onChange={e => setFormData({ ...formData, scheduleDays: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Course Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Brief summary of teaching outcomes and exam preparation..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Syllabus Highlights (one topic per line)</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
              value={formData.syllabus}
              onChange={e => setFormData({ ...formData, syllabus: e.target.value })}
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
              disabled={formStatus.loading}
              className="btn btn-primary btn-sm"
            >
              {formStatus.loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
