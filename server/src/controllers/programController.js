const Program = require('../models/Program');
const Course = require('../models/Course');

// @desc    Get all programs with active course counts
// @route   GET /api/programs
// @access  Public
const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find({ active: true });
    const allCourses = await Course.find({ active: true });

    const programsWithCounts = programs.map(prog => {
      const related = allCourses.filter(c => String(c.programId) === String(prog._id) || String(c.programId) === String(prog.id));
      return {
        ...prog,
        courseCount: related.length,
        subjectsCount: Array.from(new Set(related.map(r => r.subject))).length
      };
    });

    res.json({
      success: true,
      programs: programsWithCounts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single program by slug with courses
// @route   GET /api/programs/:slug
// @access  Public
const getProgramBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const program = await Program.findOne({ slug });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: `Program with identifier "${slug}" not found.`
      });
    }

    const courses = await Course.find({
      $or: [{ programId: program._id }, { programId: program.id }],
      active: true
    });

    res.json({
      success: true,
      program,
      courses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new program
// @route   POST /api/programs
// @access  Private (Tutor/Admin)
const createProgram = async (req, res, next) => {
  try {
    const { name, category, description, targetAudience, icon } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Program name and category are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const program = await Program.create({
      name,
      slug,
      category,
      description: description || '',
      targetAudience: targetAudience || '',
      icon: icon || 'GraduationCap',
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Program created successfully.',
      program
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPrograms,
  getProgramBySlug,
  createProgram
};
