const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const newsletterValidation = require('../middleware/newsletterValidation');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');

// Public routes
// Subscribe to newsletter (both guest and logged-in users)
router.post('/subscribe', 
  optionalAuth, 
  newsletterValidation.subscribe, 
  newsletterController.subscribe
);

// Verify newsletter subscription via email link
router.get('/verify/:token', newsletterController.verifySubscription);

// Unsubscribe via email link
router.get('/unsubscribe/:token', newsletterController.unsubscribe);

// Authenticated user routes
// Get user's subscription status
router.get('/subscription', 
  requireAuth, 
  newsletterController.getUserSubscription
);

// Update user's newsletter preferences
router.put('/preferences', 
  requireAuth, 
  newsletterValidation.updatePreferences, 
  newsletterController.updatePreferences
);

// Admin routes
// Get newsletter statistics
router.get('/stats', 
  requireAuth, 
  requireAdmin, 
  newsletterController.getStats
);

module.exports = router;
