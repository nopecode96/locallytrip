const { body, validationResult } = require('express-validator');

const newsletterValidation = {
  // Validation for newsletter subscription
  subscribe: [
    // Add logging middleware first
    (req, res, next) => {
      console.log('🔍 Newsletter Validation - Raw Request Body:', JSON.stringify(req.body, null, 2));
      console.log('🔍 Newsletter Validation - Headers:', JSON.stringify(req.headers, null, 2));
      console.log('🔍 Newsletter Validation - Content-Type:', req.get('Content-Type'));
      next();
    },
    
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .isLength({ max: 255 })
      .withMessage('Email is too long'),
    
    // name is optional and allows empty strings
    body('name')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Name is too long'),

    body('frequency')
      .optional()
      .isIn(['weekly', 'monthly', 'bi-weekly'])
      .withMessage('Frequency must be weekly, monthly, or bi-weekly'),

    body('categories')
      .optional()
      .custom((value) => {
        // Allow undefined, null, or empty array
        if (value === undefined || value === null || value === '') {
          return true;
        }
        // Must be an array if provided
        if (!Array.isArray(value)) {
          throw new Error('Categories must be an array');
        }
        // All items must be strings
        if (value.some(item => typeof item !== 'string')) {
          throw new Error('Each category must be a string');
        }
        return true;
      }),

    body('source')
      .optional()
      .isIn(['register', 'story_detail', 'experience_detail', 'homepage', 'manual'])
      .withMessage('Invalid subscription source'),

    // Add validation result checking middleware at the end
    (req, res, next) => {
      console.log('🔍 Newsletter Validation - After validation check:');
      const errors = validationResult(req);
      console.log('🔍 Newsletter Validation - Has errors:', !errors.isEmpty());
      if (!errors.isEmpty()) {
        console.log('🔍 Newsletter Validation - Errors:', JSON.stringify(errors.array(), null, 2));
        console.log('🔍 Newsletter Validation - Final req.body:', JSON.stringify(req.body, null, 2));
      } else {
        console.log('🔍 Newsletter Validation - PASSED - Final req.body:', JSON.stringify(req.body, null, 2));
      }
      next();
    }
  ],

  // Validation for preference updates
  updatePreferences: [
    body('preferences')
      .optional()
      .isObject()
      .withMessage('Preferences must be an object'),
    
    body('preferences.weeklyNewsletter')
      .optional()
      .isBoolean()
      .withMessage('weeklyNewsletter must be a boolean'),

    body('preferences.newExperiences')
      .optional()
      .isBoolean()
      .withMessage('newExperiences must be a boolean'),

    body('preferences.featuredStories')
      .optional()
      .isBoolean()
      .withMessage('featuredStories must be a boolean'),

    body('preferences.specialOffers')
      .optional()
      .isBoolean()
      .withMessage('specialOffers must be a boolean'),

    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ]
};

module.exports = newsletterValidation;
