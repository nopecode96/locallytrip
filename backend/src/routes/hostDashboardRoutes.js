const express = require('express');
const { 
  getHostDashboard,
  getHostExperiences,
  getHostExperiencesStats,
  getHostBookings,
  updateBookingStatus,
  getHostReviews,
  respondToReview
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

module.exports = router;
