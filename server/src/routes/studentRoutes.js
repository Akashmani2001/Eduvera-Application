const express = require('express');
const router = express.Router();
const { getStudentProgress } = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/me/progress', authenticate, getStudentProgress);

module.exports = router;
