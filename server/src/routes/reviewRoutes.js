const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/public', reviewController.getPublicReviews);
router.get('/tutors', reviewController.getTutorsAndSubjects);

// Student protected endpoints
router.get('/my', authenticate, requireRole('student', 'admin'), reviewController.getMyReviews);
router.post('/', authenticate, requireRole('student', 'admin'), reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
