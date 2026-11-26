const Session = require('../models/Session');
const Course = require('../models/Course');
const Enrolment = require('../models/Enrolment');

// @desc    Get live & scheduled sessions
// @route   GET /api/sessions
// @access  Private (Enrolled students and Tutors)
const getSessions = async (req, res, next) => {
  try {
    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';
    const allSessions = await Session.find();

    let permittedSessions = [];

    if (isTutorOrAdmin) {
      permittedSessions = allSessions;
    } else {
      // Find all approved course enrollments for this student
      const studentId = String(req.user._id || req.user.id);
      const studentEnrolments = await Enrolment.find({
        studentId,
        status: 'approved'
      });
      const approvedCourseIds = studentEnrolments.map(e => String(e.courseId));

      permittedSessions = allSessions.filter(s => approvedCourseIds.includes(String(s.courseId)));
    }

    // Sort by startsAt ascending
    permittedSessions.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    // Strip actual private meetingUrl unless specifically permitted or requesting join
    const sanitizedSessions = permittedSessions.map(s => {
      const now = new Date();
      const start = new Date(s.startsAt);
      const end = new Date(s.endsAt);
      
      // Calculate dynamic status if not cancelled
      let computedStatus = s.status;
      if (s.status !== 'cancelled') {
        if (now >= start && now <= end) {
          computedStatus = 'live';
        } else if (now > end) {
          computedStatus = 'completed';
        } else {
          computedStatus = 'upcoming';
        }
      }

      // Check if student is within allowed join window (30 mins before start until end)
      const windowStart = new Date(start.getTime() - 30 * 60 * 1000);
      const canJoinNow = (now >= windowStart && now <= end) || computedStatus === 'live';

      return {
        ...s,
        status: computedStatus,
        canJoinNow: isTutorOrAdmin || canJoinNow,
        // Only show meetingUrl directly to tutors; students get it via /join verification
        meetingUrl: isTutorOrAdmin ? s.meetingUrl : (canJoinNow ? s.meetingUrl : null)
      };
    });

    res.json({
      success: true,
      count: sanitizedSessions.length,
      sessions: sanitizedSessions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Schedule new live class session
// @route   POST /api/sessions
// @access  Private (Tutor/Admin)
const createSession = async (req, res, next) => {
  try {
    const { courseId, title, agenda, startsAt, endsAt, timeZone, provider, meetingUrl } = req.body;

    if (!courseId || !title || !startsAt || !endsAt || !meetingUrl) {
      return res.status(400).json({
        success: false,
        message: 'Course, title, start time, end time, and meeting URL are required.'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Specified course not found.' });
    }

    const session = await Session.create({
      courseId: String(courseId),
      courseTitle: course.title,
      tutorId: String(req.user._id || req.user.id),
      tutorName: req.user.name,
      title: title.trim(),
      agenda: agenda || '',
      startsAt,
      endsAt,
      timeZone: timeZone || 'Asia/Kolkata',
      provider: provider || 'Google Meet',
      meetingUrl: meetingUrl.trim(),
      status: 'upcoming'
    });

    res.status(201).json({
      success: true,
      message: 'Live class session scheduled successfully.',
      session
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update / Cancel session
// @route   PATCH /api/sessions/:id
// @access  Private (Tutor/Admin)
const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      success: true,
      message: 'Session updated successfully.',
      session: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify and return live meeting join URL
// @route   POST /api/sessions/:id/join
// @access  Private (Eligible student or tutor)
const joinSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (session.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This session has been cancelled.' });
    }

    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';

    if (!isTutorOrAdmin) {
      const studentId = String(req.user._id || req.user.id);
      const enrolment = await Enrolment.findOne({
        studentId,
        courseId: String(session.courseId),
        status: 'approved'
      });

      if (!enrolment) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not enrolled in the course for this live session.'
        });
      }

      // Check session join time window (e.g. 30 mins before start)
      const now = new Date();
      const start = new Date(session.startsAt);
      const end = new Date(session.endsAt);
      const windowStart = new Date(start.getTime() - 30 * 60 * 1000);

      if (now < windowStart) {
        return res.status(400).json({
          success: false,
          message: `This session is not yet open to join. The join link will activate 30 minutes before start time (${new Date(session.startsAt).toLocaleTimeString()}).`
        });
      }

      if (now > end) {
        return res.status(400).json({
          success: false,
          message: 'This live session has already ended.'
        });
      }
    }

    res.json({
      success: true,
      message: 'Access granted. Opening live session...',
      meetingUrl: session.meetingUrl,
      provider: session.provider,
      title: session.title,
      courseTitle: session.courseTitle
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSessions,
  createSession,
  updateSession,
  joinSession
};
