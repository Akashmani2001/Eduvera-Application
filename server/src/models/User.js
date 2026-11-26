const createModel = require('./createModel');

const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
  profile: {
    educationLevel: { type: String, default: '' },
    gradeOrCourse: { type: String, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    parentName: { type: String, default: '' },
    parentPhone: { type: String, default: '' }
  }
};

module.exports = createModel('User', userSchema);
