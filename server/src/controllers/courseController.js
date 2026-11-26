const Course = require('../models/Course');
const Program = require('../models/Program');

// @desc    Get courses with optional program, level, or search filter
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { programId, level, search, activeOnly } = req.query;
    let courses = await Course.find();

    if (activeOnly !== 'false') {
      courses = courses.filter(c => c.active !== false);
    }

    if (programId) {
      courses = courses.filter(c => String(c.programId) === String(programId));
    }

    if (level) {
      courses = courses.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.subject && c.subject.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const program = await Program.findById(course.programId);

    res.json({
      success: true,
      course,
      program
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Tutor/Admin)
const createCourse = async (req, res, next) => {
  try {
    const { programId, title, subject, level, description, syllabus, scheduleDays, scheduleTime, duration } = req.body;

    if (!programId || !title || !subject || !level) {
      return res.status(400).json({
        success: false,
        message: 'Program, title, subject, and grade/level are required.'
      });
    }

    const course = await Course.create({
      programId,
      title: title.trim(),
      subject: subject.trim(),
      level: level.trim(),
      description: description || '',
      syllabus: Array.isArray(syllabus) ? syllabus : (syllabus ? syllabus.split('\n').filter(Boolean) : []),
      tutorIds: [req.user._id || req.user.id],
      tutorName: req.user.name,
      scheduleDays: scheduleDays || ['Monday', 'Wednesday', 'Friday'],
      scheduleTime: scheduleTime || '5:00 PM - 8:00 PM',
      duration: duration || 'Academic Year 2026-27',
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Tutor/Admin)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      success: true,
      message: 'Course updated successfully.',
      course: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Tutor/Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
