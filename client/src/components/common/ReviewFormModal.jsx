import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewApi } from '../../api/reviewApi';
import { Modal } from './Modal';
import { Star, CheckCircle, AlertCircle, Sparkles, User, BookOpen } from 'lucide-react';

export const ReviewFormModal = ({ isOpen, onClose, onReviewSubmitted, defaultTutorName = '', defaultSubject = '' }) => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(false);

  const [formData, setFormData] = useState({
    tutorId: '',
    tutorName: defaultTutorName || '',
    courseId: '',
    subject: defaultSubject || '',
    rating: 5,
    title: '',
    comment: '',
    aspects: {
      clarity: 5,
      doubtSolving: 5,
      punctuality: 5
    }
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState({ loading: false, success: null, error: null });
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingTutors(true);
      reviewApi.getTutorsAndSubjects()
        .then(res => {
          if (res.success) {
            setTutors(res.tutors || []);
            setCourses(res.courses || []);
            // set defaults if not set
            if (!formData.tutorName && res.tutors?.length > 0) {
              const firstTutor = res.tutors[0];
              setFormData(prev => ({
                ...prev,
                tutorId: firstTutor._id,
                tutorName: firstTutor.name,
                subject: prev.subject || (res.courses?.[0]?.subject || 'Mathematics & Science')
              }));
            }
          }
        })
        .catch(err => console.error('Failed to load tutors for review:', err))
        .finally(() => setLoadingTutors(false));
    }
  }, [isOpen]);

  const ratingDescriptions = {
    5: 'Exceptional (5/5) — Outstanding teaching clarity & mentor support',
    4: 'Very Good (4/5) — High concept clarity & engaged interaction',
    3: 'Good (3/5) — Satisfactory pace and good syllabus coverage',
    2: 'Fair (2/5) — Understandable but needs more problem-solving',
    1: 'Needs Improvement (1/5) — Needs significant changes'
  };

  const handleRatingChange = (score) => {
    setFormData(prev => ({ ...prev, rating: score }));
  };

  const handleAspectChange = (aspectKey, score) => {
    setFormData(prev => ({
      ...prev,
      aspects: { ...prev.aspects, [aspectKey]: score }
    }));
  };

  const handleQuickDemoLogin = async () => {
    try {
      setDemoLoading(true);
      await demoLogin('student');
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message || 'Demo login failed' });
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.comment.trim()) {
      setStatus({ loading: false, success: null, error: 'Please provide both a review headline and detailed comments.' });
      return;
    }

    try {
      setStatus({ loading: true, success: null, error: null });
      const res = await reviewApi.createReview(formData);
      setStatus({ loading: false, success: res.message || 'Review posted successfully!', error: null });

      if (onReviewSubmitted) {
        onReviewSubmitted(res.review);
      }

      setTimeout(() => {
        onClose();
        setStatus({ loading: false, success: null, error: null });
        setFormData({
          tutorId: tutors[0]?._id || '',
          tutorName: tutors[0]?.name || '',
          courseId: '',
          subject: courses[0]?.subject || '',
          rating: 5,
          title: '',
          comment: '',
          aspects: { clarity: 5, doubtSolving: 5, punctuality: 5 }
        });
      }, 1500);
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message || 'Failed to submit review' });
    }
  };

  const isStudent = user && (user.role === 'student' || user.role === 'admin');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Tutor's Teaching" maxWidth="620px">
      {!isAuthenticated || !isStudent ? (
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Sparkles size={28} />
          </div>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0a142f' }}>
            Enrolled Student Verification
          </h4>
          <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
            To maintain high authenticity and transparent feedback, teaching reviews can be posted by enrolled students of VM Eduvera Online Academy.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
            <button
              onClick={handleQuickDemoLogin}
              disabled={demoLoading}
              className="btn btn-primary btn-block"
            >
              <User size={16} />
              <span>{demoLoading ? 'Signing In...' : 'Quick Sign In as Demo Student'}</span>
            </button>
            <a href="/login" className="btn btn-outline btn-block">
              Sign In with My Account
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {status.success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>{status.success}</span>
            </div>
          )}

          {status.error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{status.error}</span>
            </div>
          )}

          {/* Student Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0a142f' }}>Posting as: {user?.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{user?.profile?.gradeOrCourse || 'Enrolled Student'} • Verified Student</div>
            </div>
          </div>

          {/* Tutor & Subject Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tutor</label>
              <select
                className="form-select"
                value={formData.tutorName}
                onChange={(e) => {
                  const selName = e.target.value;
                  const matched = tutors.find(t => t.name === selName);
                  setFormData(prev => ({
                    ...prev,
                    tutorName: selName,
                    tutorId: matched ? matched._id : prev.tutorId
                  }));
                }}
              >
                {tutors.length > 0 ? (
                  tutors.map(t => (
                    <option key={t._id} value={t.name}>{t.name}</option>
                  ))
                ) : (
                  <option value="Prof. Vikram Mohan">Prof. Vikram Mohan</option>
                )}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subject / Course</label>
              <select
                className="form-select"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              >
                <option value="Mathematics & Science">Mathematics & Science (Classes 6-10)</option>
                <option value="Accountancy & Economics">Accountancy & Economics (Classes 11-12)</option>
                <option value="Business Studies & Maths">Business Studies & Maths (Classes 11-12)</option>
                <option value="Financial Management & Corporate Law">Higher Ed: Financial Management</option>
                <option value="General Tuition & Doubt Clearing">General Tuition & Doubt Clearing</option>
              </select>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Overall Teaching Rating</span>
              <span style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600 }}>
                {formData.rating} out of 5 Stars
              </span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = (hoverRating || formData.rating) >= starVal;
                return (
                  <button
                    type="button"
                    key={starVal}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingChange(starVal)}
                    style={{
                      cursor: 'pointer',
                      padding: '4px',
                      color: isFilled ? '#f59e0b' : '#cbd5e1',
                      transition: 'transform 0.15s ease',
                      transform: (hoverRating || formData.rating) === starVal ? 'scale(1.15)' : 'scale(1)'
                    }}
                    title={`${starVal} Star`}
                  >
                    <Star size={32} fill={isFilled ? '#f59e0b' : 'none'} strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
              {ratingDescriptions[hoverRating || formData.rating]}
            </div>
          </div>

          {/* Teaching Aspects Assessment */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0a142f', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Teaching Aspects Evaluation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Concept Clarity</label>
                <select
                  className="form-select"
                  style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                  value={formData.aspects.clarity}
                  onChange={(e) => handleAspectChange('clarity', Number(e.target.value))}
                >
                  <option value={5}>5 ★ - Crystal Clear</option>
                  <option value={4}>4 ★ - Very Clear</option>
                  <option value={3}>3 ★ - Moderate</option>
                  <option value={2}>2 ★ - Needs Depth</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Doubt Solving</label>
                <select
                  className="form-select"
                  style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                  value={formData.aspects.doubtSolving}
                  onChange={(e) => handleAspectChange('doubtSolving', Number(e.target.value))}
                >
                  <option value={5}>5 ★ - Instant & Patient</option>
                  <option value={4}>4 ★ - Good Feedback</option>
                  <option value={3}>3 ★ - Average</option>
                  <option value={2}>2 ★ - Slow Response</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Punctuality</label>
                <select
                  className="form-select"
                  style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                  value={formData.aspects.punctuality}
                  onChange={(e) => handleAspectChange('punctuality', Number(e.target.value))}
                >
                  <option value={5}>5 ★ - Always on Time</option>
                  <option value={4}>4 ★ - Very Punctual</option>
                  <option value={3}>3 ★ - Acceptable</option>
                  <option value={2}>2 ★ - Occasional Delays</option>
                </select>
              </div>
            </div>
          </div>

          {/* Review Headline */}
          <div className="form-group">
            <label className="form-label">Review Headline</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Mastered Trigonometry in just 3 weeks! Excellent tutor."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Review Comments */}
          <div className="form-group">
            <label className="form-label">Your Detailed Review on Teaching</label>
            <textarea
              rows={4}
              required
              className="form-textarea"
              placeholder="Describe your learning experience: How did the tutor explain concepts? How were the 5:00 - 8:00 PM live batches? How did it help your exam marks?"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={status.loading}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              <span>{status.loading ? 'Publishing Review...' : 'Publish to Landing Page'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
