const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'vm_eduvera_super_secret_jwt_key_2026_academic_portal';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User account not found.'
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.'
      });
    }

    // Attach user to req (strip passwordHash)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // admin role has full access to tutor endpoints
    const allowed = [...roles];
    if (allowed.includes('tutor') && !allowed.includes('admin')) {
      allowed.push('admin');
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. You do not have permission (${req.user.role}) to access this resource.`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
  JWT_SECRET
};
