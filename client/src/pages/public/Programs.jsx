import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { enrolmentApi } from '../../api/enrolmentApi';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import {
  BookOpen,
  TrendingUp,
  GraduationCap,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Programs = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Enrolment Modal State
  const [enrolModalCourse, setEnrolModalCourse] = useState(null);
  const [enrolNotes, setEnrolNotes] = useState('');
  const [enrolStatus, setEnrolStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    Promise.all([courseApi.getPrograms(), courseApi.getCourses()])
      .then(([progRes, courseRes]) => {
        if (progRes.success) setPrograms(progRes.programs);
        if (courseRes.success) setCourses(courseRes.courses);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEnrolClick = (course) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: `Please log in to enrol in "${course.title}".` } });
      return;
    }
    if (user?.role !== 'student') {
      alert('Tutors/Administrators can manage courses directly from the Tutor Dashboard.');
      return;
    }
    setEnrolModalCourse(course);
    setEnrolNotes('');
    setEnrolStatus({ loading: false, success: null, error: null });
  };

  const handleConfirmEnrolment = async (e) => {
    e.preventDefault();
    if (!enrolModalCourse) return;

    setEnrolStatus({ loading: true, success: null, error: null });
    try {
      const res = await enrolmentApi.requestEnrolment(
        enrolModalCourse._id || enrolModalCourse.id,
        enrolNotes
      );
      setEnrolStatus({ loading: false, success: res.message, error: null });
      setTimeout(() => {
        setEnrolModalCourse(null);
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      setEnrolStatus({ loading: false, success: null, error: err.message });
    }
  };

  const filteredCourses = courses.filter(course => {
    // Category match
    const program = programs.find(p => String(p._id) === String(course.programId) || String(p.id) === String(course.programId));
    const categoryMatch = selectedCategory === 'All' || program?.category === selectedCategory;

    // Search query match
    const q = searchQuery.toLowerCase();
    const queryMatch =
      !searchQuery ||
      course.title.toLowerCase().includes(q) ||
      course.subject.toLowerCase().includes(q) ||
      course.level.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q);

    return categoryMatch && queryMatch;
  });

  return (
    <div style={{ padding: '60px 0 90px', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Course Offerings
          </span>
          <h1 style={{ fontSize: '2.8rem', color: '#0a142f', marginTop: '6px', marginBottom: '14px' }}>
            Academic Programs & Batches
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.08rem' }}>
            Choose your education level and explore tailored subjects. Evening tuition classes run between <strong>5:00 PM – 8:00 PM</strong> with live tutor mentoring.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All', 'School', 'Commerce', 'Higher Education'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.9rem', padding: '8px 18px' }}
              >
                {cat === 'All' ? 'All Programs' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by subject, grade, or topic..."
              className="form-input"
              style={{ paddingLeft: '40px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            Loading VM Eduvera course catalog...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <BookOpen size={48} color="#ea580c" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No courses found</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              No courses matched your current filter criteria. Try selecting another category or clearing your search.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '28px' }}>
            {filteredCourses.map((course) => {
              const program = programs.find(p => String(p._id) === String(course.programId) || String(p.id) === String(course.programId));
              return (
                <div key={course._id || course.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Category and Level badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge badge-orange">{program?.name || 'Academic Batch'}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                      {course.level}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0a142f' }}>
                    {course.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px', flex: 1, lineHeight: '1.5' }}>
                    {course.description}
                  </p>

                  {/* Schedule info badge */}
                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontSize: '0.82rem', fontWeight: 600 }}>
                      <Clock size={14} />
                      <span>{course.scheduleTime || '5:00 PM – 8:00 PM'}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                      Days: {course.scheduleDays ? course.scheduleDays.join(', ') : 'Mon, Wed, Fri'}
                    </div>
                  </div>

                  {/* Syllabus Preview */}
                  {course.syllabus && course.syllabus.length > 0 && (
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Curriculum Highlights:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: '#475569' }}>
                        {course.syllabus.slice(0, 3).map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enrol button */}
                  <button
                    onClick={() => handleEnrolClick(course)}
                    className="btn btn-primary btn-block"
                  >
                    <span>Request Enrolment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enrolment Modal */}
      <Modal
        isOpen={!!enrolModalCourse}
        onClose={() => setEnrolModalCourse(null)}
        title="Request Course Enrolment"
      >
        {enrolModalCourse && (
          <form onSubmit={handleConfirmEnrolment}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: '#ea580c', fontWeight: 600, textTransform: 'uppercase' }}>Selected Course</div>
              <h4 style={{ fontSize: '1.2rem', color: '#0a142f' }}>{enrolModalCourse.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Level: {enrolModalCourse.level} | Timing: {enrolModalCourse.scheduleTime}</p>
            </div>

            {enrolStatus.success && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.9rem', marginBottom: '16px' }}>
                {enrolStatus.success}
              </div>
            )}

            {enrolStatus.error && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.9rem', marginBottom: '16px' }}>
                {enrolStatus.error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Note to Tutor / Prior Subject Background (Optional)</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Mention your target board exam marks, specific areas needing attention..."
                value={enrolNotes}
                onChange={(e) => setEnrolNotes(e.target.value)}
              />
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
              Your enrolment application will be sent to the academic tutor for review and batch approval.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setEnrolModalCourse(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={enrolStatus.loading}
                className="btn btn-primary btn-sm"
              >
                {enrolStatus.loading ? 'Submitting...' : 'Confirm Enrolment Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
