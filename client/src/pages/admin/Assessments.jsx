import React, { useEffect, useState } from 'react';
import { assignmentApi } from '../../api/assignmentApi';
import { courseApi } from '../../api/courseApi';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CheckSquare, Plus, Award, User, FileText, CheckCircle } from 'lucide-react';

export const Assessments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    instructions: '',
    dueAt: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    maxMarks: 50
  });

  // Review Submissions Modal
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [gradeInputs, setGradeInputs] = useState({});

  const fetchData = () => {
    setLoading(true);
    Promise.all([assignmentApi.getAssignments(), courseApi.getCourses()])
      .then(([aRes, cRes]) => {
        if (aRes.success) setAssignments(aRes.assignments);
        if (cRes.success) {
          setCourses(cRes.courses);
          if (cRes.courses.length > 0 && !formData.courseId) {
            setFormData(prev => ({ ...prev, courseId: cRes.courses[0]._id || cRes.courses[0].id }));
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      courseId: courses[0]?._id || courses[0]?.id || '',
      title: '',
      instructions: '',
      dueAt: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      maxMarks: 50
    });
    setModalOpen(true);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await assignmentApi.createAssignment({
        courseId: formData.courseId,
        title: formData.title,
        instructions: formData.instructions,
        dueAt: new Date(`${formData.dueAt}T23:59:59`).toISOString(),
        maxMarks: Number(formData.maxMarks)
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openSubmissionsModal = async (assignment) => {
    setActiveAssignment(assignment);
    setLoadingSubs(true);
    try {
      const res = await assignmentApi.getSubmissionsForAssignment(assignment._id || assignment.id);
      if (res.success) {
        setSubmissions(res.submissions);
        const initialGrades = {};
        res.submissions.forEach(s => {
          initialGrades[s._id || s.id] = {
            marks: s.marks !== null ? s.marks : '',
            feedback: s.feedback || ''
          };
        });
        setGradeInputs(initialGrades);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleSaveGrade = async (subId) => {
    const data = gradeInputs[subId];
    if (!data || data.marks === '') {
      alert('Please enter a marks value.');
      return;
    }

    try {
      await assignmentApi.gradeSubmission(subId, {
        marks: Number(data.marks),
        feedback: data.feedback
      });
      alert('Grade and feedback published successfully!');
      openSubmissionsModal(activeAssignment);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0a142f', margin: 0 }}>Assessments & Grading Desk</h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Publish homework assignments, review student submissions, and award marks
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Publish New Assignment</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading assessments...
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No assessments published"
          description="Create tests or homework assignments for your classes."
          actionLabel="Create Assessment"
          onAction={openCreateModal}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Course Batch</th>
                <th>Due Date</th>
                <th>Max Marks</th>
                <th>Submissions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(ass => (
                <tr key={ass._id || ass.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0a142f' }}>{ass.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ass.instructions}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#ea580c' }}>{ass.courseTitle}</span>
                  </td>
                  <td>{new Date(ass.dueAt).toLocaleDateString()}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{ass.maxMarks}</span>
                  </td>
                  <td>
                    <span className="badge badge-navy">
                      {ass.submissionCount || 0} Submitted ({ass.gradedCount || 0} Graded)
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openSubmissionsModal(ass)}
                      className="btn btn-outline btn-sm"
                    >
                      <Award size={14} />
                      <span>Review & Grade</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Assessment / Test"
      >
        <form onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label className="form-label">Course Batch *</label>
            <select
              required
              className="form-select"
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
            >
              {courses.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assignment Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Weekly Assessment 05: Trigonometric Identities"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Submission Due Date *</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.dueAt}
                onChange={e => setFormData({ ...formData, dueAt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Total Marks *</label>
              <input
                type="number"
                required
                min={1}
                className="form-input"
                value={formData.maxMarks}
                onChange={e => setFormData({ ...formData, maxMarks: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instructions for Students *</label>
            <textarea
              rows={4}
              required
              className="form-textarea"
              placeholder="Write the questions, submission guidelines, or test requirements..."
              value={formData.instructions}
              onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Publish Assessment
            </button>
          </div>
        </form>
      </Modal>

      {/* Review & Grade Submissions Modal */}
      <Modal
        isOpen={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        title={activeAssignment ? `Submissions: ${activeAssignment.title}` : 'Submissions'}
        maxWidth="750px"
      >
        {loadingSubs ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            Loading student submissions...
          </div>
        ) : submissions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
            No students have submitted solutions for this assessment yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {submissions.map(sub => {
              const subId = sub._id || sub.id;
              const inputState = gradeInputs[subId] || { marks: '', feedback: '' };

              return (
                <div key={subId} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: '#0a142f', margin: 0 }}>{sub.studentName}</h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Submitted on {new Date(sub.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    <Badge status={sub.status} text={sub.status === 'graded' ? 'Graded' : 'Needs Grading'} />
                  </div>

                  {sub.text && (
                    <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#334155', marginBottom: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#0a142f', marginBottom: '4px' }}>Student Response:</div>
                      {sub.text}
                    </div>
                  )}

                  {sub.fileUrl && (
                    <div style={{ marginBottom: '14px' }}>
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={14} />
                        <span>View Attachment: {sub.fileName || 'Solution PDF'}</span>
                      </a>
                    </div>
                  )}

                  {/* Grading Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '12px', alignItems: 'flex-end', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Marks (/{activeAssignment?.maxMarks})</label>
                      <input
                        type="number"
                        min={0}
                        max={activeAssignment?.maxMarks}
                        className="form-input"
                        placeholder="Marks"
                        value={inputState.marks}
                        onChange={e => setGradeInputs({
                          ...gradeInputs,
                          [subId]: { ...inputState, marks: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Feedback & Observations</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Great method, minor sign error in question 3."
                        value={inputState.feedback}
                        onChange={e => setGradeInputs({
                          ...gradeInputs,
                          [subId]: { ...inputState, feedback: e.target.value }
                        })}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveGrade(subId)}
                      className="btn btn-primary btn-sm"
                    >
                      Save Grade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};
