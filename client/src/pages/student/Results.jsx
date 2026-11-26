import React, { useEffect, useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Award, CalendarCheck, CheckCircle, Clock, FileText } from 'lucide-react';

export const Results = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceApi.getStudentProgress()
      .then(res => {
        if (res.success) setProgress(res.progress);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const attendance = progress?.attendance;
  const assessments = progress?.assessments;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Progress, Results & Attendance</h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
          Personal academic scorecard, assessment marks, and class attendance register
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading your progress report...
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <StatCard
              title="Attendance Rate"
              value={`${attendance?.rate ?? 100}%`}
              subtitle={`${attendance?.present ?? 0} Present • ${attendance?.late ?? 0} Late • ${attendance?.absent ?? 0} Absent`}
              icon={CalendarCheck}
              color="green"
            />
            <StatCard
              title="Average Assessment Score"
              value={`${assessments?.averageScore ?? 0}%`}
              subtitle="From all graded coursework"
              icon={Award}
              color="orange"
            />
            <StatCard
              title="Graded Assessments"
              value={assessments?.completedCount ?? 0}
              subtitle="Tests & homework evaluated"
              icon={FileText}
              color="blue"
            />
          </div>

          {/* Assessment Results Table */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0a142f', marginBottom: '16px' }}>
              Assessment & Test Scores
            </h3>

            {!assessments?.submissions || assessments.submissions.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                No completed or graded assessments recorded yet.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Assessment Title</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Marks</th>
                      <th>Tutor Remarks & Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.submissions.map(sub => (
                      <tr key={sub._id || sub.id}>
                        <td style={{ fontWeight: 600 }}>{sub.assignmentTitle}</td>
                        <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                        <td>
                          <Badge status={sub.status} text={sub.status === 'graded' ? 'Graded' : 'Submitted'} />
                        </td>
                        <td>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: sub.marks ? '#ea580c' : '#64748b' }}>
                            {sub.marks !== null ? `${sub.marks} pts` : 'Pending'}
                          </span>
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.88rem' }}>
                          {sub.feedback || 'Evaluation in progress.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Attendance Log Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', color: '#0a142f', marginBottom: '16px' }}>
              Attendance Register History
            </h3>

            {!attendance?.records || attendance.records.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                No session attendance records posted yet.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Marked Date</th>
                      <th>Status</th>
                      <th>Marked By</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.records.map(att => (
                      <tr key={att._id || att.id}>
                        <td>{new Date(att.markedAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <Badge status={att.status} text={att.status.toUpperCase()} />
                        </td>
                        <td>{att.markedBy || 'Academic Tutor'}</td>
                        <td style={{ color: '#64748b' }}>{att.remarks || 'Standard attendance recorded'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
