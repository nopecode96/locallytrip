const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to authenticate public users (travelers, hosts)
const authenticateToken = async (req, res, next) => {
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
    
    // Get user information
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive user'
      });
    }

    // Add user to request
    req.user = { 
      userId: user.id, 
      email: user.email,
      role: user.role,
      isAdmin: false 
    };
    
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
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Optional authentication (for routes that work both with and without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (user && user.is_active) {
      req.user = { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        isAdmin: false 
      };
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // If there's an error with the token, just set user to null
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAuth: authenticateToken, // alias for consistency
  optionalAuth,
  requireAdmin: authenticateToken // for now, just use same auth - can be enhanced later
};
