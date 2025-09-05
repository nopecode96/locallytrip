const express = require('express');
const router = express.Router();
const { FeaturedHost, User } = require('../models');

// GET /api/featured-hosts - Get featured hosts selected by admin
router.get('/', async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const featuredHosts = await FeaturedHost.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'host',
          attributes: [
            'id', 'uuid', 'name', 'email', 'avatarUrl', 
            'bio', 'cityId', 'isVerified', 'createdAt'
          ]
        }
      ],
      order: [['displayOrder', 'ASC']],
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const transformedHosts = featuredHosts.map(featured => {
      const host = featured.host;
      return {
        id: featured.id,
        hostId: host.uuid, // Use UUID instead of integer ID for proper slug generation
        name: host.name,
        title: featured.title || `${host.name} - Local Expert`,
        description: featured.description || host.bio || 'Passionate local host ready to share amazing experiences',
        badge: featured.badge || 'Expert Host',
        profilePicture: host.avatarUrl || 'default-avatar.jpg',  // Only filename
        location: 'Southeast Asia', // Will be updated with city data later
        rating: 4.8, // Default rating since we removed rating fields
        totalReviews: 0, // Default since we removed review count
        isVerified: host.isVerified || false,
        joinedDate: host.createdAt,
        displayOrder: featured.displayOrder
      };
    });

    res.json({
      success: true,
      data: transformedHosts,
      count: transformedHosts.length
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured hosts',
      error: error.message
    });
  }
});

// GET /api/featured-hosts/:id - Get single featured host
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const featuredHost = await FeaturedHost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'host',
          attributes: [
            'id', 'name', 'email', 'avatarUrl', 
            'bio', 'cityId', 'isVerified', 'createdAt'
          ]
        }
      ]
    });

    if (!featuredHost) {
      return res.status(404).json({
        success: false,
        message: 'Featured host not found'
      });
    }

    const host = featuredHost.host;
    const transformedHost = {
      id: featuredHost.id,
      hostId: host.id,
      name: host.name,
      title: featuredHost.title || `${host.name} - Local Expert`,
      description: featuredHost.description || host.bio || 'Passionate local host ready to share amazing experiences',
      badge: featuredHost.badge || 'Expert Host',
      profilePicture: host.avatarUrl || 'default-avatar.jpg',  // Only filename
      location: 'Southeast Asia', // Will be updated with city data later
      rating: 4.8, // Default rating
      totalReviews: 0, // Default reviews
      isVerified: host.isVerified || false,
      joinedDate: host.createdAt,
      displayOrder: featuredHost.displayOrder
    };

    res.json({
      success: true,
      data: transformedHost
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured host',
      error: error.message
    });
  }
});

module.exports = router;
