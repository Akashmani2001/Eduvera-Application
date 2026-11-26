import React, { useEffect, useState } from 'react';
import { assignmentApi } from '../../api/assignmentApi';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { CheckSquare, Calendar, Upload, FileText, CheckCircle, Award, AlertCircle } from 'lucide-react';

export const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission modal state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: null, error: null });

  const fetchAssignments = () => {
    setLoading(true);
    assignmentApi.getAssignments()
      .then(res => {
        if (res.success) setAssignments(res.assignments);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const openSubmitModal = (assignment) => {
    setActiveAssignment(assignment);
    setSubmissionText(assignment.mySubmission?.text || '');
    setSubmissionFile(null);
    setSubmitStatus({ loading: false, success: null, error: null });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setSubmitStatus({ loading: true, success: null, error: null });
    const formData = new FormData();
    formData.append('text', submissionText);
    if (submissionFile) {
      formData.append('file', submissionFile);
    }

    try {
      const res = await assignmentApi.submitAssignment(
        activeAssignment._id || activeAssignment.id,
        formData
      );
      setSubmitStatus({ loading: false, success: res.message, error: null });
      fetchAssignments();
      setTimeout(() => {
        setActiveAssignment(null);
      }, 1500);
    } catch (err) {
      setSubmitStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Assignments & Assessments</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Submit tests, solve homework assignments, and review tutor feedback
          </p>
        </div>
        <button onClick={fetchAssignments} className="btn btn-outline btn-sm">
          Refresh List
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading assignments...
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No assignments assigned"
          description="Your course tutor hasn't posted any homework or tests yet."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {assignments.map(ass => {
            const hasSubmission = !!ass.mySubmission;
            const isGraded = ass.mySubmission?.status === 'graded';

            return (
              <div key={ass._id || ass.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-navy">{ass.courseTitle}</span>
                      <Badge
                        status={isGraded ? 'graded' : hasSubmission ? 'submitted' : 'pending'}
                        text={isGraded ? 'Graded' : hasSubmission ? 'Submitted' : 'Pending Submission'}
                      />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0a142f', margin: '4px 0' }}>
                      {ass.title}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c' }}>
                      Max Marks: {ass.maxMarks}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Due: {new Date(ass.dueAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 600, color: '#0a142f', marginBottom: '4px' }}>Instructions:</div>
                  {ass.instructions}
                </div>

                {/* If Graded: show marks and feedback */}
                {isGraded && (
                  <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                      <Award size={18} />
                      <span>Marks Awarded: {ass.mySubmission.marks} / {ass.maxMarks}</span>
                    </div>
                    {ass.mySubmission.feedback && (
                      <p style={{ fontSize: '0.88rem', color: '#047857', margin: 0 }}>
                        <strong>Tutor Feedback:</strong> {ass.mySubmission.feedback}
                      </p>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => openSubmitModal(ass)}
                    className="btn btn-primary btn-sm"
                  >
                    <Upload size={15} />
                    <span>{hasSubmission ? 'Update / Resubmit Response' : 'Submit Assignment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        title={activeAssignment ? `Submit: ${activeAssignment.title}` : 'Submit Assignment'}
      >
        {activeAssignment && (
          <form onSubmit={handleSubmission}>
            {submitStatus.success && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.9rem', marginBottom: '16px' }}>
                {submitStatus.success}
              </div>
            )}

            {submitStatus.error && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.9rem', marginBottom: '16px' }}>
                {submitStatus.error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Written Answer / Solution Notes</label>
              <textarea
                rows={5}
                className="form-textarea"
                placeholder="Type your explanation, answers, or solution steps..."
                value={submissionText}
                onChange={e => setSubmissionText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Or Attach Answer Sheet (PDF, Image, Word)</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={e => setSubmissionFile(e.target.files[0])}
              />
              <span className="form-hint">Accepted formats: PDF, Word, JPEG/PNG up to 15MB.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveAssignment(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitStatus.loading}
                className="btn btn-primary btn-sm"
              >
                {submitStatus.loading ? 'Submitting...' : 'Upload & Submit'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
