import React, { useEffect, useState } from 'react';
import { enrolmentApi } from '../../api/enrolmentApi';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Users, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

export const Students = () => {
  const [enrolments, setEnrolments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const fetchEnrolments = () => {
    setLoading(true);
    enrolmentApi.getEnrolments()
      .then(res => {
        if (res.success) setEnrolments(res.enrolments);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnrolments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await enrolmentApi.updateEnrolmentStatus(id, status, `Updated by tutor on ${new Date().toLocaleDateString()}`);
      fetchEnrolments();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = enrolments.filter(e => {
    const matchStatus = filterStatus === 'All' || e.status === filterStatus.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      e.studentName.toLowerCase().includes(q) ||
      e.studentEmail.toLowerCase().includes(q) ||
      e.courseTitle.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Student Enrolments & Admissions</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Review, approve or reject student course enrolment applications
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading enrolments...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrolment applications found"
          description="There are no student applications matching your current filter."
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Course Applied For</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Review Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(enr => (
                <tr key={enr._id || enr.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0a142f' }}>{enr.studentName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{enr.studentEmail}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#ea580c' }}>{enr.courseTitle}</span>
                  </td>
                  <td style={{ fontSize: '0.84rem' }}>
                    {new Date(enr.requestedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <Badge status={enr.status} />
                  </td>
                  <td style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '200px' }}>
                    {enr.notes || '—'}
                  </td>
                  <td>
                    {enr.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateStatus(enr._id || enr.id, 'approved')}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#10b981', color: '#fff', padding: '6px 12px' }}
                        >
                          <CheckCircle size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(enr._id || enr.id, 'rejected')}
                          className="btn btn-sm btn-outline"
                          style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '6px 12px' }}
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Reviewed by {enr.reviewedBy || 'Faculty'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
