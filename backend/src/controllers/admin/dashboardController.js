const { User, Experience, Booking, Story, Review, Role } = require('../../models');
const { Op } = require('sequelize');

const adminDashboardController = {
  // Get dashboard overview statistics
  getDashboardStats: async (req, res) => {
    try {
      // Get date ranges for comparisons
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Total counts
      const [
        totalUsers,
        totalExperiences, 
        totalBookings,
        totalStories,
        totalReviews
      ] = await Promise.all([
        User.count({ where: { is_active: true } }),
        Experience.count({ where: { is_active: true } }),
        Booking.count(),
        Story.count({ where: { is_published: true } }),
        Review.count()
      ]);

      // This month counts for growth calculation
      const [
        thisMonthUsers,
        thisMonthBookings,
        thisMonthStories
      ] = await Promise.all([
        User.count({ 
          where: { 
            is_active: true,
            created_at: { [Op.gte]: thisMonth }
          }
        }),
        Booking.count({ 
          where: { 
            created_at: { [Op.gte]: thisMonth }
          }
        }),
        Story.count({ 
          where: { 
            is_published: true,
            created_at: { [Op.gte]: thisMonth }
          }
        })
      ]);

      // Calculate revenue (sum of booking amounts)
      const revenueResult = await Booking.sum('total_amount', {
        where: {
          status: 'confirmed'
        }
      });
      const totalRevenue = revenueResult || 0;

      const thisMonthRevenue = await Booking.sum('total_amount', {
        where: {
          status: 'confirmed',
          created_at: { [Op.gte]: thisMonth }
        }
      }) || 0;

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalExperiences,
            totalBookings,
            totalStories,
            totalReviews,
            totalRevenue
          },
          growth: {
            newUsersThisMonth: thisMonthUsers,
            newBookingsThisMonth: thisMonthBookings,
            newStoriesThisMonth: thisMonthStories,
            revenueThisMonth: thisMonthRevenue
          }
        }
      });

    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics'
      });
    }
  },

  // Get recent activities
  getRecentActivities: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      // Recent bookings
      const recentBookings = await Booking.findAll({
        limit,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Experience,
            as: 'experience',
            attributes: ['id', 'title', 'slug']
          }
        ]
      });

      // Recent user registrations
      const recentUsers = await User.findAll({
        limit,
        order: [['created_at', 'DESC']],
        where: { is_active: true },
        attributes: ['id', 'name', 'email', 'role', 'created_at']
      });

      // Recent stories
      const recentStories = await Story.findAll({
        limit,
        order: [['created_at', 'DESC']],
        where: { is_published: true },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          recentBookings,
          recentUsers,
          recentStories
        }
      });

    } catch (error) {
      console.error('Recent activities error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent activities'
      });
    }
  },

  // Get user analytics
  getUserAnalytics: async (req, res) => {
    try {
      // User distribution by role
      const usersByRole = await User.findAll({
        attributes: [
          'role',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        where: { is_active: true },
        group: ['role']
      });

      // User registration trend (last 12 months)
      const userTrend = await User.findAll({
        attributes: [
          [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('created_at')), 'month'],
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        where: {
          created_at: {
            [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
          },
          is_active: true
        },
        group: [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('created_at'))],
        order: [[require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('created_at')), 'ASC']]
      });

      res.json({
        success: true,
        data: {
          usersByRole,
          userTrend
        }
      });

    } catch (error) {
      console.error('User analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user analytics'
      });
    }
  }
};

module.exports = adminDashboardController;
