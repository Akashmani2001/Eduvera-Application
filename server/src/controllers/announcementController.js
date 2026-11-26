const Announcement = require('../models/Announcement');
const Enrolment = require('../models/Enrolment');
const Course = require('../models/Course');

// @desc    Get announcements (Academy-wide or enrolled courses)
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';
    const all = await Announcement.find();

    let permitted = [];

    if (isTutorOrAdmin) {
      permitted = all;
    } else {
      const studentId = String(req.user._id || req.user.id);
      const studentEnrolments = await Enrolment.find({ studentId, status: 'approved' });
      const approvedCourseIds = studentEnrolments.map(e => String(e.courseId));

      permitted = all.filter(a => 
        a.audience === 'all' || !a.courseId || approvedCourseIds.includes(String(a.courseId))
      );
    }

    // Sort newest first
    permitted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: permitted.length,
      announcements: permitted
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Tutor/Admin)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, body, courseId, audience, priority } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    let courseTitle = 'All Academy';
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) courseTitle = course.title;
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      body: body.trim(),
      courseId: courseId || null,
      courseTitle,
      audience: courseId ? 'course' : (audience || 'all'),
      priority: priority || 'normal',
      createdBy: String(req.user._id || req.user.id),
      authorName: req.user.name
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      announcement
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement
};
