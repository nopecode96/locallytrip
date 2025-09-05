const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Public routes (no authentication required for booking creation)
router.post('/', bookingController.createBooking);
router.get('/reference/:reference', bookingController.getBookingByReference);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply authentication middleware to all routes below

// User booking routes
router.get('/user/:userId', bookingController.getUserBookings);

// Admin/Host routes (require specific roles)
router.patch('/reference/:reference/status', 
  requireRole(['admin', 'host']), 
  bookingController.updateBookingStatus
);

// Host dashboard routes
router.get('/host/:hostId', 
  requireRole(['admin', 'host']), 
  async (req, res) => {
    try {
      const { hostId } = req.params;
      const { status, category, page = 1, limit = 10 } = req.query;

      // Ensure host can only see their own bookings (unless admin)
      if (req.user.role !== 'admin' && req.user.id !== parseInt(hostId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own bookings'
        });
      }

      const whereClause = { hostId };
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;

      const offset = (page - 1) * limit;

      const { count, rows: bookings } = await require('../models/Booking').findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: require('../models/User'),
            as: 'traveller',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(count / limit),
            total_items: count,
            items_per_page: parseInt(limit)
          }
        }
      });

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve host bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Admin analytics routes
router.get('/analytics/overview', 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const { period = '30' } = req.query; // days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const Booking = require('../models/Booking');
      const { Op } = require('sequelize');

      // Get booking statistics
      const totalBookings = await Booking.count({
        where: {
          createdAt: { [Op.gte]: startDate }
        }
      });

      const bookingsByStatus = await Booking.findAll({
        where: {
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['status']
      });

      const bookingsByCategory = await Booking.findAll({
        where: {
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [
          'category',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
          [require('sequelize').fn('SUM', require('sequelize').col('total_price')), 'total_revenue']
        ],
        group: ['category']
      });

      const totalRevenue = await Booking.sum('totalPrice', {
        where: {
          createdAt: { [Op.gte]: startDate },
          status: { [Op.in]: ['confirmed', 'completed'] }
        }
      });

      res.json({
        success: true,
        data: {
          period: `${period} days`,
          overview: {
            total_bookings: totalBookings,
            total_revenue: totalRevenue || 0,
            average_booking_value: totalBookings > 0 ? (totalRevenue || 0) / totalBookings : 0
          },
          by_status: bookingsByStatus,
          by_category: bookingsByCategory
        }
      });

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve booking analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Webhook routes for payment confirmation (would integrate with payment providers)
router.post('/webhook/payment', async (req, res) => {
  try {
    // This would validate webhook signature and update payment status
    const { booking_reference, payment_status, transaction_id } = req.body;

    const Booking = require('../models/Booking');
    const booking = await Booking.findOne({
      where: { bookingReference: booking_reference }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.update({
      paymentStatus: payment_status,
      paymentReference: transaction_id,
      ...(payment_status === 'paid' && { status: 'confirmed' })
    });

    // Send confirmation notifications
    // await sendPaymentConfirmationEmail(booking);

    res.json({
      success: true,
      message: 'Payment status updated'
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

module.exports = router;
