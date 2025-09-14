const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { authenticateToken } = require('../middleware/auth');

// All notification routes require authentication
router.use(authenticateToken);

// GET /notifications/settings - Get current user's notification settings
router.get('/settings', NotificationController.getNotificationSettings);

// PUT /notifications/settings - Update current user's notification settings
router.put('/settings', NotificationController.updateNotificationSettings);

// POST /notifications/settings/reset - Reset notification settings to defaults
router.post('/settings/reset', NotificationController.resetNotificationSettings);

// Admin routes (if needed later)
// GET /notifications/settings/:userId - Get specific user's notification settings (admin only)
// router.get('/settings/:userId', requireAdmin, NotificationController.getNotificationSettings);

// PUT /notifications/settings/:userId - Update specific user's notification settings (admin only)
// router.put('/settings/:userId', requireAdmin, NotificationController.updateNotificationSettings);

module.exports = router;
