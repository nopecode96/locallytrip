const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, City, HostCategory } = require('../../models');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign(
    { userId, isAdmin: true }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const adminAuthController = {
  // Admin login - specific for web-admin with role validation
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user with role information
      const user = await User.findOne({ 
        where: { email, is_active: true },
        include: [
          {
            model: Role,
            as: 'userRole',
            attributes: ['id', 'name', 'permissions']
          }
        ],
        attributes: [
          'id', 'uuid', 'name', 'email', 'password', 'role', 'role_id', 
          'phone', 'avatar_url', 'is_verified', 'is_active', 'city_id',
          'last_login_at', 'created_at', 'updated_at'
        ]
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Check if user has admin role
      const adminRoles = ['super_admin', 'admin', 'finance', 'marketing', 'moderator'];
      if (!adminRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'Insufficient permissions for admin access'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate admin token
      const token = generateToken(user.id);

      // Prepare user response
      const userResponse = {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        role_id: user.role_id,
        phone: user.phone,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
        is_active: user.is_active,
        city_id: user.city_id
      };

      // Add permissions from role
      if (user.userRole && user.userRole.permissions) {
        userResponse.permissions = user.userRole.permissions;
      }

      // Update last login
      await user.update({ last_login_at: new Date() });

      res.json({
        success: true,
        message: 'Admin login successful',
        data: {
          user: userResponse,
          token
        }
      });

    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: 'An error occurred during admin login'
      });
    }
  },

  // Get current admin profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: [
          {
            model: Role,
            as: 'userRole',
            attributes: ['id', 'name', 'permissions']
          },
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'slug']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const userResponse = {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        role_id: user.role_id,
        phone: user.phone,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
        is_active: user.is_active,
        City: user.City
      };

      // Add permissions
      if (user.userRole && user.userRole.permissions) {
        userResponse.permissions = user.userRole.permissions;
      }

      res.json({
        success: true,
        data: { user: userResponse }
      });

    } catch (error) {
      console.error('Get admin profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  },

  // Logout admin (could be used to invalidate tokens in the future)
  logout: async (req, res) => {
    try {
      // For now, just return success
      // In the future, we could maintain a token blacklist
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }
};

module.exports = adminAuthController;
