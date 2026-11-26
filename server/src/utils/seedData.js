const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Program = require('../models/Program');
const Course = require('../models/Course');
const Enrolment = require('../models/Enrolment');
const Session = require('../models/Session');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const Review = require('../models/Review');

async function seedDatabase() {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('[Seed] Database already contains data, skipping seed.');
      return;
    }

    console.log('[Seed] Seeding initial VM Eduvera Online Academy data...');

    const salt = await bcrypt.genSalt(10);
    const tutorPasswordHash = await bcrypt.hash('admin123', salt);
    const studentPasswordHash = await bcrypt.hash('student123', salt);

    // 1. Create Users
    const tutor = await User.create({
      name: 'Prof. Vikram Mohan',
      email: 'tutor@vmeduvera.com',
      phone: '80567 17286',
      passwordHash: tutorPasswordHash,
      role: 'tutor',
      status: 'active',
      profile: {
        educationLevel: 'Postgraduate / Faculty Lead',
        gradeOrCourse: 'Head Tutor & Academic Director',
        avatar: '',
        bio: 'Over 14 years of teaching excellence in Mathematics, Commerce, and Higher Management education.',
        parentName: '',
        parentPhone: ''
      }
    });

    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'student@vmeduvera.com',
      phone: '98765 43210',
      passwordHash: studentPasswordHash,
      role: 'student',
      status: 'active',
      profile: {
        educationLevel: 'School Level',
        gradeOrCourse: 'Class 10',
        avatar: '',
        bio: 'Aspiring engineer preparing for Class 10 board exams with full focus on Maths and Science.',
        parentName: 'Suresh Sharma',
        parentPhone: '98765 43211'
      }
    });

    const student2 = await User.create({
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      phone: '98451 22334',
      passwordHash: studentPasswordHash,
      role: 'student',
      status: 'active',
      profile: {
        educationLevel: 'Commerce Stream',
        gradeOrCourse: 'Class 12',
        avatar: '',
        bio: 'Aiming for 95%+ in Class 12 Commerce CBSE exams and pursuing BCom/CA.',
        parentName: 'Ravi Iyer',
        parentPhone: '98451 22335'
      }
    });

    // 2. Create Programs
    const progSchool = await Program.create({
      name: 'School Level (Classes 6–10)',
      slug: 'school-level-classes-6-10',
      category: 'School',
      description: 'Comprehensive subject mastery for Classes 6 through 10. Focus on deep concept clarity, interactive problem-solving, and regular weekly milestone tests.',
      targetAudience: 'Classes 6, 7, 8, 9, and 10 students aiming for academic distinction.',
      icon: 'BookOpen',
      active: true
    });

    const progCommerce = await Program.create({
      name: 'Commerce Stream (Classes 11–12)',
      slug: 'commerce-stream-classes-11-12',
      category: 'Commerce',
      description: 'Specialized coaching for Accountancy, Business Studies, Economics, and Business Mathematics. Rigorous CBSE/State board examination preparation.',
      targetAudience: 'Classes 11 and 12 Commerce students targeting top ranks in Board exams.',
      icon: 'TrendingUp',
      active: true
    });

    const progHigher = await Program.create({
      name: 'Higher Education (BBA, BCom, MBA)',
      slug: 'higher-education-bba-bcom-mba',
      category: 'Higher Education',
      description: 'Career-defining undergraduate and postgraduate university curriculum tuition. Strategic Finance, Corporate Accounting, and Business Operations.',
      targetAudience: 'University undergraduate & postgraduate students looking for high semester GPA.',
      icon: 'GraduationCap',
      active: true
    });

    // 3. Create Courses
    const course1 = await Course.create({
      programId: String(progSchool._id || progSchool.id),
      title: 'Class 10: Complete Mathematics & Science Mastery',
      subject: 'Mathematics & Science',
      level: 'Class 10',
      description: 'Thorough coverage of NCERT curriculum, algebraic formulations, quadratic equations, trigonometry, chemical reactions, electricity, and heredity.',
      syllabus: [
        'Real Numbers, Polynomials & Pair of Linear Equations',
        'Quadratic Equations & Arithmetic Progressions',
        'Coordinate Geometry & Trigonometric Identities',
        'Chemical Reactions & Acids, Bases and Salts',
        'Light: Reflection & Refraction, Human Eye',
        'Electricity & Magnetic Effects of Electric Current'
      ],
      tutorIds: [String(tutor._id || tutor.id)],
      tutorName: tutor.name,
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      scheduleTime: '5:00 PM - 6:30 PM',
      duration: 'Academic Year 2026-27',
      active: true
    });

    const course2 = await Course.create({
      programId: String(progCommerce._id || progCommerce.id),
      title: 'Class 12: Accountancy & Economics Board Preparation',
      subject: 'Accountancy & Economics',
      level: 'Class 12',
      description: 'Intensive masterclass on Partnership Accounting, Company Accounts (Issue of Shares & Debentures), Macroeconomics, and Indian Economic Development.',
      syllabus: [
        'Accounting for Partnership: Goodwill, Admission & Retirement',
        'Dissolution of Partnership Firm',
        'Accounting for Share Capital & Forfeiture',
        'National Income Accounting & Money and Banking',
        'Government Budget, Balance of Payments & Foreign Exchange'
      ],
      tutorIds: [String(tutor._id || tutor.id)],
      tutorName: tutor.name,
      scheduleDays: ['Tuesday', 'Thursday', 'Saturday'],
      scheduleTime: '6:30 PM - 8:00 PM',
      duration: 'Academic Year 2026-27',
      active: true
    });

    const course3 = await Course.create({
      programId: String(progHigher._id || progHigher.id),
      title: 'BBA & BCom: Corporate Financial Management',
      subject: 'Financial Management',
      level: 'BBA / BCom',
      description: 'Advanced financial decision-making, Capital Budgeting, Cost of Capital, Working Capital Management, and Ratio Analysis.',
      syllabus: [
        'Time Value of Money & Valuation of Securities',
        'Capital Budgeting Techniques (NPV, IRR, PI)',
        'Leverage & Capital Structure Theories',
        'Dividend Policy & Working Capital Estimation'
      ],
      tutorIds: [String(tutor._id || tutor.id)],
      tutorName: tutor.name,
      scheduleDays: ['Saturday', 'Sunday'],
      scheduleTime: '5:00 PM - 7:00 PM',
      duration: 'Semester Intensive',
      active: true
    });

    // 4. Create Enrolments
    const enrol1 = await Enrolment.create({
      studentId: String(student1._id || student1.id),
      courseId: String(course1._id || course1.id),
      studentName: student1.name,
      studentEmail: student1.email,
      courseTitle: course1.title,
      status: 'approved',
      requestedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      reviewedBy: tutor.name,
      reviewedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      notes: 'Approved for Batch A.'
    });

    const enrol2 = await Enrolment.create({
      studentId: String(student2._id || student2.id),
      courseId: String(course2._id || course2.id),
      studentName: student2.name,
      studentEmail: student2.email,
      courseTitle: course2.title,
      status: 'approved',
      requestedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      reviewedBy: tutor.name,
      reviewedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      notes: 'Commerce stream batch confirmed.'
    });

    const enrol3 = await Enrolment.create({
      studentId: String(student1._id || student1.id),
      courseId: String(course2._id || course2.id),
      studentName: student1.name,
      studentEmail: student1.email,
      courseTitle: course2.title,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes: 'Requested trial access for additional revision.'
    });

    // 5. Create Sessions (Live & Upcoming in 5 PM - 8 PM window)
    const today = new Date();
    today.setHours(17, 30, 0, 0); // 5:30 PM today
    const todayEnd = new Date(today.getTime() + 90 * 60 * 1000); // 7:00 PM today

    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setHours(18, 0, 0, 0); // 6:00 PM tomorrow
    const tomorrowEnd = new Date(tomorrow.getTime() + 90 * 60 * 1000);

    const session1 = await Session.create({
      courseId: String(course1._id || course1.id),
      courseTitle: course1.title,
      tutorId: String(tutor._id || tutor.id),
      tutorName: tutor.name,
      title: 'Class 10 Live: Quadratic Equations & Formula Derivations',
      agenda: 'Standard forms, discriminant analysis, nature of roots, and previous board exam problem set.',
      startsAt: today.toISOString(),
      endsAt: todayEnd.toISOString(),
      timeZone: 'Asia/Kolkata',
      provider: 'Google Meet',
      meetingUrl: 'https://meet.google.com/abc-edu-vera',
      status: 'upcoming'
    });

    const session2 = await Session.create({
      courseId: String(course2._id || course2.id),
      courseTitle: course2.title,
      tutorId: String(tutor._id || tutor.id),
      tutorName: tutor.name,
      title: 'Class 12 Live: Partnership Admission & Revaluation Accounts',
      agenda: 'Detailed ledger entries for revaluation of assets and reassessment of liabilities upon partner admission.',
      startsAt: tomorrow.toISOString(),
      endsAt: tomorrowEnd.toISOString(),
      timeZone: 'Asia/Kolkata',
      provider: 'Google Meet',
      meetingUrl: 'https://meet.google.com/vme-comm-live',
      status: 'upcoming'
    });

    // 6. Create Materials
    await Material.create({
      courseId: String(course1._id || course1.id),
      courseTitle: course1.title,
      title: 'Complete Trigonometry Formula Cheat Sheet & Identities',
      description: 'Quick reference sheet containing all fundamental trigonometric ratios, complementary angles, and Pythagorean identities.',
      fileKey: 'trig-formula-sheet.pdf',
      fileName: 'VM_Eduvera_Class10_Trigonometry_Formula_Sheet.pdf',
      fileType: 'pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: '1.8 MB',
      uploadedBy: String(tutor._id || tutor.id),
      uploaderName: tutor.name,
      visibility: 'enrolled'
    });

    await Material.create({
      courseId: String(course1._id || course1.id),
      courseTitle: course1.title,
      title: 'Science Chapter 10: Light Reflection & Ray Diagrams Guide',
      description: 'Concise illustrated notes with ray tracing steps for concave and convex mirrors and lenses.',
      fileKey: 'ray-diagrams.pdf',
      fileName: 'VM_Eduvera_Class10_Ray_Diagrams.pdf',
      fileType: 'pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: '3.2 MB',
      uploadedBy: String(tutor._id || tutor.id),
      uploaderName: tutor.name,
      visibility: 'enrolled'
    });

    await Material.create({
      courseId: String(course2._id || course2.id),
      courseTitle: course2.title,
      title: 'Accountancy Class 12: Partnership Journal Entries & Balance Sheets',
      description: 'Format guide for journal entries on partner admission and retirement.',
      fileKey: 'partnership-accounts.pdf',
      fileName: 'VM_Eduvera_Class12_Partnership_Format.pdf',
      fileType: 'pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: '2.5 MB',
      uploadedBy: String(tutor._id || tutor.id),
      uploaderName: tutor.name,
      visibility: 'enrolled'
    });

    // 7. Create Assignments
    const assignment1 = await Assignment.create({
      courseId: String(course1._id || course1.id),
      courseTitle: course1.title,
      title: 'Weekly Test 04: Real Numbers & Quadratic Equations',
      instructions: 'Solve all 10 subjective problems. Show step-by-step factorization and use quadratic formula where specified. Upload your clear handwritten sheet or enter your answers.',
      dueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
      maxMarks: 50,
      allowedTypes: ['text', 'pdf', 'file'],
      status: 'published',
      createdBy: String(tutor._id || tutor.id)
    });

    const assignment2 = await Assignment.create({
      courseId: String(course1._id || course1.id),
      courseTitle: course1.title,
      title: 'Milestone Assessment 01: Polynomials & Linear Equations',
      instructions: 'Completed evaluation of Chapter 2 & Chapter 3 concepts.',
      dueAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      maxMarks: 40,
      allowedTypes: ['text', 'pdf', 'file'],
      status: 'published',
      createdBy: String(tutor._id || tutor.id)
    });

    // 8. Create Submissions
    await Submission.create({
      assignmentId: String(assignment2._id || assignment2.id),
      courseId: String(course1._id || course1.id),
      studentId: String(student1._id || student1.id),
      studentName: student1.name,
      assignmentTitle: assignment2.title,
      text: 'Submitted solutions for all 8 questions. Verified graphical consistency for Question 4.',
      fileName: 'Rahul_Sharma_Polynomials_Solutions.pdf',
      fileKey: 'sub-rahul-01',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      marks: 38,
      feedback: 'Excellent work, Rahul! Minor calculation slip in Question 6 sign, otherwise perfect step derivation.',
      gradedBy: tutor.name,
      gradedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'graded'
    });

    // 9. Create Attendance records
    await Attendance.create({
      sessionId: String(session1._id || session1.id),
      studentId: String(student1._id || student1.id),
      courseId: String(course1._id || course1.id),
      studentName: student1.name,
      status: 'present',
      markedBy: tutor.name,
      markedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      remarks: 'Active participation in algebra problems'
    });

    // 10. Create Announcements
    await Announcement.create({
      title: 'Welcome to Academic Year 2026-27 at VM Eduvera Online Academy',
      body: 'Live interactive evening batches start daily between 5:00 PM and 8:00 PM. Please ensure your microphone and notebooks are ready 5 minutes prior to class time.',
      courseId: null,
      courseTitle: 'All Academy',
      audience: 'all',
      priority: 'high',
      createdBy: String(tutor._id || tutor.id),
      authorName: tutor.name
    });

    await Announcement.create({
      title: 'Class 10 CBSE Board Pattern Discussion Scheduled',
      body: 'A special strategy session detailing the latest CBSE question paper blueprint and scoring guidelines will be conducted this coming Friday at 5:00 PM.',
      courseId: String(course1._id || course1.id),
      courseTitle: course1.title,
      audience: 'course',
      priority: 'normal',
      createdBy: String(tutor._id || tutor.id),
      authorName: tutor.name
    });

    // 11. Create Student Reviews on Tutor Teaching
    await Review.create({
      studentId: String(student1._id || student1.id),
      studentName: student1.name,
      studentGrade: 'Class 10 - School Foundation',
      studentAvatar: '',
      tutorId: String(tutor._id || tutor.id),
      tutorName: tutor.name,
      courseId: String(course1._id || course1.id),
      subject: 'Mathematics & Science',
      rating: 5,
      title: 'Unmatched concept clarity & patience with doubts!',
      comment: 'Prof. Vikram Mohan breaks down tough trigonometry and quadratic problems so effortlessly. The live evening batch at 5:00 PM fits my school schedule cleanly. My score in maths jumped from 72% to 94% in term exams!',
      aspects: { clarity: 5, doubtSolving: 5, punctuality: 5 },
      status: 'approved',
      isFeatured: true
    });

    await Review.create({
      studentId: String(student2._id || student2.id),
      studentName: student2.name,
      studentGrade: 'Class 12 - Commerce Stream',
      studentAvatar: '',
      tutorId: String(tutor._id || tutor.id),
      tutorName: tutor.name,
      courseId: String(course2._id || course2.id),
      subject: 'Accountancy & Economics',
      rating: 5,
      title: 'Best commerce tutor! Board exam preparation is top notch.',
      comment: 'Partnership accounts, share capital forfeiture, and macroeconomics were very confusing in school. In VM Eduvera, sir explains each journal entry with real corporate examples. The regular test papers helped me gain huge confidence for CBSE boards.',
      aspects: { clarity: 5, doubtSolving: 5, punctuality: 5 },
      status: 'approved',
      isFeatured: true
    });

    console.log('[Seed] Database successfully seeded with full VM Eduvera curriculum and sample accounts!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message);
  }
}

module.exports = { seedDatabase };
