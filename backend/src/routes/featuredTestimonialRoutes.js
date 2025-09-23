const express = require('express');
const router = express.Router();
const { FeaturedTestimonial } = require('../models');

// GET /api/featured-testimonials - Get featured testimonials selected by admin
router.get('/', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featuredTestimonials = await FeaturedTestimonial.findAll({
      where: { 
        isActive: true
      },
      order: [['display_order', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const transformedTestimonials = featuredTestimonials.map(testimonial => ({
      id: String(testimonial.id),
      title: testimonial.title || 'Amazing Experience!',
      content: testimonial.testimonialText,
      rating: 5, // Default rating for admin testimonials
      reviewer: {
        name: testimonial.reviewerName,
        location: testimonial.reviewerLocation || 'Verified Traveler',
        avatar: testimonial.featuredImageUrl || '/images/default-avatar.jpg'
      },
      displayOrder: testimonial.displayOrder,
      badge: testimonial.badge,
      createdAt: testimonial.createdAt
    }));

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

    const featuredTestimonial = await FeaturedTestimonial.findByPk(id);

    if (!featuredTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Featured testimonial not found'
      });
    }

    const transformedTestimonial = {
      id: String(featuredTestimonial.id),
      title: featuredTestimonial.title || 'Amazing Experience!',
      content: featuredTestimonial.testimonialText,
      rating: 5, // Default rating for admin testimonials
      reviewer: {
        name: featuredTestimonial.reviewerName,
        location: featuredTestimonial.reviewerLocation || 'Verified Traveler',
        avatar: featuredTestimonial.featuredImageUrl || '/images/default-avatar.jpg'
      },
      displayOrder: featuredTestimonial.displayOrder,
      badge: featuredTestimonial.badge,
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

// POST /api/featured-testimonials - Create new featured testimonial
router.post('/', async (req, res) => {
  try {
    const {
      title,
      testimonialText,
      reviewerName,
      reviewerLocation,
      badge,
      displayOrder,
      isActive = true,
      featuredImageUrl
    } = req.body;

    const newTestimonial = await FeaturedTestimonial.create({
      title,
      testimonialText,
      reviewerName,
      reviewerLocation,
      badge,
      displayOrder: displayOrder || 1,
      isActive,
      featuredImageUrl
    });

    res.status(201).json({
      success: true,
      data: newTestimonial,
      message: 'Featured testimonial created successfully'
    });

  } catch (error) {
    console.error('Error creating featured testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create featured testimonial',
      error: error.message
    });
  }
});

// PUT /api/featured-testimonials/:id - Update featured testimonial
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedRowsCount] = await FeaturedTestimonial.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Featured testimonial not found'
      });
    }

    const updatedTestimonial = await FeaturedTestimonial.findByPk(id);

    res.json({
      success: true,
      data: updatedTestimonial,
      message: 'Featured testimonial updated successfully'
    });

  } catch (error) {
    console.error('Error updating featured testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured testimonial',
      error: error.message
    });
  }
});

// DELETE /api/featured-testimonials/:id - Delete featured testimonial
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRowsCount = await FeaturedTestimonial.destroy({
      where: { id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Featured testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Featured testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting featured testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete featured testimonial',
      error: error.message
    });
  }
});

module.exports = router;
