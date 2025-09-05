const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1-100 characters'),
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1-50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1-50 characters'),
  body('role').optional().isIn(['traveller', 'host']).withMessage('Role must be traveller or host'),
  body('userType').optional().isIn(['traveller', 'host']).withMessage('User type must be traveller or host'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number format'),
  body('cityId').optional().isInt({ min: 1 }).withMessage('City ID must be a positive integer'),
  
  // Conditional validation for host categories
  body('hostCategories').custom((value, { req }) => {
    const userType = req.body.userType || req.body.role;
    
    // If user type is host, hostCategories is required
    if (userType === 'host') {
      if (!value || !Array.isArray(value) || value.length === 0) {
        throw new Error('Host categories are required for host registration');
      }
      
      // Validate each category ID is a positive integer
      for (let categoryId of value) {
        if (!Number.isInteger(Number(categoryId)) || Number(categoryId) < 1) {
          throw new Error('All host category IDs must be positive integers');
        }
      }
      
      // Limit maximum categories (optional business rule)
      if (value.length > 4) {
        throw new Error('Maximum 4 host categories allowed');
      }
    } else if (value !== undefined) {
      // If not host, hostCategories should not be provided
      throw new Error('Host categories can only be specified for host registration');
    }
    
    return true;
  }),
  
  // Ensure at least name or firstName is provided
  body().custom((value, { req }) => {
    const { name, firstName, lastName } = req.body;
    
    if (!name && !firstName && !lastName) {
      throw new Error('Either name or firstName is required');
    }
    
    return true;
  })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const updateProfileValidation = [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('phone').optional().isMobilePhone()
];

const emailVerificationValidation = [
  body('token').notEmpty().withMessage('Verification token is required')
];

const resendVerificationValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/verify-email', emailVerificationValidation, authController.verifyEmail);
router.post('/resend-verification', resendVerificationValidation, authController.resendVerificationEmail);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, authController.updateProfile);
router.post('/change-password', authenticateToken, authController.changePassword);
router.post('/upload-avatar', authenticateToken, authController.uploadMiddleware, authController.uploadAvatar);
router.delete('/remove-avatar', authenticateToken, authController.removeAvatar);

module.exports = router;
