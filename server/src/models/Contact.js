const createModel = require('./createModel');

const contactSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  educationLevel: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' }
};

module.exports = createModel('Contact', contactSchema, [{ createdAt: -1 }]);
