const Enrolment = require('../models/Enrolment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Request course enrolment
// @route   POST /api/enrolments
// @access  Private (Student)
const requestEnrolment = async (req, res, next) => {
  try {
    const { courseId, notes } = req.body;
    const studentId = String(req.user._id || req.user.id);

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Target course not found.' });
    }

    // Check duplicate request
    const existing = await Enrolment.findOne({
      studentId,
      courseId: String(courseId)
    });

    if (existing) {
      if (existing.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'You are already enrolled in this course.'
        });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Your enrolment request for this course is currently pending tutor review.'
        });
      }
    }

    const enrolment = await Enrolment.create({
      studentId,
      courseId: String(courseId),
      studentName: req.user.name,
      studentEmail: req.user.email,
      courseTitle: course.title,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Enrolment request submitted successfully! The tutor will review your application.',
      enrolment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get enrolments (Tutor sees all / Student sees own)
// @route   GET /api/enrolments
// @access  Private
const getEnrolments = async (req, res, next) => {
  try {
    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';
    let filter = {};

    if (!isTutorOrAdmin) {
      // Student can only view their own enrolments
      filter.studentId = String(req.user._id || req.user.id);
    } else {
      // Optional filter by status for tutor
      if (req.query.status) {
        filter.status = req.query.status;
      }
      if (req.query.courseId) {
        filter.courseId = req.query.courseId;
      }
    }

    const enrolments = await Enrolment.find(filter);

    res.json({
      success: true,
      count: enrolments.length,
      enrolments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve or reject enrolment
// @route   PATCH /api/enrolments/:id
// @access  Private (Tutor/Admin)
const updateEnrolmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending.'
      });
    }

    const enrolment = await Enrolment.findById(req.params.id);
    if (!enrolment) {
      return res.status(404).json({ success: false, message: 'Enrolment record not found.' });
    }

    const updated = await Enrolment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedBy: req.user.name,
        reviewedAt: new Date().toISOString(),
        ...(notes && { notes })
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Enrolment request has been ${status}.`,
      enrolment: updated
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestEnrolment,
  getEnrolments,
  updateEnrolmentStatus
};
