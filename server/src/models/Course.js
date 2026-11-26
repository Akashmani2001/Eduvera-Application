const createModel = require('./createModel');

const courseSchema = {
  programId: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, required: true },
  description: { type: String, default: '' },
  syllabus: [{ type: String }],
  tutorIds: [{ type: String }],
  tutorName: { type: String, default: 'VM Eduvera Academic Team' },
  scheduleDays: [{ type: String }],
  scheduleTime: { type: String, default: '5:00 PM - 8:00 PM' },
  duration: { type: String, default: 'Academic Year 2026-27' },
  active: { type: Boolean, default: true }
};

module.exports = createModel('Course', courseSchema, [{ programId: 1 }]);
