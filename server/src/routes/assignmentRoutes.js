const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, getAssignmentById } = require('../controllers/assignmentController');
const { submitAssignment, getSubmissionsForAssignment, gradeSubmission, getMySubmissions } = require('../controllers/submissionController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', authenticate, getAssignments);
router.post('/', authenticate, requireRole('tutor', 'admin'), createAssignment);
router.get('/:id', authenticate, getAssignmentById);

// Submissions for this assignment
router.post('/:id/submissions', authenticate, requireRole('student'), upload.single('file'), submitAssignment);
router.get('/:id/submissions', authenticate, requireRole('tutor', 'admin'), getSubmissionsForAssignment);

module.exports = router;
