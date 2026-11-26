const express = require('express');
const router = express.Router();
const { getPrograms, getProgramBySlug, createProgram } = require('../controllers/programController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.get('/', getPrograms);
router.get('/:slug', getProgramBySlug);
router.post('/', authenticate, requireRole('tutor', 'admin'), createProgram);

module.exports = router;
