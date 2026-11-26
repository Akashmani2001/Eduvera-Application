const Material = require('../models/Material');
const Course = require('../models/Course');
const Enrolment = require('../models/Enrolment');
const path = require('path');

// @desc    Get course study materials
// @route   GET /api/materials
// @access  Private (Authorized users)
const getMaterials = async (req, res, next) => {
  try {
    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';
    const allMaterials = await Material.find();

    let permitted = [];

    if (isTutorOrAdmin) {
      permitted = allMaterials;
    } else {
      const studentId = String(req.user._id || req.user.id);
      const studentEnrolments = await Enrolment.find({
        studentId,
        status: 'approved'
      });
      const approvedCourseIds = studentEnrolments.map(e => String(e.courseId));

      permitted = allMaterials.filter(m => 
        m.visibility === 'public' || approvedCourseIds.includes(String(m.courseId))
      );
    }

    if (req.query.courseId) {
      permitted = permitted.filter(m => String(m.courseId) === String(req.query.courseId));
    }

    if (req.query.fileType) {
      permitted = permitted.filter(m => m.fileType === req.query.fileType);
    }

    res.json({
      success: true,
      count: permitted.length,
      materials: permitted
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload new study material
// @route   POST /api/materials
// @access  Private (Tutor/Admin)
const createMaterial = async (req, res, next) => {
  try {
    const { courseId, title, description, fileType, visibility } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ success: false, message: 'Course ID and title are required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Specified course not found.' });
    }

    let fileName = 'Study_Notes.pdf';
    let fileKey = 'sample-pdf-key';
    let fileUrl = '/uploads/sample-study-material.pdf';
    let fileSize = '1.4 MB';

    if (req.file) {
      fileName = req.file.originalname;
      fileKey = req.file.filename;
      fileUrl = `/uploads/${req.file.filename}`;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
    }

    const material = await Material.create({
      courseId: String(courseId),
      courseTitle: course.title,
      title: title.trim(),
      description: description || '',
      fileKey,
      fileName,
      fileType: fileType || 'pdf',
      fileUrl,
      fileSize,
      uploadedBy: String(req.user._id || req.user.id),
      uploaderName: req.user.name,
      visibility: visibility || 'enrolled'
    });

    res.status(201).json({
      success: true,
      message: 'Learning resource uploaded successfully.',
      material
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Tutor/Admin)
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found.' });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Material removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  deleteMaterial
};
