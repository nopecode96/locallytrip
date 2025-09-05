const express = require('express');
const adminDashboardController = require('../../controllers/admin/dashboardController');
const { authenticateAdmin, requirePermission } = require('../../middleware/admin/auth');

const router = express.Router();

// All dashboard routes require admin authentication
router.use(authenticateAdmin);

// Dashboard routes
router.get('/stats', requirePermission('can_view_analytics'), adminDashboardController.getDashboardStats);
router.get('/activities', adminDashboardController.getRecentActivities);
router.get('/user-analytics', requirePermission('can_view_analytics'), adminDashboardController.getUserAnalytics);

module.exports = router;
