import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sessionApi } from '../../api/sessionApi';
import { assignmentApi } from '../../api/assignmentApi';
import { materialApi } from '../../api/materialApi';
import { attendanceApi } from '../../api/attendanceApi';
import { announcementApi } from '../../api/announcementApi';
import { enrolmentApi } from '../../api/enrolmentApi';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  Video,
  FileText,
  CheckSquare,
  Award,
  Clock,
  Calendar,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Megaphone,
  AlertCircle
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Joining modal/message
  const [joinMessage, setJoinMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      sessionApi.getSessions().catch(() => ({ sessions: [] })),
      assignmentApi.getAssignments().catch(() => ({ assignments: [] })),
      materialApi.getMaterials().catch(() => ({ materials: [] })),
      attendanceApi.getStudentProgress().catch(() => ({ progress: null })),
      announcementApi.getAnnouncements().catch(() => ({ announcements: [] })),
      enrolmentApi.getEnrolments().catch(() => ({ enrolments: [] }))
    ])
      .then(([sessRes, assRes, matRes, progRes, annRes, enrRes]) => {
        if (sessRes.sessions) setSessions(sessRes.sessions);
        if (assRes.assignments) setAssignments(assRes.assignments);
        if (matRes.materials) setMaterials(matRes.materials);
        if (progRes.progress) setProgress(progRes.progress);
        if (annRes.announcements) setAnnouncements(annRes.announcements);
        if (enrRes.enrolments) setEnrolments(enrRes.enrolments);
      })
      .finally(() => setLoading(false));
  }, []);

  const nextSession = sessions.find(s => s.status === 'upcoming' || s.status === 'live');
  const pendingAssignments = assignments.filter(a => !a.isSubmitted);
  const approvedEnrolments = enrolments.filter(e => e.status === 'approved');

  const handleJoinClass = async (session) => {
    try {
      const res = await sessionApi.joinSession(session._id || session.id);
      if (res.meetingUrl) {
        window.open(res.meetingUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setJoinMessage(err.message);
      setTimeout(() => setJoinMessage(null), 5000);
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a142f 0%, #14224c 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 20px rgba(10, 20, 47, 0.12)'
      }}>
        <div>
          <span style={{ color: '#fb923c', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Academic Workspace
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '1.9rem', marginTop: '4px', marginBottom: '8px' }}>
            Hello, {user?.name}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.94rem', maxWidth: '520px' }}>
            Evening tuition classes run daily from <strong>5:00 PM to 8:00 PM</strong>. Your personalized learning schedule and study materials are ready below.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/student/classes" className="btn btn-primary">
            <Video size={16} />
            <span>View Timetable</span>
          </Link>
          <Link to="/programs" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}>
            <BookOpen size={16} />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>

      {/* Join error notice if any */}
      {joinMessage && (
        <div style={{ padding: '14px 20px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <span>{joinMessage}</span>
        </div>
      )}

      {/* Priority 1: Next Live Class Feature Card */}
      {nextSession ? (
        <div className="card" style={{
          border: nextSession.status === 'live' ? '2px solid #ea580c' : '1.5px solid #fed7aa',
          backgroundColor: '#fffaf5',
          padding: '26px 30px',
          marginBottom: '28px',
          boxShadow: nextSession.status === 'live' ? '0 12px 30px rgba(234, 88, 12, 0.15)' : 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className={`badge ${nextSession.status === 'live' ? 'badge-orange' : 'badge-navy'}`}>
                  {nextSession.status === 'live' ? '● CLASS IS LIVE NOW' : 'NEXT UPCOMING SESSION'}
                </span>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>{nextSession.courseTitle}</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0a142f', marginBottom: '6px' }}>
                {nextSession.title}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '14px' }}>
                {nextSession.agenda || 'Live interactive problem solving and concept mastery.'}
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.86rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="#ea580c" />
                  <span>{new Date(nextSession.startsAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#ea580c" />
                  <span>{new Date(nextSession.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(nextSession.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (IST)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Tutor: <strong>{nextSession.tutorName}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleJoinClass(nextSession)}
              className={`btn ${nextSession.status === 'live' ? 'btn-primary live-pulse-btn' : 'btn-primary'}`}
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              <Video size={18} />
              <span>Join Class Now</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <Clock size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', margin: 0 }}>No classes scheduled for today</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Regular evening batches are held Monday through Saturday (5 PM – 8 PM).</p>
            </div>
          </div>
          <Link to="/student/classes" className="btn btn-outline btn-sm">
            View Schedule
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          title="Attendance Rate"
          value={`${progress?.attendance?.rate ?? 100}%`}
          subtitle={`${progress?.attendance?.present ?? 1} of ${progress?.attendance?.total ?? 1} sessions attended`}
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Enrolled Batches"
          value={approvedEnrolments.length}
          subtitle={`${enrolments.filter(e => e.status === 'pending').length} pending approval`}
          icon={BookOpen}
          color="orange"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingAssignments.length}
          subtitle="Assignments due soon"
          icon={CheckSquare}
          color="navy"
        />
        <StatCard
          title="Average Score"
          value={`${progress?.assessments?.averageScore ?? 92}%`}
          subtitle="From graded milestone tests"
          icon={Award}
          color="blue"
        />
      </div>

      {/* Two Column Layout for Materials and Assignments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        {/* Recent Materials */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Study Materials & Notes</h3>
            </div>
            <Link to="/student/materials" style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {materials.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
              No study materials published yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {materials.slice(0, 3).map((mat) => (
                <div key={mat._id || mat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ overflow: 'hidden', paddingRight: '10px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {mat.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {mat.courseTitle} • {mat.fileSize || 'PDF'}
                    </div>
                  </div>
                  <a
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Assignments & Tests</h3>
            </div>
            <Link to="/student/assignments" style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
              No active assignments currently.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignments.slice(0, 3).map((ass) => (
                <div key={ass._id || ass.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ overflow: 'hidden', paddingRight: '10px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {ass.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Due: {new Date(ass.dueAt).toLocaleDateString()} • Max Marks: {ass.maxMarks}
                    </div>
                  </div>
                  <Badge status={ass.isSubmitted ? 'graded' : 'pending'} text={ass.isSubmitted ? 'Submitted' : 'Pending'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Academy Announcements Feed */}
      {announcements.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Megaphone size={20} color="#ea580c" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Academy Announcements</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((ann) => (
              <div key={ann._id || ann.id} style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #ea580c' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.96rem', color: '#0a142f', margin: 0 }}>{ann.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {ann.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
