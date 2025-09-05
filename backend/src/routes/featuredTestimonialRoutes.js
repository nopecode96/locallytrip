const express = require('express');
const router = express.Router();
const { FeaturedTestimonial, User, Experience } = require('../models');

// GET /api/featured-testimonials - Get featured testimonials selected by admin
router.get('/', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featuredTestimonials = await FeaturedTestimonial.findAll({
      where: { 
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email', 'avatar_url'],
          required: false
        },
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'categoryId'],
          required: false
        }
      ],
      order: [['display_order', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const transformedTestimonials = featuredTestimonials.map(testimonial => {
      return {
        id: String(testimonial.id),
        title: testimonial.title || 'Amazing Experience!',
        content: testimonial.testimonialText, // Fixed: use testimonialText from model
        rating: 5, // Default rating since not in database model
        reviewer: {
          id: String(testimonial.reviewerId),
          name: testimonial.reviewerName,
          location: testimonial.reviewerLocation || 'Verified Traveler',
          avatar: testimonial.reviewer?.dataValues?.avatar_url || 'default-avatar.jpg'  // Access through dataValues
        },
        experience: {
          id: testimonial.experienceId ? String(testimonial.experienceId) : 'unknown',
          title: testimonial.experience?.title || 'LocallyTrip Experience',
          categoryId: testimonial.experience?.categoryId ? String(testimonial.experience?.categoryId) : null
        },
        displayOrder: testimonial.displayOrder,
        createdAt: testimonial.createdAt
      };
    });

    res.json({
      success: true,
      data: transformedTestimonials,
      count: transformedTestimonials.length,
      pagination: {
        total: transformedTestimonials.length,
        hasMore: false
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured testimonials',
      error: error.message
    });
  }
});

// GET /api/featured-testimonials/:id - Get single featured testimonial
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const featuredTestimonial = await FeaturedTestimonial.findByPk(id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email', 'avatar_url'],
          required: false
        },
        {
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'categoryId'],
          required: false
        }
      ]
    });

    if (!featuredTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Featured testimonial not found'
      });
    }

    const transformedTestimonial = {
      id: String(featuredTestimonial.id),
      title: featuredTestimonial.title || 'Amazing Experience!',
      content: featuredTestimonial.testimonialText, // Fixed: use testimonialText from model
      rating: 5, // Default rating since not in database model
      reviewer: {
        id: String(featuredTestimonial.reviewerId),
        name: featuredTestimonial.reviewerName,
        location: featuredTestimonial.reviewerLocation || 'Verified Traveler',
        avatar: featuredTestimonial.reviewer?.dataValues?.avatar_url || 'default-avatar.jpg'  // Access through dataValues
      },
      experience: {
        id: featuredTestimonial.experienceId ? String(featuredTestimonial.experienceId) : 'unknown',
        title: featuredTestimonial.experience?.title || 'LocallyTrip Experience',
        categoryId: featuredTestimonial.experience?.categoryId ? String(featuredTestimonial.experience?.categoryId) : null
      },
      displayOrder: featuredTestimonial.displayOrder,
      createdAt: featuredTestimonial.createdAt
    };

    res.json({
      success: true,
      data: transformedTestimonial
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured testimonial',
      error: error.message
    });
  }
});

module.exports = router;
