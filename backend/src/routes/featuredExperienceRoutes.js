const express = require('express');
const router = express.Router();
const { FeaturedExperience, Experience, User, HostCategory, ExperienceType } = require('../models');

// GET /api/featured-experiences - Get featured experiences selected by admin
router.get('/', async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const featuredExperiences = await FeaturedExperience.findAll({
      where: { isActive: true },
      include: [
        {
          model: Experience,
          as: 'experience',
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'uuid', 'name', 'avatarUrl']
            },
            {
              model: HostCategory,
              as: 'category',
              attributes: ['id', 'name', 'icon']
            },
            {
              model: ExperienceType,
              as: 'type',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['displayOrder', 'ASC']],
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const transformedExperiences = featuredExperiences.map(featured => {
      const experience = featured.experience;
      return {
        id: featured.id,
        experienceId: experience.uuid,
        title: featured.title || experience.title,
        description: featured.description || experience.description,
        badge: featured.badge || 'Featured',
        imageUrl: featured.featuredImageUrl || (Array.isArray(experience.images) ? experience.images[0] : experience.images) || 'default-experience.jpg',
        price: experience.pricePerPackage || 0,
        originalPrice: experience.originalPrice || null,
        duration: experience.duration,
        location: experience.meetingPoint,
        rating: 4.8, // Default rating
        totalReviews: 0, // Default
        host: {
          id: experience.host?.uuid,
          name: experience.host?.name,
          avatar: experience.host?.avatarUrl
        },
        category: {
          id: experience.category?.id,
          name: experience.category?.name,
          icon: experience.category?.icon
        },
        type: {
          id: experience.type?.id,
          name: experience.type?.name
        },
        displayOrder: featured.displayOrder
      };
    });

    res.json({
      success: true,
      data: transformedExperiences,
      count: transformedExperiences.length
    });

  } catch (error) {
    console.error('Error fetching featured experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured experiences',
      error: error.message
    });
  }
});

// POST /api/featured-experiences - Add experience to featured list
router.post('/', async (req, res) => {
  try {
    const { experienceId, title, description, badge, displayOrder, featuredImageUrl } = req.body;

    // Check if experience exists
    const experience = await Experience.findByPk(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Check if already featured
    const existingFeatured = await FeaturedExperience.findOne({
      where: { experienceId, isActive: true }
    });

    if (existingFeatured) {
      return res.status(400).json({
        success: false,
        message: 'Experience is already featured'
      });
    }

    const featuredExperience = await FeaturedExperience.create({
      experienceId,
      title,
      description,
      badge: badge || 'Featured',
      displayOrder: displayOrder || 0,
      featuredImageUrl,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: featuredExperience,
      message: 'Experience added to featured list'
    });

  } catch (error) {
    console.error('Error adding featured experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add featured experience',
      error: error.message
    });
  }
});

// PUT /api/featured-experiences/:id - Update featured experience
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, badge, displayOrder, featuredImageUrl, isActive } = req.body;

    const featuredExperience = await FeaturedExperience.findByPk(id);
    if (!featuredExperience) {
      return res.status(404).json({
        success: false,
        message: 'Featured experience not found'
      });
    }

    await featuredExperience.update({
      title,
      description,
      badge,
      displayOrder,
      featuredImageUrl,
      isActive
    });

    res.json({
      success: true,
      data: featuredExperience,
      message: 'Featured experience updated'
    });

  } catch (error) {
    console.error('Error updating featured experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured experience',
      error: error.message
    });
  }
});

// DELETE /api/featured-experiences/:id - Remove from featured list
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const featuredExperience = await FeaturedExperience.findByPk(id);
    if (!featuredExperience) {
      return res.status(404).json({
        success: false,
        message: 'Featured experience not found'
      });
    }

    await featuredExperience.update({ isActive: false });

    res.json({
      success: true,
      message: 'Experience removed from featured list'
    });

  } catch (error) {
    console.error('Error removing featured experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove featured experience',
      error: error.message
    });
  }
});

// GET /api/featured-experiences/available - Get available experiences to feature
router.get('/available', async (req, res) => {
  try {
    const { limit = 20, search = '' } = req.query;

    // Get IDs of already featured experiences
    const featuredIds = await FeaturedExperience.findAll({
      where: { isActive: true },
      attributes: ['experienceId']
    }).then(results => results.map(r => r.experienceId));

    const whereClause = {
      id: { [require('sequelize').Op.notIn]: featuredIds }
    };

    if (search) {
      whereClause.title = {
        [require('sequelize').Op.iLike]: `%${search}%`
      };
    }

    const experiences = await Experience.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'uuid', 'name']
        },
        {
          model: HostCategory,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: experiences
    });

  } catch (error) {
    console.error('Error fetching available experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available experiences',
      error: error.message
    });
  }
});

module.exports = router;