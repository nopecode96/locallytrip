const jwt = require('jsonwebtoken');
const { User, Role } = require('../../models');

// Middleware to authenticate admin users
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Get user with role information
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: Role,
        as: 'userRole',
        attributes: ['id', 'name', 'permissions']
      }]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive user'
      });
    }

    // Check if user has admin role
    const adminRoles = ['super_admin', 'admin', 'finance', 'marketing', 'moderator'];
    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    // Add user info to request
    req.userId = user.id;
    req.user = user;
    req.userRole = user.role;
    req.permissions = user.userRole?.permissions || {};

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Middleware to check specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.permissions || !req.permissions[permission]) {
      return res.status(403).json({
        success: false,
        error: `Permission required: ${permission}`
      });
    }
    next();
  };
};

// Middleware to check specific roles
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        error: `Role required: ${allowedRoles.join(' or ')}`
      });
    }
    next();
  };
};

// Middleware to check super admin role
const requireSuperAdmin = requireRole(['super_admin']);

module.exports = {
  authenticateAdmin,
  requirePermission,
  requireRole,
  requireSuperAdmin
};
