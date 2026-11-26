import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { contactApi } from '../../api/contactApi';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../context/AuthContext';
import { ReviewFormModal } from '../../components/common/ReviewFormModal';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Phone,
  CheckCircle,
  Video,
  FileText,
  Users,
  ArrowRight,
  Shield,
  Sparkles,
  Star,
  MessageSquare,
  ThumbsUp,
  Quote
} from 'lucide-react';

export const Home = () => {
  const [programs, setPrograms] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    educationLevel: 'School Level (Classes 6-10)',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: null, error: null });

  // Reviews state
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const loadReviews = () => {
    setReviewsLoading(true);
    reviewApi.getPublicReviews()
      .then(res => {
        if (res.success) {
          setReviews(res.reviews || []);
          setReviewStats(res.stats || null);
        }
      })
      .catch(err => console.error('Failed to load reviews:', err))
      .finally(() => setReviewsLoading(false));
  };

  useEffect(() => {
    courseApi.getPrograms()
      .then(res => {
        if (res.success) setPrograms(res.programs);
      })
      .catch(err => console.error('Failed to load programs:', err));

    loadReviews();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, success: null, error: null });
    try {
      const res = await contactApi.submitContact(contactForm);
      setContactStatus({ loading: false, success: res.message, error: null });
      setContactForm({ name: '', email: '', phone: '', educationLevel: 'School Level (Classes 6-10)', message: '' });
    } catch (err) {
      setContactStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #070d1e 0%, #0a142f 50%, #14224c 100%)',
        color: '#ffffff',
        padding: '80px 0 90px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative backdrop glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(10, 20, 47, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(234, 88, 12, 0.18)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              borderRadius: '9999px',
              color: '#fb923c',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '22px'
            }}>
              <Sparkles size={16} />
              <span>Admissions Open for Academic Year 2026–27</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '20px'
            }}>
              Master Every Subject with <span style={{ color: '#f97316' }}>VM Eduvera</span> Online Academy
            </h1>

            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#cbd5e1',
              marginBottom: '32px',
              lineHeight: 1.6,
              maxWidth: '720px'
            }}>
              Comprehensive online tuition tailored for School (Classes 6–10), Commerce Stream (Classes 11–12), and Higher Education (BBA, BCom, MBA). Concept clarity, personalized attention, and live evening sessions.
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Start Learning Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)' }}>
                View All Courses
              </Link>
              <a href="tel:8056717286" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fb923c', fontWeight: 600, fontSize: '0.95rem', marginLeft: '8px' }}>
                <Phone size={18} />
                <span>Call: 80567 17286</span>
              </a>
            </div>

            {/* Brochure timing highlight badge */}
            <div style={{
              marginTop: '48px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Scheduled Tuition Hours
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Daily Evening Batches: 5:00 PM – 8:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Academic Pillars per Brochure */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px' }}>
            <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Academic Offerings
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#0a142f', marginTop: '6px', marginBottom: '12px' }}>
              Structured Programs for Every Learning Stage
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
              From foundational school concepts to university-level management subjects, our expert faculty guides students to academic excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* School Level */}
            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', border: '1px solid #ffedd5' }}>
                <BookOpen size={26} />
              </div>
              <span className="badge badge-orange" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                Classes 6 – 10
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>School Level Foundation</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '18px', flex: 1 }}>
                Complete concept clarity across Mathematics and Science. Dedicated weekly tests, board exam foundation, and personalized doubt clearing.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155', marginBottom: '22px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Mathematics & General Science</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Concept clarity & numerical practice</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Weekly tests & milestone tracking</span>
                </li>
              </ul>
              <Link to="/programs" className="btn btn-outline btn-block">
                <span>Explore School Batches</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Commerce Stream */}
            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', borderColor: '#ea580c', boxShadow: '0 8px 24px rgba(234, 88, 12, 0.08)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <TrendingUp size={26} />
              </div>
              <span className="badge badge-navy" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                Classes 11 – 12
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Commerce Stream Specialization</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '18px', flex: 1 }}>
                Rigorous preparation for Class 11 & 12 Board Exams in Accountancy, Economics, Business Studies, and Business Mathematics.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155', marginBottom: '22px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Accountancy & Financial Statements</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Economics & Business Mathematics</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Intensive Board Exam preparation</span>
                </li>
              </ul>
              <Link to="/programs" className="btn btn-primary btn-block">
                <span>Explore Commerce Batches</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Higher Education */}
            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', border: '1px solid #bfdbfe' }}>
                <GraduationCap size={26} />
              </div>
              <span className="badge badge-info" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                BBA, BCom, MBA
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Higher Education</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '18px', flex: 1 }}>
                Course-specific subjects configured by tutor. Financial management, corporate law, marketing analytics, and semester exam mastery.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155', marginBottom: '22px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>BBA / BCom university curriculum</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>MBA specialized management topics</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10b981" />
                  <span>Semester thesis & case-study support</span>
                </li>
              </ul>
              <Link to="/programs" className="btn btn-outline btn-block">
                <span>Explore Degree Batches</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Student Reviews on Tutor Teaching Section */}
      <section id="reviews" style={{ padding: '90px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', position: 'relative' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: '#fff7ed',
              border: '1px solid #ffedd5',
              borderRadius: '9999px',
              color: '#ea580c',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '14px'
            }}>
              <Sparkles size={16} />
              <span>Student & Parent Reviews</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#0a142f', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              What Students Say About Our Tutors' Teaching
            </h2>

            <p style={{ color: '#64748b', fontSize: '1.08rem', lineHeight: 1.6 }}>
              Real reviews and ratings from verified learners across School Foundation (Classes 6–10), Commerce Specialization (Classes 11–12), and Higher Education (BBA/BCom/MBA).
            </p>
          </div>

          {/* Rating Summary Header Card */}
          <div style={{
            background: 'linear-gradient(135deg, #070d1e 0%, #0f1c3f 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '36px 40px',
            marginBottom: '40px',
            boxShadow: '0 20px 40px -15px rgba(10, 20, 47, 0.25)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px'
          }}>
            {/* Score & Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                fontSize: '3.6rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.03em'
              }}>
                {reviewStats?.averageRating || '4.9'}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={22} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                  Overall Teaching Rating
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Based on {reviewStats?.totalReviews || reviews.length} verified student evaluations
                </div>
              </div>
            </div>

            {/* Teaching Metrics */}
            <div style={{
              display: 'flex',
              gap: '28px',
              flexWrap: 'wrap',
              borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
              paddingLeft: '28px'
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fb923c' }}>
                  {reviewStats?.aspects?.clarity || '5.0'} ★
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Concept Clarity</div>
              </div>

              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                  {reviewStats?.aspects?.doubtSolving || '5.0'} ★
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Doubt Resolution</div>
              </div>

              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
                  {reviewStats?.satisfactionRate || '100'}%
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Recommendation</div>
              </div>
            </div>

            {/* Write a Review Button */}
            <div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="btn btn-primary btn-lg"
                style={{
                  boxShadow: '0 8px 20px rgba(234, 88, 12, 0.4)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Sparkles size={18} />
                <span>+ Write a Student Review</span>
              </button>
              {isAuthenticated && user?.role === 'student' && (
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <Link to="/student/reviews" style={{ fontSize: '0.78rem', color: '#fb923c', textDecoration: 'underline' }}>
                    Manage my reviews in portal &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginRight: '6px' }}>Filter:</span>
            {[
              { id: 'all', label: `All Reviews (${reviews.length})` },
              { id: 'school', label: 'School Foundation (Classes 6–10)' },
              { id: 'commerce', label: 'Commerce Stream (Classes 11–12)' },
              { id: 'higher', label: 'Higher Education (BBA / BCom / MBA)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeCategory === tab.id ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                  background: activeCategory === tab.id ? '#fff7ed' : '#ffffff',
                  color: activeCategory === tab.id ? '#ea580c' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          {reviewsLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              Loading student reviews...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {reviews
                .filter(rev => {
                  if (activeCategory === 'all') return true;
                  const text = `${rev.studentGrade || ''} ${rev.subject || ''} ${rev.title || ''}`.toLowerCase();
                  if (activeCategory === 'school') {
                    return text.includes('10') || text.includes('school') || text.includes('math') || text.includes('science');
                  }
                  if (activeCategory === 'commerce') {
                    return text.includes('11') || text.includes('12') || text.includes('commerce') || text.includes('account') || text.includes('economics');
                  }
                  if (activeCategory === 'higher') {
                    return text.includes('higher') || text.includes('b.com') || text.includes('bba') || text.includes('mba') || text.includes('management') || text.includes('law');
                  }
                  return true;
                })
                .map((rev) => (
                  <div
                    key={rev._id}
                    className="card card-interactive"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '26px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      position: 'relative'
                    }}
                  >
                    {/* Top Row: Stars + Verified Badge + Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={18}
                            fill={s <= (rev.rating || 5) ? '#f59e0b' : 'none'}
                            color={s <= (rev.rating || 5) ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0a142f', marginLeft: '4px' }}>
                          {rev.rating}.0
                        </span>
                      </div>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                        <CheckCircle size={12} color="#059669" />
                        <span>Verified Student</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#0a142f', marginBottom: '10px', lineHeight: 1.35 }}>
                      "{rev.title}"
                    </h3>

                    {/* Comment */}
                    <p style={{
                      color: '#475569',
                      fontSize: '0.94rem',
                      lineHeight: 1.65,
                      marginBottom: '18px',
                      flex: 1
                    }}>
                      {rev.comment}
                    </p>

                    {/* Aspects Badges */}
                    {rev.aspects && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                        <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600 }}>
                          Clarity: <span style={{ color: '#ea580c' }}>{rev.aspects.clarity}★</span>
                        </span>
                        <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600 }}>
                          Doubts: <span style={{ color: '#0284c7' }}>{rev.aspects.doubtSolving}★</span>
                        </span>
                        <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600 }}>
                          Punctuality: <span style={{ color: '#10b981' }}>{rev.aspects.punctuality}★</span>
                        </span>
                      </div>
                    )}

                    {/* Student Info & Tutor Tag Footer */}
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0a142f, #1e293b)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            border: '1.5px solid #ffedd5'
                          }}>
                            {rev.studentName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0a142f' }}>
                              {rev.studentName}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              {rev.studentGrade || 'Enrolled Student'}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified'}
                        </span>
                      </div>

                      {/* Tutor & Subject Line */}
                      <div style={{
                        fontSize: '0.78rem',
                        color: '#64748b',
                        background: '#f8fafc',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <BookOpen size={13} color="#ea580c" />
                        <span>Taught by <strong style={{ color: '#0a142f' }}>{rev.tutorName}</strong> • {rev.subject}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* CTA Banner to invite reviews */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', color: '#0a142f', marginBottom: '4px' }}>
                Are you an enrolled student with VM Eduvera?
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Share your feedback on our faculty's teaching style, live evening batches, and doubt sessions. Your review helps us continuously elevate our education standards.
              </p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              <span>Share Your Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* Review Submission Modal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={(newRev) => {
          setReviews(prev => [newRev, ...prev]);
          loadReviews();
        }}
      />

      {/* Why Choose VM Eduvera Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Teaching Approach
              </span>
              <h2 style={{ fontSize: '2.4rem', color: '#0a142f', marginTop: '8px', marginBottom: '20px' }}>
                Why Students & Parents Trust VM Eduvera
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '28px' }}>
                We combine structured curriculum delivery with real-time video sessions, rigorous milestone tests, and continuous tutor mentoring to ensure measurable academic advancement.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#ea580c', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>Live Interactive</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Direct interaction with tutor; instant doubt resolution.</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#0a142f', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>Regular Tests</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Periodic assessments and marked feedback reports.</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#0a142f', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>Safe & Secure</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Controlled access and protected study resources.</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#ea580c', fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>5 – 8 PM Evening</div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Convenient timing without school clashes.</p>
                </div>
              </div>
            </div>

            {/* Quick Enquiry Card */}
            <div className="card" style={{ padding: '36px', boxShadow: '0 20px 40px -15px rgba(10, 20, 47, 0.12)', border: '1.5px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Enquire About Admissions</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                Speak with our academic counselor or request course details.
              </p>

              {contactStatus.success && (
                <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.9rem', marginBottom: '18px' }}>
                  {contactStatus.success}
                </div>
              )}

              {contactStatus.error && (
                <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.9rem', marginBottom: '18px' }}>
                  {contactStatus.error}
                </div>
              )}

              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter student or parent name"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="e.g. 80567 17286"
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="name@example.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Program of Interest</label>
                  <select
                    className="form-select"
                    value={contactForm.educationLevel}
                    onChange={e => setContactForm({ ...contactForm, educationLevel: e.target.value })}
                  >
                    <option value="School Level (Classes 6-10)">School Level (Classes 6–10)</option>
                    <option value="Commerce Stream (Classes 11-12)">Commerce Stream (Classes 11–12)</option>
                    <option value="Higher Education (BBA, BCom, MBA)">Higher Education (BBA, BCom, MBA)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Specific Subject Request</label>
                  <textarea
                    rows={3}
                    required
                    className="form-textarea"
                    placeholder="Describe your learning requirements..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactStatus.loading}
                  className="btn btn-primary btn-block"
                >
                  {contactStatus.loading ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                </button>
              </form>

              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.84rem', color: '#64748b' }}>
                Direct Hotline: <strong style={{ color: '#ea580c' }}>80567 17286</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
