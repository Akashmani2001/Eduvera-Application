const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const Enrolment = require('../models/Enrolment');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Record or update attendance for students in a session
// @route   POST /api/sessions/:id/attendance
// @access  Private (Tutor/Admin)
const recordAttendance = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { records } = req.body; // Array of { studentId, studentName, status, remarks }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Records array is required.' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const savedRecords = [];

    for (const record of records) {
      const studentId = String(record.studentId);
      const status = ['present', 'absent', 'late'].includes(record.status) ? record.status : 'present';

      // Check duplicate
      const existing = await Attendance.findOne({ sessionId: String(sessionId), studentId });

      if (existing) {
        const updated = await Attendance.findByIdAndUpdate(
          existing._id || existing.id,
          {
            status,
            remarks: record.remarks || existing.remarks,
            markedBy: req.user.name,
            markedAt: new Date().toISOString()
          },
          { new: true }
        );
        savedRecords.push(updated);
      } else {
        const created = await Attendance.create({
          sessionId: String(sessionId),
          courseId: String(session.courseId),
          studentId,
          studentName: record.studentName || 'Student',
          status,
          markedBy: req.user.name,
          markedAt: new Date().toISOString(),
          remarks: record.remarks || ''
        });
        savedRecords.push(created);
      }
    }

    res.json({
      success: true,
      message: `Attendance marked successfully for ${savedRecords.length} student(s).`,
      attendance: savedRecords
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get attendance for a session
// @route   GET /api/sessions/:id/attendance
// @access  Private (Tutor, or Student's own record)
const getSessionAttendance = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const isTutorOrAdmin = req.user.role === 'tutor' || req.user.role === 'admin';

    let filter = { sessionId: String(sessionId) };
    if (!isTutorOrAdmin) {
      filter.studentId = String(req.user._id || req.user.id);
    }

    const records = await Attendance.find(filter);

    res.json({
      success: true,
      attendance: records
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get student overall progress (attendance % and marks summary)
// @route   GET /api/students/me/progress
// @access  Private (Student own / authorized tutor)
const getStudentProgress = async (req, res, next) => {
  try {
    const studentId = req.query.studentId && (req.user.role === 'tutor' || req.user.role === 'admin')
      ? String(req.query.studentId)
      : String(req.user._id || req.user.id);

    // Fetch enrolments
    const enrolments = await Enrolment.find({ studentId, status: 'approved' });

    // Fetch attendance
    const attendanceRecords = await Attendance.find({ studentId });
    const totalSessionsMarked = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const lateCount = attendanceRecords.filter(a => a.status === 'late').length;
    const absentCount = attendanceRecords.filter(a => a.status === 'absent').length;

    const attendanceRate = totalSessionsMarked > 0
      ? Math.round(((presentCount + lateCount * 0.5) / totalSessionsMarked) * 100)
      : 100;

    // Fetch graded submissions
    const submissions = await Submission.find({ studentId });
    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.marks !== null);

    const totalMarksObtained = gradedSubmissions.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0);
    const averageScore = gradedSubmissions.length > 0
      ? Math.round(totalMarksObtained / gradedSubmissions.length)
      : 0;

    res.json({
      success: true,
      progress: {
        enrolledCoursesCount: enrolments.length,
        attendance: {
          rate: attendanceRate,
          total: totalSessionsMarked,
          present: presentCount,
          late: lateCount,
          absent: absentCount,
          records: attendanceRecords
        },
        assessments: {
          completedCount: gradedSubmissions.length,
          averageScore,
          submissions
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  recordAttendance,
  getSessionAttendance,
  getStudentProgress
};
