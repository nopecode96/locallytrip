const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { User, Role, City, Country, HostCategory, UserHostCategory, Language } = require('../models');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const AuditService = require('../services/auditService');

const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const authController = {
  // Public user registration
  register: async (req, res) => {
    try {
      const { 
        name, 
        firstName, 
        lastName, 
        email, 
        password, 
        userType, 
        role,
        bio, 
        phone, 
        city_id, 
        hostCategories 
      } = req.body;

      // Validation
      const errors = [];
      if (!email || !/\S+@\S+\.\S+/.test(email)) errors.push('Valid email is required');
      if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
      if (!name && !firstName && !lastName) errors.push('Name is required');
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
          message: 'Email is already registered'
        });
      }

      // Determine final values with priority: userType > role, firstName+lastName > name
      const finalRole = userType || role || 'traveller';
      const finalName = name || (firstName && lastName ? `${firstName} ${lastName}`.trim() : firstName || lastName || '');
      const finalCityId = city_id;

      // Validate host registration requirements
      if (finalRole === 'host') {
        if (!hostCategories || !Array.isArray(hostCategories) || hostCategories.length === 0) {
          return res.status(400).json({
            success: false,
            error: 'Host categories required',
            message: 'Hosts must select at least one category'
          });
        }

        // Verify all host categories exist
        const validCategories = await HostCategory.findAll({
          where: { 
            id: hostCategories,
            isActive: true 
          }
        });

        if (validCategories.length !== hostCategories.length) {
          return res.status(400).json({
            success: false,
            error: 'Invalid host categories',
            message: 'One or more selected categories are invalid'
          });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create new user
      const user = await User.create({
        name: finalName,
        email,
        password: hashedPassword,
        phone,
        bio,
        cityId: finalCityId,
        role: finalRole,
        verificationToken,
        isActive: true,
        isVerified: false
      });

      // If host, create host category associations
      if (finalRole === 'host' && hostCategories && hostCategories.length > 0) {
        const hostCategoryData = hostCategories.map((categoryId, index) => ({
          userId: user.id,
          hostCategoryId: parseInt(categoryId, 10),
          isPrimary: index === 0, // First selected category is primary
          isActive: true
        }));

        await UserHostCategory.bulkCreate(hostCategoryData);
      }

      // Send verification email
      try {
        const emailResult = await emailService.sendVerificationEmail(
          email,
          finalName || 'User',
          verificationToken,
          finalRole // Pass user type for personalized email
        );

      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Fetch user with relations for response
      const userWithRelations = await User.findByPk(user.id, {
        include: [
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name'],
            include: [{
              model: Country,
              as: 'country',
              attributes: ['id', 'name']
            }]
          },
          ...(finalRole === 'host' ? [{
            model: HostCategory,
            as: 'hostCategories',
            attributes: ['id', 'name', 'description', 'icon'],
            through: {
              attributes: ['isPrimary', 'isActive']
            }
          }] : [])
        ],
        attributes: { exclude: ['password', 'verificationToken'] }
      });

      // Return user without sensitive data
      const userResponse = {
        id: userWithRelations.id,
        uuid: userWithRelations.uuid,
        name: userWithRelations.name,
        email: userWithRelations.email,
        role: userWithRelations.role,
        phone: userWithRelations.phone,
        cityId: userWithRelations.cityId,
        isVerified: userWithRelations.isVerified,
        isActive: userWithRelations.isActive,
        city: userWithRelations.City,
        ...(finalRole === 'host' && userWithRelations.hostCategories ? {
          hostCategories: userWithRelations.hostCategories
        } : {})
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        data: {
          user: userResponse,
          token,
          emailSent: true // Indicate verification email was attempted
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        message: error.message || 'An error occurred during registration'
      });
    }
  },

  // Email verification endpoint
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required'
        });
      }

      // Find user with verification token
      const user = await User.findOne({
        where: { 
          verificationToken: token,
          isActive: true 
        },
        include: [
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name']
          },
          {
            model: HostCategory,
            as: 'hostCategories',
            attributes: ['id', 'name', 'description', 'icon'],
            through: {
              attributes: ['isPrimary', 'isActive']
            }
          }
        ]
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token'
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email already verified'
        });
      }

      // Update user as verified
      await user.update({
        isVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: null // Clear the token
      });

      // Send welcome email after successful verification
      try {
        const welcomeEmailResult = await emailService.sendWelcomeEmail(
          user.email,
          user.name || 'User',
          user.role
        );

      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail verification if welcome email fails
      }

      // Return updated user data
      const userResponse = {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        cityId: user.cityId,
        isVerified: true,
        isActive: user.isActive,
        emailVerifiedAt: user.emailVerifiedAt,
        city: user.City,
        ...(user.role === 'host' && user.hostCategories ? {
          hostCategories: user.hostCategories
        } : {})
      };

      res.json({
        success: true,
        message: 'Email verified successfully! Welcome to LocallyTrip!',
        data: {
          user: userResponse,
          welcomeEmailSent: true
        }
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Email verification failed',
        message: error.message || 'An error occurred during email verification'
      });
    }
  },

  // Resend verification email
  resendVerificationEmail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      const user = await User.findOne({ 
        where: { 
          email,
          isActive: true 
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email already verified'
        });
      }

      // Generate new verification token if needed
      let verificationToken = user.verificationToken;
      if (!verificationToken) {
        verificationToken = crypto.randomBytes(32).toString('hex');
        await user.update({ verificationToken });
      }

      // Send verification email
      try {
        const emailResult = await emailService.sendVerificationEmail(
          user.email,
          user.name || 'User',
          verificationToken,
          user.role // Pass user role for personalized email
        );

        if (emailResult.success) {
          res.json({
            success: true,
            message: 'Verification email sent successfully'
          });
        } else {
          res.status(500).json({
            success: false,
            error: 'Failed to send verification email',
            message: emailResult.error
          });
        }
      } catch (emailError) {
        console.error('Failed to resend verification email:', emailError);
        res.status(500).json({
          success: false,
          error: 'Failed to send verification email'
        });
      }
    } catch (error) {
      console.error('Resend verification email error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email'
      });
    }
  },

  // Public user login
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
      

      // Find user
      const user = await User.findOne({ 
        where: { email, isActive: true },
        attributes: ['id', 'uuid', 'name', 'email', 'role', 'phone', 'cityId', 'avatarUrl', 'isVerified', 'isActive', 'password'],
        include: [
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'countryId'],
            include: [
              {
                model: Country,
                as: 'country',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        // Log failed login attempt
        await AuditService.logAction({
          userId: user.id,
          action: 'login_failed',
          actionCategory: 'auth',
          resourceType: 'user',
          resourceId: user.id,
          metadata: {
            email: email,
            reason: 'invalid_password'
          },
          request: req,
          status: 'failed',
          errorMessage: 'Invalid password',
          severity: 'medium',
          source: req.headers['x-app-version'] ? 'mobile' : 'web'
        });

        // Create security event for failed login
        await AuditService.createSecurityEvent({
          userId: user.id,
          eventType: 'failed_login',
          severity: 'medium',
          description: `Failed login attempt for user ${email}`,
          details: {
            email: email,
            reason: 'invalid_password',
            userAgent: req.get('User-Agent')
          },
          ipAddress: AuditService.getClientIP(req),
          userAgent: req.get('User-Agent'),
          source: req.headers['x-app-version'] ? 'mobile' : 'web'
        });

        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate token
      const isAdmin = user.role === 'admin' || user.role === 'super_admin';
      const token = generateToken(user.id, isAdmin);

      // Create user session
      try {
        await AuditService.createSession({
          userId: user.id,
          sessionToken: token,
          deviceId: req.headers['x-device-id'] || null,
          request: req,
          fcmToken: req.body.fcmToken || null,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
      } catch (sessionError) {
        console.error('Session creation failed:', sessionError);
        // Continue with login even if session creation fails
      }

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      // Log successful login
      await AuditService.logAction({
        userId: user.id,
        action: 'login',
        actionCategory: 'auth',
        resourceType: 'user',
        resourceId: user.id,
        newValues: {
          email: user.email,
          role: user.role,
          loginAt: new Date(),
          deviceId: req.headers['x-device-id'] || null
        },
        metadata: {
          loginMethod: 'email_password',
          deviceInfo: req.headers['x-device-info'] || null
        },
        request: req,
        status: 'success',
        severity: 'low',
        source: req.headers['x-app-version'] ? 'mobile' : 'web'
      });

      // Return user without password (using get() to access raw data with proper aliases)
      const userData = user.get({ plain: true });
      const userResponse = {
        id: userData.id,
        uuid: userData.uuid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        cityId: userData.cityId,
        avatarUrl: userData.avatarUrl,
        isVerified: userData.isVerified,
        isActive: userData.isActive,
        City: userData.City
      };

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Log system error
      await AuditService.logAction({
        userId: null,
        action: 'login_error',
        actionCategory: 'auth',
        resourceType: 'system',
        metadata: {
          error: error.message,
          stack: error.stack
        },
        request: req,
        status: 'failed',
        errorMessage: error.message,
        severity: 'high',
        source: req.headers['x-app-version'] ? 'mobile' : 'web'
      });

      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      console.log('getProfile called with user:', req.user);
      
      const user = await User.findByPk(req.user.userId, {
        include: [
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'country_id']
          },
          {
            model: HostCategory,
            as: 'hostCategories',
            attributes: ['id', 'name', 'description', 'icon'],
            through: {
              attributes: ['isPrimary', 'isActive']
            }
          },
          {
            model: Language,
            as: 'languages',
            attributes: ['id', 'name', 'code', 'nativeName'],
            through: {
              attributes: ['id', 'proficiency', 'isActive'],
              where: { isActive: true } // Only include active languages
            }
          }
        ],
        attributes: { exclude: ['password'] }
      });

      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found for ID:', req.user.userId);
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      console.log('Returning user profile with avatarUrl:', user.avatarUrl);
      console.log('User hostCategories:', user.hostCategories);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  },

  // Logout (token invalidation with audit logging)
  logout: async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const userId = req.user?.userId;

      // End user session if token provided
      if (token) {
        try {
          await AuditService.endSession(token, 'user_logout');
        } catch (sessionError) {
          console.error('Session ending failed:', sessionError);
          // Continue with logout even if session ending fails
        }
      }

      // Log logout action
      if (userId) {
        await AuditService.logAction({
          userId: userId,
          action: 'logout',
          actionCategory: 'auth',
          resourceType: 'user',
          resourceId: userId,
          metadata: {
            logoutMethod: 'manual',
            sessionEnded: !!token
          },
          request: req,
          status: 'success',
          severity: 'low',
          source: req.headers['x-app-version'] ? 'mobile' : 'web'
        });
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Log logout error
      await AuditService.logAction({
        userId: req.user?.userId || null,
        action: 'logout_error',
        actionCategory: 'auth',
        resourceType: 'system',
        metadata: {
          error: error.message
        },
        request: req,
        status: 'failed',
        errorMessage: error.message,
        severity: 'medium',
        source: req.headers['x-app-version'] ? 'mobile' : 'web'
      });

      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { firstName, lastName, name, phone, bio, cityId, location, email, hostCategories } = req.body;
      const userId = req.user.userId;

      console.log('updateProfile received data:', req.body);

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Determine final name value
      let finalName = name;
      if (!finalName && (firstName || lastName)) {
        finalName = `${firstName || ''} ${lastName || ''}`.trim();
      }

      // Update basic user info
      await user.update({
        name: finalName || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        bio: bio !== undefined ? bio : user.bio,
        cityId: cityId || user.cityId
      });

      // Handle host categories if user is a host and categories are provided
      if (user.role === 'host' && hostCategories && Array.isArray(hostCategories)) {
        console.log('Updating host categories:', hostCategories);
        
        // Remove existing host categories
        await UserHostCategory.destroy({
          where: { userId: userId }
        });

        // Add new host categories if any provided
        if (hostCategories.length > 0) {
          const hostCategoryData = hostCategories.map((categoryId, index) => ({
            userId: userId,
            hostCategoryId: parseInt(categoryId, 10),
            isPrimary: index === 0, // First selected category is primary
            isActive: true
          }));

          await UserHostCategory.bulkCreate(hostCategoryData);
        }
      }

      // Fetch updated user with relations
      const updatedUser = await User.findByPk(userId, {
        include: [
          {
            model: City,
            as: 'City',
            attributes: ['id', 'name', 'country_id']
          },
          {
            model: HostCategory,
            as: 'hostCategories',
            attributes: ['id', 'name', 'description', 'icon'],
            through: {
              attributes: ['isPrimary', 'isActive']
            }
          }
        ],
        attributes: { exclude: ['password'] }
      });

      console.log('Profile updated successfully for user:', userId);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        message: error.message
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 6 characters long'
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await user.update({ password: hashedNewPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  },

  // Configure multer for avatar uploads
  uploadMiddleware: (() => {
    // Configure storage for avatar uploads
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/images/users/avatars');
        
        // Create directory if it doesn't exist
        try {
          await fs.access(uploadPath);
        } catch (error) {
          await fs.mkdir(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        // Generate unique filename: avatar_userId_timestamp.ext
        const userId = req.user.userId;
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const filename = `avatar_${userId}_${timestamp}${extension}`;
        cb(null, filename);
      }
    });

    // File filter for images only
    const fileFilter = (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
      }
    };

    const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      }
    });

    return upload.single('avatar');
  })(),

  // Upload avatar
  uploadAvatar: async (req, res) => {
    try {
      console.log('uploadAvatar called with user:', req.user);
      console.log('uploadAvatar received file:', req.file ? 'YES' : 'NO');
      if (req.file) {
        console.log('File details:', {
          originalname: req.file.originalname,
          filename: req.file.filename,
          size: req.file.size,
          path: req.file.path
        });
      }
      
      const userId = req.user.userId;
      
      if (!req.file) {
        console.log('No file uploaded for user:', userId);
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Find the user
      const user = await User.findByPk(userId);
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user's avatar_url with just the filename
      const avatarFilename = req.file.filename;
      console.log('Updating user avatar to:', avatarFilename);
      await user.update({ avatarUrl: avatarFilename });

      // Return updated user data
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      console.log('Avatar upload successful for user:', userId, 'filename:', avatarFilename);

      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatarUrl: avatarFilename,
          url: `/images/users/avatars/${avatarFilename}`,
          user: updatedUser
        }
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload avatar'
      });
    }
  },

  // Forgot Password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Valid email is required'
        });
      }

      // Find user by email
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'name', 'email', 'isVerified', 'isActive']
      });

      // Always return success to prevent email enumeration
      const successResponse = {
        success: true,
        message: 'If an account with that email exists, you will receive a password reset link shortly.'
      };

      if (!user) {
        return res.json(successResponse);
      }

      // Check if user is verified and active
      if (!user.isVerified || !user.isActive) {
        return res.json(successResponse);
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token to database
      await user.update({
        passwordResetToken: resetToken,
        passwordResetExpiresAt: resetTokenExpiry
      });

      // Send password reset email
      const emailResult = await emailService.sendPasswordResetEmail(
        user.email, 
        user.name, 
        resetToken
      );


      return res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong while processing your request'
      });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      // Validate input
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Reset token is required'
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
      }

      // Find user by reset token and check if not expired
      const user = await User.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpiresAt: {
            [require('sequelize').Op.gt]: new Date()
          },
          isActive: true
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password and clear reset token
      await user.update({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        lastLoginAt: new Date() // Optional: set last login
      });


      return res.json({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Something went wrong while resetting your password'
      });
    }
  },

  // Remove avatar
  removeAvatar: async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({ avatar_url: null });

      res.json({
        success: true,
        message: 'Avatar removed successfully'
      });
    } catch (error) {
      console.error('Remove avatar error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove avatar'
      });
    }
  }
};

module.exports = authController;
