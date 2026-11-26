const createModel = require('./createModel');

const submissionSchema = {
  assignmentId: { type: String, required: true },
  courseId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, default: '' },
  assignmentTitle: { type: String, default: '' },
  text: { type: String, default: '' },
  fileKey: { type: String, default: '' },
  fileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  submittedAt: { type: String, required: true },
  marks: { type: Number, default: null },
  feedback: { type: String, default: '' },
  gradedBy: { type: String, default: null },
  gradedAt: { type: String, default: null },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' }
};

module.exports = createModel('Submission', submissionSchema, [{ assignmentId: 1, studentId: 1 }]);
