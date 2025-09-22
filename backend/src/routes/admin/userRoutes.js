const express = require('express');
const { body } = require('express-validator');
const adminUserController = require('../../controllers/admin/userController');
const { authenticateAdmin, requirePermission, requireSuperAdmin } = require('../../middleware/admin/auth');

const router = express.Router();

// All user routes require admin authentication
router.use(authenticateAdmin);

// Validation rules
const createUserValidation = [
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['traveller', 'host', 'admin', 'finance', 'marketing', 'moderator']),
  body('phone').optional().isMobilePhone(),
  body('city_id').optional().isInt(),
  body('is_verified').optional().isBoolean(),
  body('is_active').optional().isBoolean()
];

const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['traveller', 'host', 'admin', 'finance', 'marketing', 'moderator']),
  body('phone').optional().isMobilePhone(),
  body('city_id').optional().isInt(),
  body('is_verified').optional().isBoolean(),
  body('is_active').optional().isBoolean()
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 })
];

// User management routes
router.get('/', requirePermission('manage_users'), adminUserController.getUsers);
router.get('/:id', requirePermission('manage_users'), adminUserController.getUserById);
router.post('/', requireSuperAdmin, createUserValidation, adminUserController.createUser);
router.put('/:id', requirePermission('manage_users'), updateUserValidation, adminUserController.updateUser);
router.delete('/:id', requireSuperAdmin, adminUserController.deleteUser);
router.post('/:id/reset-password', requireSuperAdmin, resetPasswordValidation, adminUserController.resetPassword);

module.exports = router;
