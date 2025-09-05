const express = require('express');
const router = express.Router();
const { ExperienceItinerary, Experience } = require('../models');
const { Op } = require('sequelize');

// GET /api/itinerary - Get summary of all itineraries
router.get('/', async (req, res) => {
  try {
    // Get all experiences with their itinerary count
    const experiences = await Experience.findAll({
      attributes: ['id', 'title', 'slug'],
      include: [{
        model: ExperienceItinerary,
        as: 'itinerary',
        attributes: ['id', 'duration'],
        where: { isActive: true },
        required: true
      }],
      where: { isActive: true }
    });

    const formattedSummary = experiences.map(experience => {
      const totalMinutes = experience.itinerary.reduce((sum, item) => sum + (item.duration || 0), 0);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      return {
        experienceId: experience.id,
        experienceTitle: experience.title,
        experienceSlug: experience.slug,
        stepCount: experience.itinerary.length,
        totalDuration: totalMinutes,
        formattedDuration: `${hours}h ${minutes}m`
      };
    });

    res.json({
      success: true,
      data: formattedSummary,
      message: 'Itinerary summary retrieved successfully'
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/itinerary/experience/:experienceId - Get itinerary for specific experience
router.get('/experience/:experienceId', async (req, res) => {
  try {
    const { experienceId } = req.params;

    const itinerary = await ExperienceItinerary.findAll({
      where: {
        experienceId: experienceId,
        isActive: true
      },
      attributes: [
        'id',
        'title', 
        'description',
        'duration',
        'location',
        'latitude',
        'longitude',
        'sortOrder'
      ],
      order: [['sortOrder', 'ASC']]
    });

    // Calculate total duration
    const totalDuration = itinerary.reduce((sum, item) => sum + (item.duration || 0), 0);
    const totalHours = Math.floor(totalDuration / 60);
    const totalMinutes = totalDuration % 60;

    res.json({
      success: true,
      data: {
        itinerary: itinerary,
        summary: {
          totalSteps: itinerary.length,
          totalDuration: totalDuration,
          formattedDuration: `${totalHours}h ${totalMinutes}m`
        }
      },
      message: 'Itinerary retrieved successfully'
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/itinerary/:id - Get specific itinerary item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const itineraryItem = await ExperienceItinerary.findOne({
      where: {
        id: id,
        isActive: true
      },
      include: [{
        model: Experience,
        as: 'experience',
        attributes: ['id', 'title', 'slug']
      }]
    });

    if (!itineraryItem) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary item not found'
      });
    }

    res.json({
      success: true,
      data: itineraryItem,
      message: 'Itinerary item retrieved successfully'
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
