const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticateToken } = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditMiddleware');

// All audit routes require authentication
router.use(authenticateToken);

/**
 * @route GET /api/v1/audit/history
 * @desc Get user's audit history with pagination and filters
 * @access Private
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50)
 * @query {string} actionCategory - Filter by action category (auth, profile, booking, etc.)
 * @query {string} severity - Filter by severity (low, medium, high, critical)
 * @query {string} startDate - Start date for filtering (ISO string)
 * @query {string} endDate - End date for filtering (ISO string)
 * @query {string} action - Filter by specific action
 */
router.get('/history', 
  auditMiddleware.log('view_audit_history', 'profile'),
  auditController.getUserAuditHistory
);

/**
 * @route GET /api/v1/audit/sessions
 * @desc Get user's active sessions
 * @access Private
 */
router.get('/sessions', 
  auditMiddleware.log('view_sessions', 'auth'),
  auditController.getUserSessions
);

/**
 * @route POST /api/v1/audit/sessions/:sessionId/terminate
 * @desc Terminate a specific session
 * @access Private
 * @param {string} sessionId - Session UUID to terminate
 */
router.post('/sessions/:sessionId/terminate', 
  auditMiddleware.logAuth('terminate_session', 'medium'),
  auditController.terminateSession
);

/**
 * @route GET /api/v1/audit/security-events
 * @desc Get user's security events
 * @access Private
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} severity - Filter by severity
 * @query {boolean} resolved - Filter by resolution status
 * @query {string} eventType - Filter by event type
 */
router.get('/security-events', 
  auditMiddleware.log('view_security_events', 'auth'),
  auditController.getUserSecurityEvents
);

/**
 * @route GET /api/v1/audit/summary
 * @desc Get activity summary for user dashboard
 * @access Private
 * @query {number} days - Number of days to include in summary (default: 30)
 */
router.get('/summary', 
  auditMiddleware.log('view_activity_summary', 'profile'),
  auditController.getActivitySummary
);

/**
 * @route GET /api/v1/audit/export
 * @desc Export user's audit data
 * @access Private
 * @query {string} format - Export format (json, csv) (default: json)
 * @query {string} startDate - Start date for export (ISO string)
 * @query {string} endDate - End date for export (ISO string)
 */
router.get('/export', 
  auditMiddleware.log('export_user_data', 'profile', 'high'),
  auditController.exportUserData
);

module.exports = router;
