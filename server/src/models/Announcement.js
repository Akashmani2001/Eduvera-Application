const createModel = require('./createModel');

const announcementSchema = {
  title: { type: String, required: true },
  body: { type: String, required: true },
  courseId: { type: String, default: null }, // null = all courses
  courseTitle: { type: String, default: 'All Academy' },
  audience: { type: String, enum: ['all', 'course'], default: 'all' },
  priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
  createdBy: { type: String, required: true },
  authorName: { type: String, default: 'VM Eduvera Admin' }
};

module.exports = createModel('Announcement', announcementSchema, [{ courseId: 1, createdAt: -1 }]);
