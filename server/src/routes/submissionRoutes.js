const express = require('express');
const router = express.Router();
const { gradeSubmission, getMySubmissions } = require('../controllers/submissionController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.get('/my', authenticate, requireRole('student'), getMySubmissions);
router.patch('/:id/grade', authenticate, requireRole('tutor', 'admin'), gradeSubmission);

module.exports = router;
