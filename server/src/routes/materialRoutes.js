const express = require('express');
const router = express.Router();
const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/materialController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', authenticate, getMaterials);
router.post('/', authenticate, requireRole('tutor', 'admin'), upload.single('file'), createMaterial);
router.delete('/:id', authenticate, requireRole('tutor', 'admin'), deleteMaterial);

module.exports = router;
