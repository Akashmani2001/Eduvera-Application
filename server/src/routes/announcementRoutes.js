const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticate, getAnnouncements);
router.post('/', authenticate, requireRole('tutor', 'admin'), createAnnouncement);

module.exports = router;
