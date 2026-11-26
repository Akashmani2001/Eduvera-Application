const createModel = require('./createModel');

const assignmentSchema = {
  courseId: { type: String, required: true },
  courseTitle: { type: String, default: '' },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  dueAt: { type: String, required: true }, // ISO string
  maxMarks: { type: Number, default: 100 },
  allowedTypes: [{ type: String }], // 'text', 'pdf', 'file'
  status: { type: String, enum: ['published', 'draft', 'closed'], default: 'published' },
  createdBy: { type: String, required: true }
};

module.exports = createModel('Assignment', assignmentSchema, [{ courseId: 1, dueAt: 1 }]);
