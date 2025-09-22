const express = require('express');
const router = express.Router();
const { ExperienceType } = require('../../models');
const { authenticateAdmin, requirePermission } = require('../../middleware/admin/auth');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// All routes require admin authentication
router.use(authenticateAdmin);

// GET /admin/experience-types - Get all experience types for admin
router.get('/', requirePermission('can_manage_categories'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', active } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Active filter
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }

    const { count, rows } = await ExperienceType.findAndCountAll({
      where: whereClause,
      order: [['updatedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching experience types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience types'
    });
  }
});

// POST /admin/experience-types - Create new experience type
router.post('/', [
  requirePermission('can_manage_categories'),
  body('name').notEmpty().withMessage('Name is required'),
  body('name').isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('icon').optional().isLength({ max: 50 }).withMessage('Icon must be less than 50 characters'),
  body('color').optional().isLength({ max: 20 }).withMessage('Color must be less than 20 characters'),
  body('imageUrl').optional().custom((value) => {
    if (value === '' || value == null) return true; // Allow empty string or null
    if (typeof value === 'string' && value.match(/^https?:\/\/.+/)) return true; // Basic URL validation
    throw new Error('Image URL must be valid or empty');
  }),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const experienceType = await ExperienceType.create(req.body);

    res.status(201).json({
      success: true,
      data: experienceType,
      message: 'Experience type created successfully'
    });
  } catch (error) {
    console.error('Error creating experience type:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Experience type name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create experience type'
    });
  }
});

// PUT /admin/experience-types/:id - Update experience type
router.put('/:id', [
  requirePermission('can_manage_categories'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('name').optional().isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('icon').optional().isLength({ max: 50 }).withMessage('Icon must be less than 50 characters'),
  body('color').optional().isLength({ max: 20 }).withMessage('Color must be less than 20 characters'),
  body('imageUrl').optional().custom((value) => {
    if (value === '' || value == null) return true; // Allow empty string or null
    if (typeof value === 'string' && value.match(/^https?:\/\/.+/)) return true; // Basic URL validation
    throw new Error('Image URL must be valid or empty');
  }),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const experienceType = await ExperienceType.findByPk(req.params.id);
    
    if (!experienceType) {
      return res.status(404).json({
        success: false,
        error: 'Experience type not found'
      });
    }

    await experienceType.update(req.body);

    res.json({
      success: true,
      data: experienceType,
      message: 'Experience type updated successfully'
    });
  } catch (error) {
    console.error('Error updating experience type:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Experience type name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update experience type'
    });
  }
});

// DELETE /admin/experience-types/:id - Delete experience type
router.delete('/:id', requirePermission('can_manage_categories'), async (req, res) => {
  try {
    const experienceType = await ExperienceType.findByPk(req.params.id);
    
    if (!experienceType) {
      return res.status(404).json({
        success: false,
        error: 'Experience type not found'
      });
    }

    // Check if there are experiences using this type
    const { Experience } = require('../../models');
    const experienceCount = await Experience.count({
      where: { experienceTypeId: req.params.id }
    });

    if (experienceCount > 0) {
      // Soft delete by setting isActive to false
      await experienceType.update({ isActive: false });
      return res.json({
        success: true,
        message: `Experience type deactivated. It was being used by ${experienceCount} experience(s).`
      });
    }

    // Hard delete if no experiences are using it
    await experienceType.destroy();

    res.json({
      success: true,
      message: 'Experience type deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting experience type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete experience type'
    });
  }
});

// PATCH /admin/experience-types/:id/toggle-status - Toggle active status
router.patch('/:id/toggle-status', requirePermission('can_manage_categories'), async (req, res) => {
  try {
    const experienceType = await ExperienceType.findByPk(req.params.id);
    
    if (!experienceType) {
      return res.status(404).json({
        success: false,
        error: 'Experience type not found'
      });
    }

    await experienceType.update({ isActive: !experienceType.isActive });

    res.json({
      success: true,
      data: experienceType,
      message: `Experience type ${experienceType.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling experience type status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle experience type status'
    });
  }
});

module.exports = router;