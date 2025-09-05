const express = require('express');
const router = express.Router();
const { Review, User, Experience } = require('../models');

/**
 * @route GET /api/v1/reviews
 * @desc Get reviews with optional filtering
 * @query {string} hostId - Filter reviews by host (reviewee)
 * @query {string} experienceId - Filter reviews by experience
 * @query {string} type - Filter by review type (experience, host, traveller)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 */
router.get('/', async (req, res) => {
  try {
    const { 
      hostId, 
      experienceId, 
      type = 'experience',
      page = 1, 
      limit = 10 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {};

    if (hostId) {
      whereClause.revieweeId = hostId;
    }

    if (experienceId) {
      whereClause.experience_id = experienceId;
    }

    // Get reviews with related data
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'avatar_url'],
        },
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'slug'],
          include: [{
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatar_url'],
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Transform data for frontend
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      communicationRating: review.communicationRating,
      valueRating: review.valueRating,
      experienceRating: review.experienceRating,
      response: review.response,
      respondedAt: review.respondedAt,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt || review.created_at,
      updatedAt: review.updatedAt || review.updated_at,
      // Reviewer info (traveler who wrote the review)
      travelerName: review.reviewer ? review.reviewer.name : 'Anonymous',
      travelerAvatar: review.reviewer?.avatar_url || 'default.jpg',  // Only filename
      // Experience info
      experienceTitle: review.experience?.title || null,
      experienceSlug: review.experience?.slug || null,
      // Host info (get from experience->host)
      hostName: review.experience?.host ? review.experience.host.name : 'Unknown Host',
      hostAvatar: review.experience?.host?.avatar_url || 'default.jpg',  // Only filename
      // Formatted date
      date: (review.createdAt || review.created_at) ? (review.createdAt || review.created_at).toISOString().split('T')[0] : null
    }));

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: transformedReviews,
      pagination: {
        total: count,
        pages: totalPages,
        currentPage: parseInt(page),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

/**
 * @route GET /api/v1/reviews/:id
 * @desc Get single review by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
        },
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'slug'],
          include: [{
            model: User,
            as: 'host',
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
          }]
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Transform data
    const transformedReview = {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      communicationRating: review.communicationRating,
      valueRating: review.valueRating,
      experienceRating: review.experienceRating,
      response: review.response,
      respondedAt: review.respondedAt,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      // Reviewer info
      travelerName: review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : 'Anonymous',
      travelerAvatar: review.reviewer?.avatar || 'default.jpg',  // Only filename
      // Experience info
      experienceTitle: review.experience?.title || null,
      experienceSlug: review.experience?.slug || null,
      // Host info
      hostName: review.experience?.host ? `${review.experience.host.firstName} ${review.experience.host.lastName}` : 'Unknown Host',
      hostAvatar: review.experience?.host?.avatar || 'default.jpg',  // Only filename
      // Formatted date
      date: review.createdAt.toISOString().split('T')[0]
    };

    res.json({
      success: true,
      data: transformedReview
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
});

module.exports = router;
