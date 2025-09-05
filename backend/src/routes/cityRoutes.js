const express = require('express');
const router = express.Router();
const { City, Experience, Booking, Country, HostCategory } = require('../models');
const { Op, Sequelize } = require('sequelize');

// GET /api/cities - Get cities with order statistics
router.get('/', async (req, res) => {
  try {
    const { featured = false, limit = 8 } = req.query;

    // Simple approach: get all cities first, then calculate stats and filter
    const cities = await City.findAll({
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });

    // Calculate stats for each city
    const citiesWithStats = await Promise.all(
      cities.map(async (city) => {
        // Count experiences
        const totalExperiences = await Experience.count({
          where: { cityId: city.id }
        });

        // Count bookings (orders) through experiences
        const experienceIds = await Experience.findAll({
          where: { cityId: city.id },
          attributes: ['id'],
          raw: true
        });

        const totalOrders = experienceIds.length > 0 ? await Booking.count({
          where: { 
            experienceId: { 
              [Op.in]: experienceIds.map(exp => exp.id) 
            }
          }
        }) : 0;

        // Calculate average price
        const avgPriceResult = await Experience.findOne({
          where: { cityId: city.id },
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('package_price')), 'avgPrice']
          ],
          raw: true
        });

        const averagePrice = avgPriceResult?.avgPrice || 0;

        // Get categories from experiences in this city (simplified approach)
        const experiencesWithCategories = await Experience.findAll({
          where: { cityId: city.id },
          include: [{
            model: HostCategory,
            as: 'category',
            attributes: ['name']
          }],
          attributes: ['id']
        });

        // Extract unique category names
        const categoryNames = experiencesWithCategories
          .map(exp => exp.category?.name)
          .filter(Boolean);
        
        const uniqueCategories = [...new Set(categoryNames)];
        
        // Use only real categories from database - no fallback static data
        const popularCategories = uniqueCategories.slice(0, 3);

        const cityData = city.toJSON();
        
        // Use imageUrl from database, fallback to placeholder if not set
        let imageFile = cityData.imageUrl || 'placeholder.jpg';
        
        return {
          id: cityData.id,
          name: cityData.name,
          country: city.country?.name || 'Unknown',
          description: cityData.description,
          totalExperiences: totalExperiences,
          totalOrders: totalOrders,
          averagePrice: parseFloat(averagePrice) || 0,
          popularCategories: popularCategories, // Real data from database with fallback
          image: imageFile  // Only filename, let frontend handle the full path
        };
      })
    );

    // Filter to only include cities with experiences
    const citiesWithExperiences = citiesWithStats.filter(city => city.totalExperiences > 0);

    // Sort by totalOrders if featured, otherwise by totalExperiences
    if (featured === 'true') {
      citiesWithExperiences.sort((a, b) => b.totalOrders - a.totalOrders);
    } else {
      citiesWithExperiences.sort((a, b) => b.totalExperiences - a.totalExperiences);
    }

    // Apply limit to the filtered results
    const limitedCities = citiesWithExperiences.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedCities,
      pagination: {
        total: limitedCities.length,
        hasMore: citiesWithExperiences.length > parseInt(limit)
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message
    });
  }
});

// GET /api/cities/:id - Get single city details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id, {
      include: [{
        model: Country,
        as: 'country',
        attributes: ['name']
      }]
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Calculate stats
    const totalExperiences = await Experience.count({
      where: { cityId: city.id }
    });

    const experienceIds = await Experience.findAll({
      where: { cityId: city.id },
      attributes: ['id'],
      raw: true
    });

    const totalOrders = experienceIds.length > 0 ? await Booking.count({
      where: { 
        experienceId: { 
          [Op.in]: experienceIds.map(exp => exp.id) 
        }
      }
    }) : 0;

    const avgPriceResult = await Experience.findOne({
      where: { cityId: city.id },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('package_price')), 'avgPrice']
      ],
      raw: true
    });

    const averagePrice = avgPriceResult?.avgPrice || 0;

    // Get categories from experiences in this city (simplified approach)
    const experiencesWithCategories = await Experience.findAll({
      where: { cityId: city.id },
      include: [{
        model: HostCategory,
        as: 'category',
        attributes: ['name']
      }],
      attributes: ['id']
    });

    // Extract unique category names
    const categoryNames = experiencesWithCategories
      .map(exp => exp.category?.name)
      .filter(Boolean);
    
    const uniqueCategories = [...new Set(categoryNames)];
    
    // Use only real categories from database - no fallback static data
    const popularCategories = uniqueCategories.slice(0, 3);

    const cityData = city.toJSON();

    const result = {
      id: cityData.id,
      name: cityData.name,
      country: cityData.country?.name || 'Unknown',
      description: cityData.description,
      totalExperiences: totalExperiences,
      totalOrders: totalOrders,
      averagePrice: parseFloat(averagePrice) || 0,
      popularCategories: popularCategories.filter(Boolean),
      image: cityData.imageUrl || 'placeholder.jpg'  // Only filename, let frontend handle the full path
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city',
      error: error.message
    });
  }
});

module.exports = router;
