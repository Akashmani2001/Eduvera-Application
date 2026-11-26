const createModel = require('./createModel');

const materialSchema = {
  courseId: { type: String, required: true },
  courseTitle: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fileKey: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'presentation', 'worksheet', 'notes', 'media'], default: 'pdf' },
  fileUrl: { type: String, default: '' },
  fileSize: { type: String, default: '1.2 MB' },
  uploadedBy: { type: String, required: true },
  uploaderName: { type: String, default: 'Academic Faculty' },
  visibility: { type: String, enum: ['enrolled', 'public'], default: 'enrolled' }
};

module.exports = createModel('Material', materialSchema, [{ courseId: 1 }]);
