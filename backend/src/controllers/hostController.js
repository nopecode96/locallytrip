const { User, Experience, Booking, Review, HostCategory, Story, StoryComment } = require('../models');
const { Op, sequelize } = require('sequelize');
const { sequelize: dbInstance } = require('../config/database');

/**
 * Get host experiences list
 * GET /hosts/:id/experiences
 */
const getHostExperiences = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify host exists and belongs to authenticated user
    const host = await User.findOne({
      where: { id: id, role: 'host', isActive: true },
      attributes: ['id', 'name']
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { 
      hostId: id,
      status: { [Op.ne]: 'deleted' } // Exclude deleted experiences
    };

    // Filter by status if provided
    if (status === 'active') {
      where.status = 'published';
    } else if (status === 'inactive') {
      where.status = { [Op.in]: ['paused', 'suspended', 'draft'] };
    } else if (status === 'pending') {
      where.status = 'pending_review';
    } else if (status === 'draft') {
      where.status = 'draft';
    } else if (status === 'rejected') {
      where.status = 'rejected';
    }

    const experiences = await Experience.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: HostCategory,
          as: 'category',
          attributes: ['id', 'name', 'icon']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        experiences: experiences.rows,
        pagination: {
          total: experiences.count,
          pages: Math.ceil(experiences.count / parseInt(limit)),
          currentPage: parseInt(page)
        }
      }
    });
  } catch (error) {
    console.error('Host experiences list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host experiences',
      error: error.message
    });
  }
};

/**
 * Get host experiences statistics and overview
 * GET /hosts/:id/experiences/stats
 */
const getHostExperiencesStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify host exists and belongs to authenticated user
    const host = await User.findOne({
      where: { id: id, role: 'host', isActive: true },
      attributes: ['id', 'name']
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    // Get experiences stats by status (exclude deleted)
    const [
      activeExperiences, 
      pendingExperiences, 
      draftExperiences, 
      rejectedExperiences,
      pausedExperiences,
      totalExperiences
    ] = await Promise.all([
      Experience.count({ where: { hostId: id, status: 'published' } }),
      Experience.count({ where: { hostId: id, status: 'pending_review' } }),
      Experience.count({ where: { hostId: id, status: 'draft' } }),
      Experience.count({ where: { hostId: id, status: 'rejected' } }),
      Experience.count({ where: { hostId: id, status: 'paused' } }),
      Experience.count({ where: { hostId: id, status: { [Op.ne]: 'deleted' } } }) // Exclude deleted
    ]);

    // Get total bookings for host's experiences
    const totalBookings = await Booking.count({
      where: { '$experience.host_id$': id },
      include: [{ model: Experience, as: 'experience', attributes: [] }]
    });

    // Get total views (we don't have views tracking yet, so return 0)
    const totalViews = 0; // Would need views tracking field in future

    res.json({
      success: true,
      data: {
        stats: {
          active: activeExperiences,
          pending: pendingExperiences,
          draft: draftExperiences,
          rejected: rejectedExperiences,
          paused: pausedExperiences,
          total: totalExperiences,
          totalViews: totalViews,
          totalBookings: totalBookings
        }
      }
    });
  } catch (error) {
    console.error('Host experiences stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host experiences statistics',
      error: error.message
    });
  }
};

/**
 * Get host dashboard overview/stats
 * GET /hosts/:id/dashboard
 */
const getHostDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify host exists and belongs to authenticated user
    const host = await User.findOne({
      where: { id: id, role: 'host', isActive: true },
      attributes: ['id', 'name']
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    // Get experiences count
    const experienceStats = await Experience.count({
      where: { host_id: id, isActive: true }
    });

    // Get bookings stats
    const [totalBookings, confirmedBookings, pendingBookings, completedBookings] = await Promise.all([
      Booking.count({ where: { '$experience.host_id$': id }, include: [{ model: Experience, as: 'experience', attributes: [] }] }),
      Booking.count({ where: { '$experience.host_id$': id, status: 'confirmed' }, include: [{ model: Experience, as: 'experience', attributes: [] }] }),
      Booking.count({ where: { '$experience.host_id$': id, status: 'pending' }, include: [{ model: Experience, as: 'experience', attributes: [] }] }),
      Booking.count({ where: { '$experience.host_id$': id, status: 'completed' }, include: [{ model: Experience, as: 'experience', attributes: [] }] })
    ]);

    // Calculate total revenue
    const revenueResult = await Booking.sum('totalPrice', {
      where: { 
        '$experience.host_id$': id,
        status: { [Op.in]: ['confirmed', 'completed'] }
      },
      include: [{ model: Experience, as: 'experience', attributes: [] }]
    });

    const totalRevenue = revenueResult || 0;

    // Get recent bookings (last 10)
    const recentBookings = await Booking.findAll({
      where: { '$experience.host_id$': id },
      include: [
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'images']
        },
        {
          model: User,
          as: 'traveler',
          attributes: ['id', 'name', 'avatarUrl', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get reviews stats
    const reviewsStats = await dbInstance.query(`
      SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM reviews r 
      JOIN experiences e ON r.experience_id = e.id 
      WHERE e.host_id = :hostId AND r.is_verified = true
    `, { 
      replacements: { hostId: id },
      type: dbInstance.QueryTypes.SELECT 
    });

    const reviewStats = reviewsStats[0] || { total_reviews: 0, average_rating: 0 };

    // Get monthly revenue trend (last 6 months)
    const monthlyRevenue = await dbInstance.query(`
      SELECT 
        DATE_TRUNC('month', b.created_at) as month,
        COALESCE(SUM(b.total_price), 0) as revenue
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      WHERE e.host_id = :hostId 
        AND b.status IN ('confirmed', 'completed')
        AND b.created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', b.created_at)
      ORDER BY month DESC
    `, {
      replacements: { hostId: id },
      type: dbInstance.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalExperiences: experienceStats,
          totalBookings,
          confirmedBookings,
          pendingBookings,
          completedBookings,
          totalRevenue: parseFloat(totalRevenue || 0),
          averageRating: parseFloat(reviewStats.average_rating || 0),
          totalReviews: parseInt(reviewStats.total_reviews || 0)
        },
        recentBookings: recentBookings.map(booking => ({
          id: booking.id,
          uuid: booking.uuid,
          status: booking.status,
          totalAmount: parseFloat(booking.totalPrice),
          currency: booking.currency,
          experienceDate: booking.bookingDate,
          guestCount: booking.participantCount,
          createdAt: booking.createdAt,
          experience: {
            id: booking.experience.id,
            title: booking.experience.title,
            coverImage: booking.experience.images?.[0] || null
          },
          guest: {
            id: booking.traveler.id,
            name: booking.traveler.name,
            avatar: booking.traveler.avatarUrl,
            email: booking.traveler.email
          }
        })),
        monthlyRevenue: monthlyRevenue.map(item => ({
          month: item.month,
          revenue: parseFloat(item.revenue || 0)
        }))
      }
    });

  } catch (error) {
    console.error('Error getting host dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get host bookings with filters
 * GET /hosts/:id/bookings
 */
const getHostBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      page = 1, 
      limit = 20,
      sort = 'newest',
      experience_id 
    } = req.query;

    // Build where clause for bookings
    let bookingWhere = {};
    if (status && status !== 'all') {
      bookingWhere.status = status;
    }
    if (experience_id) {
      bookingWhere.experience_id = experience_id;
    }

    // Sort options
    let order = [['createdAt', 'DESC']];
    if (sort === 'oldest') order = [['createdAt', 'ASC']];
    if (sort === 'amount_high') order = [['totalPrice', 'DESC']];
    if (sort === 'amount_low') order = [['totalPrice', 'ASC']];

    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const bookings = await Booking.findAndCountAll({
      where: {
        ...bookingWhere,
        '$experience.host_id$': id
      },
      include: [
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'images', 'duration', 'maxGuests']
        },
        {
          model: User,
          as: 'traveler',
          attributes: ['id', 'name', 'avatarUrl', 'email', 'phone']
        }
      ],
      order: order,
      limit: pageSize,
      offset: offset,
      distinct: true
    });

    const transformedBookings = bookings.rows.map(booking => ({
      id: booking.id,
      uuid: booking.uuid,
      status: booking.status,
      totalAmount: parseFloat(booking.totalPrice),
      currency: booking.currency,
      experienceDate: booking.bookingDate,
      guestCount: booking.participantCount,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      experience: {
        id: booking.experience.id,
        title: booking.experience.title,
        coverImage: booking.experience.images?.[0] || null,
        duration: booking.experience.duration,
        maxGuests: booking.experience.maxGuests
      },
      guest: {
        id: booking.traveler.id,
        name: booking.traveler.name,
        avatar: booking.traveler.avatarUrl,
        email: booking.traveler.email,
        phone: booking.traveler.phone
      }
    }));

    res.json({
      success: true,
      data: transformedBookings,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total: bookings.count,
        totalPages: Math.ceil(bookings.count / pageSize)
      }
    });

  } catch (error) {
    console.error('Error getting host bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * Update booking status
 * PUT /hosts/:hostId/bookings/:bookingId/status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { hostId, bookingId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Find booking and verify it belongs to this host
    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [{
        model: Experience,
        as: 'experience',
        where: { host_id: hostId },
        attributes: ['id', 'title', 'host_id']
      }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to update it'
      });
    }

    // Update booking status
    await booking.update({
      status: status,
      cancellationReason: notes, // Using existing field for general notes
      updatedAt: new Date()
    });

    // TODO: Send notification to guest about status change
    // await sendBookingStatusNotification(booking, status);

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: {
        id: booking.id,
        status: booking.status,
        notes: booking.cancellationReason,
        updatedAt: booking.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

/**
 * Get host reviews
 * GET /hosts/:id/reviews
 */
const getHostReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, rating } = req.query;

    let whereClause = {};
    if (rating) {
      whereClause.rating = rating;
    }

    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const reviews = await Review.findAndCountAll({
      where: {
        ...whereClause,
        '$experience.host_id$': id,
        isVerified: true
      },
      include: [
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'images']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'avatarUrl']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: offset,
      distinct: true
    });

    const transformedReviews = reviews.rows.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      hostResponse: review.hostResponse,
      createdAt: review.createdAt,
      experience: {
        id: review.experience.id,
        title: review.experience.title,
        coverImage: review.experience.images?.[0] || null
      },
      guest: {
        id: review.reviewer.id,
        name: review.reviewer.name,
        avatar: review.reviewer.avatarUrl
      }
    }));

    res.json({
      success: true,
      data: transformedReviews,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total: reviews.count,
        totalPages: Math.ceil(reviews.count / pageSize)
      }
    });

  } catch (error) {
    console.error('Error getting host reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Respond to review
 * PUT /hosts/:hostId/reviews/:reviewId/respond
 */
const respondToReview = async (req, res) => {
  try {
    const { hostId, reviewId } = req.params;
    const { response } = req.body;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response cannot be empty'
      });
    }

    // Find review and verify it belongs to this host's experience
    const review = await Review.findOne({
      where: { id: reviewId },
      include: [{
        model: Experience,
        as: 'experience',
        where: { host_id: hostId },
        attributes: ['id', 'title', 'host_id']
      }]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to respond'
      });
    }

    // Update review with host response
    await review.update({
      hostResponse: response.trim(),
      hostResponseAt: new Date()
    });

    res.json({
      success: true,
      message: 'Response added successfully',
      data: {
        id: review.id,
        hostResponse: review.hostResponse,
        hostResponseAt: review.hostResponseAt
      }
    });

  } catch (error) {
    console.error('Error responding to review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

/**
 * Get host stories list
 * GET /hosts/:id/stories
 */
const getHostStories = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify host exists and belongs to authenticated user
    const host = await User.findOne({
      where: { id: id, role: 'host', isActive: true },
      attributes: ['id', 'name']
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { 
      authorId: id
    };

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    const stories = await Story.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        stories: stories.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: stories.count,
          totalPages: Math.ceil(stories.count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching host stories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
};

/**
 * Get host story detail with comments
 * GET /host-dashboard/stories/:id
 */
const getHostStoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // Find story and verify ownership
    const story = await Story.findOne({
      where: { 
        id: id,
        authorId: userId // Only allow host to see their own stories
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url']
        },
        {
          model: StoryComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'avatar_url']
            }
          ],
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found or you do not have permission to view it'
      });
    }

    // Transform data to match frontend expectations
    const transformedStory = {
      id: story.id,
      uuid: story.uuid,
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      content: story.content,
      image: story.image,
      status: story.status,
      adminReason: story.adminReason,
      readingTime: story.readingTime || 5,
      viewCount: story.viewCount || 0,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      author: {
        id: story.author.id,
        firstName: story.author.name?.split(' ')[0] || '',
        lastName: story.author.name?.split(' ').slice(1).join(' ') || '',
        avatar_url: story.author.avatar_url
      },
      comments: story.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        isApproved: comment.is_approved,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          email: comment.user.email,
          avatarUrl: comment.user.avatar_url
        },
        parentId: comment.parent_id,
        replies: [] // Could be expanded to include nested replies
      })),
      commentsCount: story.comments?.length || 0,
      likesCount: 0 // Could be expanded to include likes
    };

    res.json({
      success: true,
      data: transformedStory
    });

  } catch (error) {
    console.error('Error fetching host story detail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story detail',
      error: error.message
    });
  }
};

