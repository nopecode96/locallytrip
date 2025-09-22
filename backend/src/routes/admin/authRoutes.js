const express = require('express');
const { body } = require('express-validator');
const adminAuthController = require('../../controllers/admin/authController');
const { authenticateAdmin } = require('../../middleware/admin/auth');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Public routes
router.post('/login', loginValidation, adminAuthController.login);

// Protected routes
router.get('/profile', authenticateAdmin, adminAuthController.getProfile);
router.get('/validate', authenticateAdmin, adminAuthController.validate);
router.post('/logout', authenticateAdmin, adminAuthController.logout);

module.exports = router;
