import React, { useEffect, useState } from 'react';
import { sessionApi } from '../../api/sessionApi';
import { enrolmentApi } from '../../api/enrolmentApi';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CalendarCheck, Save, CheckCircle, Clock } from 'lucide-react';

export const Attendance = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    sessionApi.getSessions()
      .then(res => {
        if (res.success && res.sessions.length > 0) {
          setSessions(res.sessions);
          setSelectedSessionId(res.sessions[0]._id || res.sessions[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // When selected session changes, fetch enrolled students & existing attendance
  useEffect(() => {
    if (!selectedSessionId) return;

    const currentSession = sessions.find(s => (s._id || s.id) === selectedSessionId);
    if (!currentSession) return;

    Promise.all([
      enrolmentApi.getEnrolments({ courseId: currentSession.courseId, status: 'approved' }),
      sessionApi.getSessionAttendance(selectedSessionId)
    ])
      .then(([enrRes, attRes]) => {
        const approved = enrRes.enrolments || [];
        setEnrolledStudents(approved);

        const recordMap = {};
        // Default all approved students to 'present'
        approved.forEach(e => {
          recordMap[e.studentId] = {
            studentId: e.studentId,
            studentName: e.studentName,
            status: 'present',
            remarks: ''
          };
        });

        // Overlay existing marked attendance
        if (attRes.success && attRes.attendance) {
          attRes.attendance.forEach(a => {
            recordMap[a.studentId] = {
              studentId: a.studentId,
              studentName: a.studentName,
              status: a.status,
              remarks: a.remarks || ''
            };
          });
        }

        setAttendanceRecords(recordMap);
      })
      .catch(err => console.error(err));
  }, [selectedSessionId, sessions]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSaveAttendance = async () => {
    setSaveStatus({ loading: true, success: null, error: null });

    const recordsArray = Object.values(attendanceRecords);
    if (recordsArray.length === 0) {
      setSaveStatus({ loading: false, success: null, error: 'No enrolled students to mark.' });
      return;
    }

    try {
      const res = await sessionApi.recordAttendance(selectedSessionId, recordsArray);
      setSaveStatus({ loading: false, success: res.message, error: null });
      setTimeout(() => setSaveStatus(prev => ({ ...prev, success: null })), 4000);
    } catch (err) {
      setSaveStatus({ loading: false, success: null, error: err.message });
    }
  };

  const currentSession = sessions.find(s => (s._id || s.id) === selectedSessionId);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Attendance Register</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Mark daily evening batch attendance per student with duplicate guard
          </p>
        </div>

        {selectedSessionId && (
          <button
            onClick={handleSaveAttendance}
            disabled={saveStatus.loading}
            className="btn btn-primary btn-sm"
          >
            <Save size={16} />
            <span>{saveStatus.loading ? 'Saving Register...' : 'Save Attendance'}</span>
          </button>
        )}
      </div>

      {saveStatus.success && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{saveStatus.success}</span>
        </div>
      )}

      {saveStatus.error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.9rem', marginBottom: '20px' }}>
          {saveStatus.error}
        </div>
      )}

      {/* Session Selector Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '20px 24px' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Select Live Class Session to Mark Attendance</label>
          <select
            className="form-select"
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
          >
            {sessions.map(s => (
              <option key={s._id || s.id} value={s._id || s.id}>
                {new Date(s.startsAt).toLocaleDateString()} — {s.courseTitle}: {s.title} ({new Date(s.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      {enrolledStudents.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No approved students for this course"
          description="Enrol students in this batch or choose another session to mark attendance."
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Enrolled Student</th>
                <th>Status (Present / Absent / Late)</th>
                <th>Remarks / Observations</th>
              </tr>
            </thead>
            <tbody>
              {enrolledStudents.map(enr => {
                const rec = attendanceRecords[enr.studentId] || { status: 'present', remarks: '' };

                return (
                  <tr key={enr.studentId}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0a142f' }}>{enr.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{enr.studentEmail}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                          { val: 'present', label: 'Present', color: '#10b981' },
                          { val: 'late', label: 'Late', color: '#f59e0b' },
                          { val: 'absent', label: 'Absent', color: '#ef4444' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handleStatusChange(enr.studentId, opt.val)}
                            className="btn btn-sm"
                            style={{
                              padding: '5px 12px',
                              fontSize: '0.82rem',
                              backgroundColor: rec.status === opt.val ? opt.color : '#f1f5f9',
                              color: rec.status === opt.val ? '#ffffff' : '#475569',
                              border: 'none',
                              fontWeight: 600
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        placeholder="Optional remarks (e.g. joined 10m late)..."
                        value={rec.remarks || ''}
                        onChange={e => handleRemarksChange(enr.studentId, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
