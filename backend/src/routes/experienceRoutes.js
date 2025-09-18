const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { authenticateToken } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for experience images
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/images/experiences');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware to parse FormData strings to proper types before validation
const parseFormDataFields = (req, res, next) => {
  try {
    // Parse integer fields
    const intFields = ['categoryId', 'cityId', 'duration', 'maxGuests', 'minGuests', 'experienceTypeId'];
    intFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        const parsed = parseInt(req.body[field], 10);
        if (!isNaN(parsed)) {
          req.body[field] = parsed;
        }
      }
    });

    // Parse float fields
    const floatFields = ['pricePerPackage', 'latitude', 'longitude', 'walkingDistance'];
    floatFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        const parsed = parseFloat(req.body[field]);
        if (!isNaN(parsed)) {
          req.body[field] = parsed;
        }
      }
    });

    // Parse JSON array fields
    const arrayFields = ['included', 'excluded', 'deliverables', 'equipmentUsed', 'images'];
    arrayFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // If parsing fails, leave as string - validation will catch it
        }
      }
    });

    // Parse JSON object fields
    const objectFields = ['hostSpecificData'];
    objectFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // If parsing fails, leave as string - validation will catch it
        }
      }
    });

    next();
  } catch (error) {
    console.error('Error parsing form data:', error);
    next(error);
  }
};

// Validation rules for experience creation/update
const experienceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('pricePerPackage').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('categoryId').isInt().withMessage('Valid category ID is required'),
  body('cityId').isInt().withMessage('Valid city ID is required'),
  body('meetingPoint').notEmpty().withMessage('Meeting point is required'),
  body('location').optional().isString().withMessage('Location must be a string'),
  // Optional fields
  body('minGuests').optional().isInt({ min: 1 }).withMessage('Min guests must be at least 1'),
  body('shortDescription').optional().isString().withMessage('Short description must be a string'),
  body('experienceTypeId').optional().isInt().withMessage('Experience type ID must be an integer'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('difficulty').optional().isString().withMessage('Difficulty must be a string'),
  body('fitnessLevel').optional().isString().withMessage('Fitness level must be a string'),
  body('endingPoint').optional().isString().withMessage('Ending point must be a string'),
  body('walkingDistance').optional().isFloat({ min: 0 }).withMessage('Walking distance must be a positive number'),
  // JSONB fields
  body('hostSpecificData').optional().isObject().withMessage('Host specific data must be an object'),
  body('included').optional().isArray().withMessage('Included items must be an array'),
  body('excluded').optional().isArray().withMessage('Excluded items must be an array'),
  body('deliverables').optional().isArray().withMessage('Deliverables must be an array'),
  body('equipmentUsed').optional().isArray().withMessage('Equipment used must be an array'),
  body('images').optional().isArray().withMessage('Images must be an array')
];

// Public routes - Order matters! Specific routes before parametric ones
router.get('/', experienceController.getAllExperiences);
router.get('/featured', experienceController.getFeaturedExperiences);
router.get('/stats/price-range', experienceController.getPriceRange); // More specific path
router.get('/slug/:slug', experienceController.getExperienceBySlug);
router.get('/:id', experienceController.getExperienceById);

// Protected routes - Host only
router.post('/', authenticateToken, requireRole(['host']), upload.array('images', 10), parseFormDataFields, experienceValidation, experienceController.createExperience);
router.put('/:id', authenticateToken, requireRole(['host']), upload.array('images', 10), parseFormDataFields, experienceValidation, experienceController.updateExperience);
router.delete('/:id', authenticateToken, requireRole(['host']), experienceController.deleteExperience);

// Status management routes - Host
router.patch('/:id/submit-review', authenticateToken, requireRole(['host']), experienceController.submitForReview);
router.patch('/:id/resubmit', authenticateToken, requireRole(['host']), experienceController.resubmitExperience);
router.post('/:id/pause', authenticateToken, requireRole(['host']), experienceController.pauseExperience);
router.post('/:id/resume', authenticateToken, requireRole(['host']), experienceController.resumeExperience);

// Status management routes - Admin only
router.patch('/:id/publish', authenticateToken, requireRole(['admin']), experienceController.publishExperience);
router.patch('/:id/reject', authenticateToken, requireRole(['admin']), experienceController.rejectExperience);
router.patch('/:id/suspend', authenticateToken, requireRole(['admin']), experienceController.suspendExperience);

// Host dashboard routes
router.get('/host/my-experiences', authenticateToken, requireRole(['host']), experienceController.getHostExperiences);
router.get('/host/stats', authenticateToken, requireRole(['host']), experienceController.getHostExperiencesStats);

module.exports = router;
