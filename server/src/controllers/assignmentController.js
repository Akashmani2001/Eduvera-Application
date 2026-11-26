const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Enrolment = require('../models/Enrolment');
const Submission = require('../models/Submission');

// @desc    Get assignments
// @route   GET /api/assignments
// @access  Private (Authorized users)
const getAssignments = async (req, res, next) => {
  try {
    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';
    const allAssignments = await Assignment.find();

    let permitted = [];

    if (isTutorOrAdmin) {
      permitted = allAssignments;
      // Attach submission stats for tutor
      const allSubmissions = await Submission.find();
      permitted = permitted.map(a => {
        const subs = allSubmissions.filter(s => String(s.assignmentId) === String(a._id) || String(s.assignmentId) === String(a.id));
        const gradedCount = subs.filter(s => s.status === 'graded').length;
        return {
          ...a,
          submissionCount: subs.length,
          gradedCount
        };
      });
    } else {
      const studentId = String(req.user._id || req.user.id);
      const studentEnrolments = await Enrolment.find({
        studentId,
        status: 'approved'
      });
      const approvedCourseIds = studentEnrolments.map(e => String(e.courseId));

      permitted = allAssignments.filter(a => 
        a.status === 'published' && approvedCourseIds.includes(String(a.courseId))
      );

      // Attach student's personal submission status
      const mySubmissions = await Submission.find({ studentId });
      permitted = permitted.map(a => {
        const mySub = mySubmissions.find(s => String(s.assignmentId) === String(a._id) || String(s.assignmentId) === String(a.id));
        return {
          ...a,
          mySubmission: mySub || null,
          isSubmitted: !!mySub
        };
      });
    }

    if (req.query.courseId) {
      permitted = permitted.filter(a => String(a.courseId) === String(req.query.courseId));
    }

    // Sort by due date
    permitted.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

    res.json({
      success: true,
      count: permitted.length,
      assignments: permitted
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Tutor/Admin)
const createAssignment = async (req, res, next) => {
  try {
    const { courseId, title, instructions, dueAt, maxMarks, allowedTypes } = req.body;

    if (!courseId || !title || !instructions || !dueAt) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, title, instructions, and due date are required.'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Target course not found.' });
    }

    const assignment = await Assignment.create({
      courseId: String(courseId),
      courseTitle: course.title,
      title: title.trim(),
      instructions: instructions.trim(),
      dueAt,
      maxMarks: Number(maxMarks) || 100,
      allowedTypes: allowedTypes || ['text', 'pdf', 'file'],
      status: 'published',
      createdBy: String(req.user._id || req.user.id)
    });

    res.status(201).json({
      success: true,
      message: 'Assignment published successfully.',
      assignment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    let mySubmission = null;
    if (req.user.role === 'student') {
      const studentId = String(req.user._id || req.user.id);
      mySubmission = await Submission.findOne({
        assignmentId: String(req.params.id),
        studentId
      });
    }

    res.json({
      success: true,
      assignment,
      mySubmission
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  getAssignmentById
};
