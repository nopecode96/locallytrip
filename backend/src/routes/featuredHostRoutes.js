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

// GET /api/featured-hosts/available-hosts - Get users that can become featured hosts
router.get('/available-hosts', async (req, res) => {
  try {
    const hosts = await User.findAll({
      where: {
        role: 'host',
        isActive: true
      },
      attributes: ['id', 'name', 'email', 'avatarUrl', 'bio', 'cityId', 'isVerified'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: hosts
    });

  } catch (error) {
    console.error('Error fetching available hosts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available hosts',
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

// POST /api/featured-hosts - Create new featured host
router.post('/', async (req, res) => {
  try {
    const {
      hostId,
      title,
      description,
      badge,
      displayOrder,
      isActive = true
    } = req.body;

    // Verify that the host exists
    const host = await User.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    const newFeaturedHost = await FeaturedHost.create({
      hostId,
      title,
      description,
      badge,
      displayOrder: displayOrder || 1,
      isActive
    });

    res.status(201).json({
      success: true,
      data: newFeaturedHost,
      message: 'Featured host created successfully'
    });

  } catch (error) {
    console.error('Error creating featured host:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create featured host',
      error: error.message
    });
  }
});

// PUT /api/featured-hosts/:id - Update featured host
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedRowsCount] = await FeaturedHost.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Featured host not found'
      });
    }

    const updatedFeaturedHost = await FeaturedHost.findByPk(id, {
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'bio']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedFeaturedHost,
      message: 'Featured host updated successfully'
    });

  } catch (error) {
    console.error('Error updating featured host:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured host',
      error: error.message
    });
  }
});

// GET /api/featured-hosts/available-hosts - Get users that can become featured hosts
router.get('/available-hosts', async (req, res) => {
  try {
    const hosts = await User.findAll({
      where: {
        role: 'host',
        isActive: true
      },
      attributes: ['id', 'name', 'email', 'avatarUrl', 'bio', 'cityId', 'isVerified'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: hosts
    });

  } catch (error) {
    console.error('Error fetching available hosts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available hosts',
      error: error.message
    });
  }
});

// DELETE /api/featured-hosts/:id - Delete featured host
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRowsCount = await FeaturedHost.destroy({
      where: { id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Featured host not found'
      });
    }

    res.json({
      success: true,
      message: 'Featured host deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting featured host:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete featured host',
      error: error.message
    });
  }
});

module.exports = router;
