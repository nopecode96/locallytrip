const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');
const { User, Language, UserLanguage } = require('../models');

const router = express.Router();

// Validation rules
const addLanguageValidation = [
  body('languageId').isInt({ min: 1 }).withMessage('Valid language ID is required'),
  body('proficiency').isIn(['basic', 'intermediate', 'advanced', 'native']).withMessage('Valid proficiency level is required')
];

const updateLanguageValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid user language ID is required'),
  body('proficiency').isIn(['basic', 'intermediate', 'advanced', 'native']).withMessage('Valid proficiency level is required')
];

const deleteLanguageValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid user language ID is required')
];

// Get user's languages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userLanguages = await UserLanguage.findAll({
      where: { userId, isActive: true },
      include: [
        {
          model: Language,
          as: 'language',
          attributes: ['id', 'name', 'code', 'nativeName']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: userLanguages
    });
  } catch (error) {
    console.error('Get user languages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user languages'
    });
  }
});

// Add new language
router.post('/', 
  authenticateToken,
  addLanguageValidation,
  auditMiddleware.logProfile('user_language_add', 'low'),
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const userId = req.user.userId;
      const { languageId, proficiency } = req.body;

      // Check if language exists
      const language = await Language.findByPk(languageId);
      if (!language) {
        return res.status(404).json({
          success: false,
          error: 'Language not found'
        });
      }

      // Check if user already has this language
      const existingUserLanguage = await UserLanguage.findOne({
        where: { userId, languageId }
      });

      if (existingUserLanguage) {
        if (existingUserLanguage.isActive) {
          return res.status(400).json({
            success: false,
            error: 'Language already added'
          });
        } else {
          // Reactivate existing language
          await existingUserLanguage.update({
            proficiency,
            isActive: true
          });

          // Fetch updated record with language details
          const updatedUserLanguage = await UserLanguage.findByPk(existingUserLanguage.id, {
            include: [
              {
                model: Language,
                as: 'language',
                attributes: ['id', 'name', 'code', 'nativeName']
              }
            ]
          });

          return res.json({
            success: true,
            data: updatedUserLanguage,
            message: 'Language reactivated successfully'
          });
        }
      }

      // Create new user language
      const userLanguage = await UserLanguage.create({
        userId,
        languageId,
        proficiency,
        isActive: true
      });

      // Fetch created record with language details
      const newUserLanguage = await UserLanguage.findByPk(userLanguage.id, {
        include: [
          {
            model: Language,
            as: 'language',
            attributes: ['id', 'name', 'code', 'nativeName']
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: newUserLanguage,
        message: 'Language added successfully'
      });
    } catch (error) {
      console.error('Add user language error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add language'
      });
    }
  }
);

// Update language proficiency
router.put('/:id',
  authenticateToken,
  updateLanguageValidation,
  auditMiddleware.logProfile('user_language_update', 'low'),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const userLanguageId = req.params.id;
      const { proficiency } = req.body;

      const userLanguage = await UserLanguage.findOne({
        where: { 
          id: userLanguageId, 
          userId,
          isActive: true 
        }
      });

      if (!userLanguage) {
        return res.status(404).json({
          success: false,
          error: 'User language not found'
        });
      }

      await userLanguage.update({ proficiency });

      // Fetch updated record with language details
      const updatedUserLanguage = await UserLanguage.findByPk(userLanguage.id, {
        include: [
          {
            model: Language,
            as: 'language',
            attributes: ['id', 'name', 'code', 'nativeName']
          }
        ]
      });

      res.json({
        success: true,
        data: updatedUserLanguage,
        message: 'Language proficiency updated successfully'
      });
    } catch (error) {
      console.error('Update user language error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update language proficiency'
      });
    }
  }
);

// Remove language (soft delete)
router.delete('/:id',
  authenticateToken,
  deleteLanguageValidation,
  auditMiddleware.logProfile('user_language_remove', 'low'),
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const userId = req.user.userId;
      const userLanguageId = req.params.id;

      const userLanguage = await UserLanguage.findOne({
        where: { 
          id: userLanguageId, 
          userId,
          isActive: true 
        }
      });

      if (!userLanguage) {
        return res.status(404).json({
          success: false,
          error: 'User language not found'
        });
      }

      await userLanguage.update({ isActive: false });

      res.json({
        success: true,
        message: 'Language removed successfully'
      });
    } catch (error) {
      console.error('Remove user language error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove language'
      });
    }
  }
);

module.exports = router;
