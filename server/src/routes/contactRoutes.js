const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', authenticate, requireRole('tutor', 'admin'), getContacts);

module.exports = router;
