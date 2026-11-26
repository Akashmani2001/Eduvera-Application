const Review = require('../models/Review');
const User = require('../models/User');
const Course = require('../models/Course');

/**
 * GET /api/reviews/public
 * Fetches all approved reviews for the landing page with aggregated statistics
 */
exports.getPublicReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' });

    // Sort newest first
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate statistics
    const totalReviews = reviews.length;
    let totalScore = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let claritySum = 0;
    let doubtSolvingSum = 0;
    let punctualitySum = 0;

    reviews.forEach(rev => {
      const r = Math.round(rev.rating) || 5;
      totalScore += rev.rating || 5;
      if (ratingDistribution[r] !== undefined) {
        ratingDistribution[r] += 1;
      }

      if (rev.aspects) {
        claritySum += Number(rev.aspects.clarity) || 5;
        doubtSolvingSum += Number(rev.aspects.doubtSolving) || 5;
        punctualitySum += Number(rev.aspects.punctuality) || 5;
      } else {
        claritySum += 5;
        doubtSolvingSum += 5;
        punctualitySum += 5;
      }
    });

    const averageRating = totalReviews > 0 ? (totalScore / totalReviews).toFixed(1) : '5.0';
    const clarityAvg = totalReviews > 0 ? (claritySum / totalReviews).toFixed(1) : '5.0';
    const doubtSolvingAvg = totalReviews > 0 ? (doubtSolvingSum / totalReviews).toFixed(1) : '5.0';
    const punctualityAvg = totalReviews > 0 ? (punctualitySum / totalReviews).toFixed(1) : '5.0';

    const positiveCount = (ratingDistribution[5] || 0) + (ratingDistribution[4] || 0);
    const satisfactionRate = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 100;

    res.json({
      success: true,
      reviews,
      stats: {
        totalReviews,
        averageRating: Number(averageRating),
        ratingDistribution,
        satisfactionRate,
        aspects: {
          clarity: Number(clarityAvg),
          doubtSolving: Number(doubtSolvingAvg),
          punctuality: Number(punctualityAvg)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/tutors
 * Returns list of tutors and courses so students can easily choose whom to review
 */
exports.getTutorsAndSubjects = async (req, res, next) => {
  try {
    const tutors = await User.find({ role: 'tutor' });
    const courses = await Course.find({ active: true });

    const safeTutors = tutors.map(t => ({
      _id: t._id || t.id,
      name: t.name,
      bio: t.profile?.bio || '',
      educationLevel: t.profile?.educationLevel || '',
      avatar: t.profile?.avatar || ''
    }));

    const safeCourses = courses.map(c => ({
      _id: c._id || c.id,
      title: c.title,
      subject: c.subject,
      level: c.level,
      tutorName: c.tutorName
    }));

    res.json({
      success: true,
      tutors: safeTutors,
      courses: safeCourses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/my
 * Returns all reviews submitted by the authenticated student
 */
exports.getMyReviews = async (req, res, next) => {
  try {
    const studentId = String(req.user._id || req.user.id);
    const allReviews = await Review.find({});
    const myReviews = allReviews.filter(r => String(r.studentId) === studentId);

    myReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      reviews: myReviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/reviews
 * Creates a new review submitted by a student
 */
exports.createReview = async (req, res, next) => {
  try {
    const {
      tutorId,
      tutorName,
      courseId,
      subject,
      rating,
      title,
      comment,
      aspects
    } = req.body;

    if (!rating || !comment || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, review title, and detailed feedback.'
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars.'
      });
    }

    // Default tutor details if not selected
    let selectedTutorName = tutorName;
    let selectedTutorId = tutorId;

    if (!selectedTutorName || !selectedTutorId) {
      const defaultTutor = await User.findOne({ role: 'tutor' });
      if (defaultTutor) {
        selectedTutorName = defaultTutor.name;
        selectedTutorId = String(defaultTutor._id || defaultTutor.id);
      } else {
        selectedTutorName = 'Prof. Vikram Mohan';
        selectedTutorId = 'default-tutor';
      }
    }

    const studentGrade = req.user.profile?.gradeOrCourse || req.user.profile?.educationLevel || 'Enrolled Student';

    const newReview = await Review.create({
      studentId: String(req.user._id || req.user.id),
      studentName: req.user.name,
      studentGrade,
      studentAvatar: req.user.profile?.avatar || '',
      tutorId: selectedTutorId,
      tutorName: selectedTutorName,
      courseId: courseId || '',
      subject: subject || 'General Tuition',
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      aspects: {
        clarity: aspects?.clarity ? Number(aspects.clarity) : 5,
        doubtSolving: aspects?.doubtSolving ? Number(aspects.doubtSolving) : 5,
        punctuality: aspects?.punctuality ? Number(aspects.punctuality) : 5
      },
      status: 'approved',
      isFeatured: true
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review on tutor teaching has been submitted and is now published on the landing page.',
      review: newReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/reviews/:id
 * Updates an existing review
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const currentUserId = String(req.user._id || req.user.id);
    const isOwner = String(review.studentId) === currentUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this review.'
      });
    }

    const {
      rating,
      title,
      comment,
      aspects,
      subject,
      tutorName
    } = req.body;

    const updates = {};
    if (rating !== undefined) updates.rating = Number(rating);
    if (title !== undefined) updates.title = title.trim();
    if (comment !== undefined) updates.comment = comment.trim();
    if (subject !== undefined) updates.subject = subject.trim();
    if (tutorName !== undefined) updates.tutorName = tutorName.trim();
    if (aspects) {
      updates.aspects = {
        clarity: aspects.clarity !== undefined ? Number(aspects.clarity) : (review.aspects?.clarity || 5),
        doubtSolving: aspects.doubtSolving !== undefined ? Number(aspects.doubtSolving) : (review.aspects?.doubtSolving || 5),
        punctuality: aspects.punctuality !== undefined ? Number(aspects.punctuality) : (review.aspects?.punctuality || 5)
      };
    }

    const updated = await Review.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      success: true,
      message: 'Review updated successfully.',
      review: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/reviews/:id
 * Deletes a review
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const currentUserId = String(req.user._id || req.user.id);
    const isOwner = String(review.studentId) === currentUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review.'
      });
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Review removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
