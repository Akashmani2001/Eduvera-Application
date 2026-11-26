const express = require('express');
const router = express.Router();
const { getSessions, createSession, updateSession, joinSession } = require('../controllers/sessionController');
const { getSessionAttendance, recordAttendance } = require('../controllers/attendanceController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticate, getSessions);
router.post('/', authenticate, requireRole('tutor', 'admin'), createSession);
router.patch('/:id', authenticate, requireRole('tutor', 'admin'), updateSession);
router.post('/:id/join', authenticate, joinSession);

// Attendance endpoints attached to sessions per Section 11 REST plan
router.get('/:id/attendance', authenticate, getSessionAttendance);
router.post('/:id/attendance', authenticate, requireRole('tutor', 'admin'), recordAttendance);

module.exports = router;
