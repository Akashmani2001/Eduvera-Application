const express = require('express');
const router = express.Router();
const { requestEnrolment, getEnrolments, updateEnrolmentStatus } = require('../controllers/enrolmentController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.post('/', authenticate, requireRole('student'), requestEnrolment);
router.get('/', authenticate, getEnrolments);
router.patch('/:id', authenticate, requireRole('tutor', 'admin'), updateEnrolmentStatus);

module.exports = router;