/**
 * Get all comments for host stories
 * GET /host-dashboard/comments
 */
const getHostComments = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { status, page = 1, limit = 20, search, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    // Build where conditions for stories belonging to the host
    const storyWhere = {
      authorId: userId
    };

    // Build where conditions for comments
    const commentWhere = {};
    
    if (status === 'approved') {
      commentWhere.is_approved = true;
    } else if (status === 'pending') {
      commentWhere.is_approved = false;
    }

    // Build search conditions
    let searchConditions = {};
    if (search) {
      searchConditions = {
        [Op.or]: [
          { content: { [Op.iLike]: `%${search}%` } },
          { '$user.name$': { [Op.iLike]: `%${search}%` } },
          { '$story.title$': { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    // Combine where conditions
    const finalWhere = {
      ...commentWhere,
      ...searchConditions
    };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get comments with pagination
    const { count, rows: comments } = await StoryComment.findAndCountAll({
      where: finalWhere,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar_url']
        },
        {
          model: Story,
          as: 'story',
          where: storyWhere,
          attributes: ['id', 'title', 'slug', 'authorId']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Calculate statistics
    const totalComments = await StoryComment.count({
      include: [
        {
          model: Story,
          as: 'story',
          where: storyWhere,
          attributes: []
        }
      ]
    });

    const approvedComments = await StoryComment.count({
      where: { is_approved: true },
      include: [
        {
          model: Story,
          as: 'story',
          where: storyWhere,
          attributes: []
        }
      ]
    });

    const pendingComments = await StoryComment.count({
      where: { is_approved: false },
      include: [
        {
          model: Story,
          as: 'story',
          where: storyWhere,
          attributes: []
        }
      ]
    });

    // Recent comments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentComments = await StoryComment.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      include: [
        {
          model: Story,
          as: 'story',
          where: storyWhere,
          attributes: []
        }
      ]
    });

    // Transform comments data
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      isApproved: comment.is_approved,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: {
        id: comment.user.id,
        name: comment.user.name,
        email: comment.user.email,
        avatarUrl: comment.user.avatar_url
      },
      story: {
        id: comment.story.id,
        title: comment.story.title,
        slug: comment.story.slug
      },
      parentId: comment.parent_id
    }));

    res.json({
      success: true,
      data: {
        comments: transformedComments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        },
        stats: {
          total: totalComments,
          approved: approvedComments,
          pending: pendingComments,
          recent: recentComments
        }
      }
    });

  } catch (error) {
    console.error('Error fetching host comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

module.exports = {
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
};
