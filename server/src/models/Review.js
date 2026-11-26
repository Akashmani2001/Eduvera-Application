const createModel = require('./createModel');

const reviewSchema = {
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentGrade: { type: String, default: 'Student' },
  studentAvatar: { type: String, default: '' },
  tutorId: { type: String, required: true },
  tutorName: { type: String, required: true },
  courseId: { type: String, default: '' },
  subject: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  aspects: {
    clarity: { type: Number, default: 5 },
    doubtSolving: { type: Number, default: 5 },
    punctuality: { type: Number, default: 5 }
  },
  status: { type: String, enum: ['approved', 'pending', 'hidden'], default: 'approved' },
  isFeatured: { type: Boolean, default: true }
};

module.exports = createModel('Review', reviewSchema);
