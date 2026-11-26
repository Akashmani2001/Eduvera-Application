const Contact = require('../models/Contact');

// @desc    Submit public contact / enquiry form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, educationLevel, message, honeypot } = req.body;

    // Spam protection: honeypot field must be empty
    if (honeypot) {
      return res.status(200).json({
        success: true,
        message: 'Thank you for your enquiry. Our academic counselor will reach out shortly.'
      });
    }

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone number, and message are required.'
      });
    }

    // Phone number format validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.'
      });
    }

    const enquiry = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      educationLevel: educationLevel || 'Not Specified',
      message: message.trim(),
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry! Our academic counselor will reach out shortly at ' + phone + '.',
      enquiryId: enquiry._id || enquiry.id
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get enquiries for admin
// @route   GET /api/contact
// @access  Private (Tutor/Admin)
const getContacts = async (req, res, next) => {
  try {
    const enquiries = await Contact.find();
    res.json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContact,
  getContacts
};
