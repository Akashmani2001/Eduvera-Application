import React, { useEffect, useState } from 'react';
import { sessionApi } from '../../api/sessionApi';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Video, Calendar, Clock, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

export const Classes = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchSessions = () => {
    setLoading(true);
    sessionApi.getSessions()
      .then(res => {
        if (res.success) setSessions(res.sessions);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleJoin = async (session) => {
    setErrorMsg(null);
    try {
      const res = await sessionApi.joinSession(session._id || session.id);
      if (res.meetingUrl) {
        window.open(res.meetingUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 6000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Live Classes & Timetable</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Scheduled tuition sessions between 5:00 PM and 8:00 PM (IST)
          </p>
        </div>
        <button onClick={fetchSessions} className="btn btn-outline btn-sm">
          Refresh Timetable
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '14px 20px', borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading your class timetable...
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No live classes scheduled"
          description="You currently have no scheduled live classes for your enrolled courses. Check back soon or browse additional courses."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {sessions.map((session) => {
            const isLive = session.status === 'live';
            const isCompleted = session.status === 'completed';

            return (
              <div
                key={session._id || session.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  padding: '22px 26px',
                  borderLeft: isLive ? '5px solid #ea580c' : isCompleted ? '5px solid #cbd5e1' : '5px solid #14224c',
                  backgroundColor: isLive ? '#fffaf5' : '#ffffff'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Badge status={session.status} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ea580c' }}>
                      {session.courseTitle}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#0a142f', marginBottom: '6px' }}>
                    {session.title}
                  </h3>

                  {session.agenda && (
                    <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>
                      {session.agenda}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="#ea580c" />
                      <span>{new Date(session.startsAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="#ea580c" />
                      <span>{new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(session.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (IST)</span>
                    </div>
                    <div>
                      Platform: <strong>{session.provider || 'Google Meet'}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
                      <CheckCircle size={18} color="#10b981" />
                      <span>Class Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(session)}
                      className={`btn ${isLive ? 'btn-primary live-pulse-btn' : 'btn-primary'}`}
                      style={{ padding: '12px 24px' }}
                    >
                      <Video size={16} />
                      <span>{isLive ? 'Join Live Now' : 'Join Class'}</span>
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
