import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { enrolmentApi } from '../../api/enrolmentApi';
import { sessionApi } from '../../api/sessionApi';
import { assignmentApi } from '../../api/assignmentApi';
import { contactApi } from '../../api/contactApi';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  BookOpen,
  Video,
  CheckSquare,
  MessageSquare,
  Clock,
  Calendar,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      courseApi.getCourses({ activeOnly: 'false' }).catch(() => ({ courses: [] })),
      enrolmentApi.getEnrolments().catch(() => ({ enrolments: [] })),
      sessionApi.getSessions().catch(() => ({ sessions: [] })),
      assignmentApi.getAssignments().catch(() => ({ assignments: [] })),
      contactApi.getContacts().catch(() => ({ enquiries: [] }))
    ])
      .then(([cRes, eRes, sRes, aRes, conRes]) => {
        if (cRes.courses) setCourses(cRes.courses);
        if (eRes.enrolments) setEnrolments(eRes.enrolments);
        if (sRes.sessions) setSessions(sRes.sessions);
        if (aRes.assignments) setAssignments(aRes.assignments);
        if (conRes.enquiries) setContacts(conRes.enquiries);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingEnrolments = enrolments.filter(e => e.status === 'pending');
  const todaySessions = sessions.filter(s => {
    const sDate = new Date(s.startsAt).toDateString();
    const today = new Date().toDateString();
    return sDate === today;
  });

  const handleEnrolmentAction = async (id, status) => {
    try {
      await enrolmentApi.updateEnrolmentStatus(id, status, 'Reviewed from dashboard.');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Top Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Academy Overview & Operations</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Academic Director & Tutor Control Panel • Batch hours 5:00 PM – 8:00 PM
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/sessions" className="btn btn-primary btn-sm">
            <Video size={16} />
            <span>Schedule Live Class</span>
          </Link>
          <Link to="/admin/courses" className="btn btn-outline btn-sm">
            <BookOpen size={16} />
            <span>Add Course</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          title="Pending Applications"
          value={pendingEnrolments.length}
          subtitle="Awaiting tutor approval"
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Active Batches"
          value={courses.length}
          subtitle="Across School, Commerce & Degree"
          icon={BookOpen}
          color="navy"
        />
        <StatCard
          title="Classes Scheduled"
          value={sessions.length}
          subtitle={`${todaySessions.length} session(s) today`}
          icon={Video}
          color="green"
        />
        <StatCard
          title="Admission Enquiries"
          value={contacts.length}
          subtitle="From website visitors"
          icon={MessageSquare}
          color="blue"
        />
      </div>

      {/* Two Column Layout: Today's Sessions & Pending Approvals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        {/* Today's Classes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Today's Live Classes (5–8 PM)</h3>
            </div>
            <Link to="/admin/sessions" style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>All Sessions</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {todaySessions.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
              No classes scheduled for today yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todaySessions.map(sess => (
                <div key={sess._id || sess.id} style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-navy" style={{ marginBottom: '4px' }}>{sess.courseTitle}</span>
                    <h4 style={{ fontSize: '0.98rem', color: '#0a142f', margin: '4px 0 2px' }}>{sess.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(sess.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(sess.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <a
                    href={sess.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <Video size={14} />
                    <span>Launch</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority: Pending Enrolment Requests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Pending Student Enrolments</h3>
            </div>
            <Link to="/admin/students" style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {pendingEnrolments.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
              All student enrolment requests have been reviewed!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingEnrolments.slice(0, 4).map(enr => (
                <div key={enr._id || enr.id} style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', color: '#0a142f', margin: '0 0 2px' }}>{enr.studentName}</h4>
                    <div style={{ fontSize: '0.82rem', color: '#ea580c', fontWeight: 600 }}>{enr.courseTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {enr.studentEmail} • Requested {new Date(enr.requestedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEnrolmentAction(enr._id || enr.id, 'approved')}
                      className="btn btn-sm"
                      style={{ backgroundColor: '#10b981', color: '#fff', padding: '6px 12px' }}
                      title="Approve student"
                    >
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleEnrolmentAction(enr._id || enr.id, 'rejected')}
                      className="btn btn-sm btn-outline"
                      style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '6px 10px' }}
                      title="Reject"
                    >
                      <XCircle size={14} />
                    </button>
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
