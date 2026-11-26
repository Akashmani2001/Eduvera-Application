import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reviewApi } from '../../api/reviewApi';
import {
  Star,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
  Award,
  ThumbsUp,
  Clock,
  BookOpen
} from 'lucide-react';

export const Reviews = () => {
  const { user } = useAuth();
  const [myReviews, setMyReviews] = useState([]);
  const [publicStats, setPublicStats] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    tutorId: '',
    tutorName: 'Prof. Vikram Mohan',
    courseId: '',
    subject: 'Mathematics & Science',
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
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: null, error: null });
  const [deleteLoading, setDeleteLoading] = useState(null);

  const ratingDescriptions = {
    5: '⭐⭐⭐⭐⭐ Exceptional (5/5) — Outstanding concept clarity & dedicated support',
    4: '⭐⭐⭐⭐ Very Good (4/5) — Clear explanations & engaging live sessions',
    3: '⭐⭐⭐ Good (3/5) — Good coverage and helpful notes',
    2: '⭐⭐ Fair (2/5) — Understandable but needs more problem solving',
    1: '⭐ Needs Improvement (1/5) — Significant pace adjustment needed'
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [myRes, pubRes, tutRes] = await Promise.all([
        reviewApi.getMyReviews().catch(() => ({ reviews: [] })),
        reviewApi.getPublicReviews().catch(() => ({ stats: null })),
        reviewApi.getTutorsAndSubjects().catch(() => ({ tutors: [], courses: [] }))
      ]);

      if (myRes.success) setMyReviews(myRes.reviews || []);
      if (pubRes.success) setPublicStats(pubRes.stats || null);
      if (tutRes.success) {
        setTutors(tutRes.tutors || []);
        setCourses(tutRes.courses || []);
        if (tutRes.tutors?.length > 0 && !formData.tutorId) {
          setFormData(prev => ({
            ...prev,
            tutorId: tutRes.tutors[0]._id,
            tutorName: tutRes.tutors[0].name
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load review data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRatingChange = (score) => {
    setFormData(prev => ({ ...prev, rating: score }));
  };

  const handleAspectChange = (aspectKey, score) => {
    setFormData(prev => ({
      ...prev,
      aspects: { ...prev.aspects, [aspectKey]: score }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.comment.trim()) {
      setSubmitStatus({ loading: false, success: null, error: 'Please enter a review title and detailed review.' });
      return;
    }

    try {
      setSubmitStatus({ loading: true, success: null, error: null });
      const res = await reviewApi.createReview(formData);
      setSubmitStatus({ loading: false, success: res.message || 'Review submitted successfully!', error: null });

      // Reset form and reload
      setFormData(prev => ({
        ...prev,
        rating: 5,
        title: '',
        comment: '',
        aspects: { clarity: 5, doubtSolving: 5, punctuality: 5 }
      }));
      loadData();

      setTimeout(() => {
        setSubmitStatus({ loading: false, success: null, error: null });
      }, 4000);
    } catch (err) {
      setSubmitStatus({ loading: false, success: null, error: err.message || 'Failed to submit review' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review? It will also be removed from the landing page.')) {
      return;
    }
    try {
      setDeleteLoading(id);
      await reviewApi.deleteReview(id);
      setMyReviews(prev => prev.filter(r => r._id !== id));
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Faculty Feedback
          </span>
          <h1 style={{ fontSize: '2rem', color: '#0a142f', marginTop: '4px', marginBottom: '8px' }}>
            Tutor Teaching Reviews & Ratings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '680px' }}>
            Your honest feedback directly guides teaching excellence at VM Eduvera and is showcased on the academy landing page for prospective students and parents.
          </p>
        </div>

        <Link to="/#reviews" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
          <span>View Landing Page Reviews</span>
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* Stats Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>My Reviews Submitted</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a142f' }}>{myReviews.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} fill="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Academy Average Rating</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a142f' }}>
              {publicStats?.averageRating || '4.9'} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ThumbsUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Student Satisfaction</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a142f' }}>
              {publicStats?.satisfactionRate || 100}%
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Publish Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>Live on Landing Page</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Form on Left/Top, My Reviews on Right/Bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.15fr) minmax(320px, 1fr)', gap: '30px', alignItems: 'start' }}>
        {/* Review Form Card */}
        <div className="card" style={{ padding: '30px', boxShadow: '0 4px 20px rgba(10, 20, 47, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#0a142f' }}>Review Your Tutor's Teaching</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Rate concept clarity, doubts, and evening live batch support.</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

          {submitStatus.success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', marginBottom: '20px', fontSize: '0.92rem' }}>
              <CheckCircle size={20} color="#10b981" />
              <span>{submitStatus.success}</span>
            </div>
          )}

          {submitStatus.error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontSize: '0.92rem' }}>
              <AlertCircle size={20} color="#ef4444" />
              <span>{submitStatus.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Tutor and Subject */}
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
                <label className="form-label">Subject / Course Stream</label>
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

            {/* Interactive Stars */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Overall Teaching Rating</span>
                <span style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 700 }}>
                  {formData.rating} of 5 Stars
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
                        transform: (hoverRating || formData.rating) === starVal ? 'scale(1.2)' : 'scale(1)'
                      }}
                      title={`${starVal} Star`}
                    >
                      <Star size={34} fill={isFilled ? '#f59e0b' : 'none'} strokeWidth={1.5} />
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.83rem', color: '#475569', fontWeight: 500, marginTop: '4px' }}>
                {ratingDescriptions[hoverRating || formData.rating]}
              </div>
            </div>

            {/* Teaching Aspects Evaluation */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a142f', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Detailed Teaching Aspects
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Concept Clarity</label>
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
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Doubt Clearing</label>
                  <select
                    className="form-select"
                    style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                    value={formData.aspects.doubtSolving}
                    onChange={(e) => handleAspectChange('doubtSolving', Number(e.target.value))}
                  >
                    <option value={5}>5 ★ - Instant & Patient</option>
                    <option value={4}>4 ★ - Helpful</option>
                    <option value={3}>3 ★ - Average</option>
                    <option value={2}>2 ★ - Slow Response</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Punctuality</label>
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

            {/* Headline */}
            <div className="form-group">
              <label className="form-label">Review Title / Headline</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Mastered Trigonometry in 3 weeks! Excellent mentor."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Comments */}
            <div className="form-group">
              <label className="form-label">Detailed Feedback on Tutor's Teaching</label>
              <textarea
                rows={4}
                required
                className="form-textarea"
                placeholder="Share your experience: How does the tutor make tough topics easy? How were the 5:00 - 8:00 PM live batches? Did tests and homework reviews help your score?"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              />
            </div>

            <button
              type="submit"
              disabled={submitStatus.loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '8px' }}
            >
              <Sparkles size={17} />
              <span>{submitStatus.loading ? 'Submitting Review...' : 'Publish Review to Landing Page'}</span>
            </button>
          </form>
        </div>

        {/* My Submitted Reviews List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0a142f', margin: 0 }}>
              My Submitted Reviews ({myReviews.length})
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} />
              <span>Visible on Landing Page</span>
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Loading your reviews...
            </div>
          ) : myReviews.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Star size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#0a142f' }}>No Reviews Yet</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 0 }}>
                You haven't written a review yet. Use the form on the left to share your feedback about tutor teaching!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myReviews.map((rev) => (
                <div key={rev._id} className="card" style={{ padding: '20px', borderLeft: '4px solid #ea580c' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          fill={s <= rev.rating ? '#f59e0b' : 'none'}
                          color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                        />
                      ))}
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0a142f', marginLeft: '6px' }}>
                        {rev.rating}.0
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(rev._id)}
                      disabled={deleteLoading === rev._id}
                      style={{ color: '#94a3b8', padding: '4px', borderRadius: '4px' }}
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: '#0a142f', marginBottom: '6px' }}>
                    {rev.title}
                  </h4>

                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                    "{rev.comment}"
                  </p>

                  {/* Aspects pills */}
                  {rev.aspects && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#065f46', fontWeight: 600 }}>
                        Clarity: {rev.aspects.clarity}★
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: '#eff6ff', color: '#1e40af', fontWeight: 600 }}>
                        Doubts: {rev.aspects.doubtSolving}★
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: '#fffbeb', color: '#92400e', fontWeight: 600 }}>
                        Punctuality: {rev.aspects.punctuality}★
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <div>
                      Tutor: <strong style={{ color: '#0a142f' }}>{rev.tutorName}</strong> • {rev.subject}
                    </div>
                    <div>
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
