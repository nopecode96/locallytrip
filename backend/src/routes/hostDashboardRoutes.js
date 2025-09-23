const express = require('express');
const { 
  getHostDashboard,
  getHostExperiences,
  getHostExperiencesStats,
  getHostBookings,
  updateBookingStatus,
  getHostReviews,
  respondToReview,
  getHostStories,
  getHostStoryDetail,
  getHostComments
} = require('../controllers/hostController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /hosts/:id/dashboard - Get host dashboard overview/stats
router.get('/:id/dashboard', authenticateToken, getHostDashboard);

// GET /hosts/:id/experiences - Get host experiences list
router.get('/:id/experiences', authenticateToken, getHostExperiences);

// GET /hosts/:id/experiences/stats - Get host experiences statistics
router.get('/:id/experiences/stats', authenticateToken, getHostExperiencesStats);

// GET /hosts/:id/bookings - Get host bookings with filters
router.get('/:id/bookings', authenticateToken, getHostBookings);

// PUT /hosts/:hostId/bookings/:bookingId/status - Update booking status
router.put('/:hostId/bookings/:bookingId/status', authenticateToken, updateBookingStatus);

// GET /hosts/:id/reviews - Get host reviews
router.get('/:id/reviews', authenticateToken, getHostReviews);

// PUT /hosts/:hostId/reviews/:reviewId/respond - Respond to review
router.put('/:hostId/reviews/:reviewId/respond', authenticateToken, respondToReview);

// GET /hosts/:id/stories - Get host stories
router.get('/:id/stories', authenticateToken, getHostStories);

// GET /host-dashboard/stories/:id - Get host story detail with comments
router.get('/stories/:id', authenticateToken, getHostStoryDetail);

// GET /host-dashboard/comments - Get all comments for host stories
router.get('/comments', authenticateToken, getHostComments);

module.exports = router;
