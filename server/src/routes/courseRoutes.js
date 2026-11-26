const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticate, requireRole('tutor', 'admin'), createCourse);
router.put('/:id', authenticate, requireRole('tutor', 'admin'), updateCourse);
router.delete('/:id', authenticate, requireRole('tutor', 'admin'), deleteCourse);

module.exports = router;
