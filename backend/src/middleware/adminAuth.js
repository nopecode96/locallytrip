const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');

// Middleware to authenticate admin users
const authenticateAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Admin access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get admin user information
    const adminUser = await AdminUser.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!adminUser || !adminUser.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive admin user'
      });
    }

    // Add admin user to request
    req.user = { 
      id: adminUser.id,
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      isAdmin: true,
      permissions: adminUser.permissions || []
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Admin token expired'
      });
    }
    
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Admin authentication failed'
    });
  }
};

// Middleware to check admin role permissions
const requireAdminRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

// Middleware to check specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `Permission denied. Required: ${permission}`
      });
    }

    next();
  };
};

// Fallback for environments without AdminUser model
const fallbackAuthenticateAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Admin access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // For now, use regular User model and check for admin roles
    const { User } = require('../models');
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive user'
      });
    }

    // Check if user has admin role
    const adminRoles = ['super_admin', 'admin', 'moderator'];
    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Add user to request as admin
    req.user = { 
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      isAdmin: true,
      permissions: []
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Admin token expired'
      });
    }
    
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Admin authentication failed'
    });
  }
};

module.exports = {
  authenticateAdminToken: fallbackAuthenticateAdminToken, // Use fallback for now
  requireAdminRole,
  requirePermission
};
