const createModel = require('./createModel');

const enrolmentSchema = {
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  studentName: { type: String, default: '' },
  studentEmail: { type: String, default: '' },
  courseTitle: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: String },
  reviewedBy: { type: String, default: null },
  reviewedAt: { type: String, default: null },
  notes: { type: String, default: '' }
};

module.exports = createModel('Enrolment', enrolmentSchema, [{ studentId: 1, courseId: 1 }]);
