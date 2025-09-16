const express = require('express');
const router = express.Router();
const { ExperienceItinerary, Experience } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// GET /api/itinerary - Get summary of all itineraries
router.get('/', async (req, res) => {
  try {
    // Get all experiences with their itinerary count
    const experiences = await Experience.findAll({
      attributes: ['id', 'title', 'slug'],
      include: [{
        model: ExperienceItinerary,
        as: 'itinerary',
        attributes: ['id', 'durationMinutes']
      }],
      where: { isActive: true }
    });

    const formattedSummary = experiences.map(experience => {
      const totalMinutes = experience.itinerary.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
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
        experienceId: experienceId
      },
      order: [['stepNumber', 'ASC']]
    });

    // Calculate total duration
    const totalDuration = itinerary.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
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
        id: id
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

// POST /api/itinerary - Create itinerary for experience
router.post('/', authenticateToken, requireRole(['host']), async (req, res) => {
  try {
    const { experienceId, itinerary } = req.body;
    
    // Validate input
    if (!experienceId || !itinerary || !Array.isArray(itinerary)) {
      return res.status(400).json({
        success: false,
        message: 'Experience ID and itinerary array are required'
      });
    }
    
    // Check if experience exists and belongs to the host
    const experience = await Experience.findOne({
      where: { 
        id: experienceId,
        hostId: req.user.id 
      }
    });
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found or you are not authorized to modify it'
      });
    }
    
    // Delete existing itinerary items for this experience
    await ExperienceItinerary.destroy({
      where: { experienceId: experienceId }
    });
    
    // Create new itinerary items (sesuai dengan struktur tabel experience_itineraries)
    const itineraryItems = itinerary.map((item, index) => ({
      experienceId: experienceId,
      stepNumber: index + 1,
      title: item.title,
      description: item.description,
      location: item.location, // Maps to location_name field
      durationMinutes: item.durationMinutes || item.duration
    }));
    
    const createdItems = await ExperienceItinerary.bulkCreate(itineraryItems);
    
    res.status(201).json({
      success: true,
      data: createdItems,
      message: 'Itinerary created successfully'
    });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/itinerary/:experienceId - Update itinerary for experience
router.put('/:experienceId', authenticateToken, requireRole(['host']), async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { itinerary } = req.body;
    
    // Validate input
    if (!itinerary || !Array.isArray(itinerary)) {
      return res.status(400).json({
        success: false,
        message: 'Itinerary array is required'
      });
    }
    
    // Check if experience exists and belongs to the host
    const experience = await Experience.findOne({
      where: { 
        id: experienceId,
        hostId: req.user.id 
      }
    });
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found or you are not authorized to modify it'
      });
    }
    
    // Delete existing itinerary items for this experience
    await ExperienceItinerary.destroy({
      where: { experienceId: experienceId }
    });
    
    // Create new itinerary items (sesuai dengan struktur tabel experience_itineraries)
    const itineraryItems = itinerary.map((item, index) => ({
      experienceId: experienceId,
      stepNumber: index + 1,
      title: item.title,
      description: item.description,
      location: item.location, // Maps to location_name field
      durationMinutes: item.durationMinutes || item.duration
    }));
    
    const createdItems = await ExperienceItinerary.bulkCreate(itineraryItems);
    
    res.json({
      success: true,
      data: createdItems,
      message: 'Itinerary updated successfully'
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
