const express = require('express');
const router = express.Router();
const { FeaturedCity, City, Country } = require('../models');

// GET /api/featured-cities - Get featured cities selected by admin
router.get('/', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featuredCities = await FeaturedCity.findAll({
      where: { isActive: true },
      include: [
        {
          model: City,
          as: 'city',
          include: [
            {
              model: Country,
              as: 'country',
              attributes: ['id', 'name', 'code']
            }
          ]
        }
      ],
      order: [['displayOrder', 'ASC']],
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const transformedCities = featuredCities.map(featured => {
      const city = featured.city;
      return {
        id: featured.id,
        cityId: city.id,
        name: featured.title || city.name,
        description: featured.description || city.description,
        badge: featured.badge || 'Popular Destination',
        imageUrl: featured.featuredImageUrl || city.imageUrl || 'default-city.jpg',
        country: {
          id: city.country?.id,
          name: city.country?.name,
          code: city.country?.code
        },
        experienceCount: 0, // Will be calculated later
        rating: 4.7, // Default rating
        displayOrder: featured.displayOrder
      };
    });

    res.json({
      success: true,
      data: transformedCities,
      count: transformedCities.length
    });

  } catch (error) {
    console.error('Error fetching featured cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured cities',
      error: error.message
    });
  }
});

// POST /api/featured-cities - Add city to featured list
router.post('/', async (req, res) => {
  try {
    const { cityId, title, description, badge, displayOrder, featuredImageUrl } = req.body;

    // Check if city exists
    const city = await City.findByPk(cityId);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Check if already featured
    const existingFeatured = await FeaturedCity.findOne({
      where: { cityId, isActive: true }
    });

    if (existingFeatured) {
      return res.status(400).json({
        success: false,
        message: 'City is already featured'
      });
    }

    const featuredCity = await FeaturedCity.create({
      cityId,
      title,
      description,
      badge: badge || 'Popular Destination',
      displayOrder: displayOrder || 0,
      featuredImageUrl,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: featuredCity,
      message: 'City added to featured list'
    });

  } catch (error) {
    console.error('Error adding featured city:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add featured city',
      error: error.message
    });
  }
});

// PUT /api/featured-cities/:id - Update featured city
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, badge, displayOrder, featuredImageUrl, isActive } = req.body;

    const featuredCity = await FeaturedCity.findByPk(id);
    if (!featuredCity) {
      return res.status(404).json({
        success: false,
        message: 'Featured city not found'
      });
    }

    await featuredCity.update({
      title,
      description,
      badge,
      displayOrder,
      featuredImageUrl,
      isActive
    });

    res.json({
      success: true,
      data: featuredCity,
      message: 'Featured city updated'
    });

  } catch (error) {
    console.error('Error updating featured city:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured city',
      error: error.message
    });
  }
});

// DELETE /api/featured-cities/:id - Remove from featured list
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const featuredCity = await FeaturedCity.findByPk(id);
    if (!featuredCity) {
      return res.status(404).json({
        success: false,
        message: 'Featured city not found'
      });
    }

    await featuredCity.update({ isActive: false });

    res.json({
      success: true,
      message: 'City removed from featured list'
    });

  } catch (error) {
    console.error('Error removing featured city:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove featured city',
      error: error.message
    });
  }
});

// GET /api/featured-cities/available - Get available cities to feature
router.get('/available', async (req, res) => {
  try {
    const { limit = 20, search = '' } = req.query;

    // Get IDs of already featured cities
    const featuredIds = await FeaturedCity.findAll({
      where: { isActive: true },
      attributes: ['cityId']
    }).then(results => results.map(r => r.cityId));

    const whereClause = {
      id: { [require('sequelize').Op.notIn]: featuredIds }
    };

    if (search) {
      whereClause.name = {
        [require('sequelize').Op.iLike]: `%${search}%`
      };
    }

    const cities = await City.findAll({
      where: whereClause,
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name', 'code']
        }
      ],
      limit: parseInt(limit),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: cities
    });

  } catch (error) {
    console.error('Error fetching available cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available cities',
      error: error.message
    });
  }
});

module.exports = router;