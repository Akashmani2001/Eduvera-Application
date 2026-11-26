const createModel = require('./createModel');

const sessionSchema = {
  courseId: { type: String, required: true },
  courseTitle: { type: String, default: '' },
  tutorId: { type: String, required: true },
  tutorName: { type: String, default: 'Head Tutor' },
  title: { type: String, required: true },
  agenda: { type: String, default: '' },
  startsAt: { type: String, required: true }, // ISO string
  endsAt: { type: String, required: true },   // ISO string
  timeZone: { type: String, default: 'Asia/Kolkata' },
  provider: { type: String, enum: ['Google Meet', 'Zoom', 'Microsoft Teams'], default: 'Google Meet' },
  meetingUrl: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' }
};

module.exports = createModel('Session', sessionSchema, [{ courseId: 1, startsAt: 1 }]);
