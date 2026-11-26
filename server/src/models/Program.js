const createModel = require('./createModel');

const programSchema = {
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['School', 'Commerce', 'Higher Education'], required: true },
  description: { type: String, default: '' },
  targetAudience: { type: String, default: '' },
  icon: { type: String, default: 'GraduationCap' },
  active: { type: Boolean, default: true }
};

module.exports = createModel('Program', programSchema);
