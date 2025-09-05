const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = requireRole;
