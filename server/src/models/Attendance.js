const createModel = require('./createModel');

const attendanceSchema = {
  sessionId: { type: String, required: true },
  studentId: { type: String, required: true },
  courseId: { type: String, default: '' },
  studentName: { type: String, default: '' },
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  markedBy: { type: String, required: true },
  markedAt: { type: String, required: true },
  remarks: { type: String, default: '' }
};

module.exports = createModel('Attendance', attendanceSchema, [{ sessionId: 1, studentId: 1 }]);
