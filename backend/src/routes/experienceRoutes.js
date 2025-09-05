const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { authenticateToken } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { body } = require('express-validator');

// Validation rules for experience creation/update
const experienceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  body('cityId').isUUID().withMessage('Valid city ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('meetingPoint').notEmpty().withMessage('Meeting point is required')
];

// Public routes - Order matters! Specific routes before parametric ones
router.get('/', experienceController.getAllExperiences);
router.get('/featured', experienceController.getFeaturedExperiences);
router.get('/stats/price-range', experienceController.getPriceRange); // More specific path
router.get('/slug/:slug', experienceController.getExperienceBySlug);
router.get('/:id', experienceController.getExperienceById);

// Protected routes - Host only
router.post('/', authenticateToken, requireRole(['host']), experienceValidation, experienceController.createExperience);
router.put('/:id', authenticateToken, requireRole(['host']), experienceValidation, experienceController.updateExperience);
router.delete('/:id', authenticateToken, requireRole(['host']), experienceController.deleteExperience);

// Host dashboard routes
router.get('/host/my-experiences', authenticateToken, requireRole(['host']), experienceController.getHostExperiences);

module.exports = router;
