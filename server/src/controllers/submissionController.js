const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Enrolment = require('../models/Enrolment');

// @desc    Submit assignment response
// @route   POST /api/assignments/:id/submissions
// @access  Private (Enrolled Student)
const submitAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    const studentId = String(req.user._id || req.user.id);
    const { text } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    // Verify student is enrolled
    const enrolment = await Enrolment.findOne({
      studentId,
      courseId: String(assignment.courseId),
      status: 'approved'
    });

    if (!enrolment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in the course associated with this assignment.'
      });
    }

    let fileName = '';
    let fileKey = '';
    let fileUrl = '';

    if (req.file) {
      fileName = req.file.originalname;
      fileKey = req.file.filename;
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a text response or upload a file.'
      });
    }

    // Check existing submission
    const existing = await Submission.findOne({ assignmentId: String(assignmentId), studentId });
    const isLate = new Date() > new Date(assignment.dueAt);

    let submission;
    if (existing) {
      // Update existing submission
      submission = await Submission.findByIdAndUpdate(
        existing._id || existing.id,
        {
          text: text || existing.text,
          ...(req.file && { fileName, fileKey, fileUrl }),
          submittedAt: new Date().toISOString(),
          status: isLate ? 'late' : 'submitted'
        },
        { new: true }
      );
    } else {
      submission = await Submission.create({
        assignmentId: String(assignmentId),
        courseId: String(assignment.courseId),
        studentId,
        studentName: req.user.name,
        assignmentTitle: assignment.title,
        text: text || '',
        fileName,
        fileKey,
        fileUrl,
        submittedAt: new Date().toISOString(),
        status: isLate ? 'late' : 'submitted'
      });
    }

    res.status(201).json({
      success: true,
      message: isLate ? 'Assignment submitted (marked Late).' : 'Assignment submitted successfully!',
      submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Tutor/Admin)
const getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignmentId: String(req.params.id) });
    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Grade submission and provide feedback
// @route   PATCH /api/submissions/:id/grade
// @access  Private (Tutor/Admin)
const gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const submissionId = req.params.id;

    if (marks === undefined || marks === null) {
      return res.status(400).json({ success: false, message: 'Marks are required.' });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    const updated = await Submission.findByIdAndUpdate(
      submissionId,
      {
        marks: Number(marks),
        feedback: feedback || '',
        gradedBy: req.user.name,
        gradedAt: new Date().toISOString(),
        status: 'graded'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Submission graded successfully.',
      submission: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current student's results & submissions
// @route   GET /api/submissions/my
// @access  Private (Student)
const getMySubmissions = async (req, res, next) => {
  try {
    const studentId = String(req.user._id || req.user.id);
    const submissions = await Submission.find({ studentId });

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getMySubmissions
};
