const { Experience, User, City, HostCategory, ExperienceItinerary } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const tripController = {
  // Get all trips with filtering and pagination
  getAllTrips: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        city,
        minPrice,
        maxPrice,
        difficulty,
        featured,
        search
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where clause
      const where = { isActive: true };
      
      if (category) where.category = category;
      if (city) where['location.city'] = city;
      if (difficulty) where.difficulty = difficulty;
      if (featured) where.featured = featured === 'true';
      
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = minPrice;
        if (maxPrice) where.price[Op.lte] = maxPrice;
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { tags: { [Op.contains]: [search] } }
        ];
      }

      const trips = await Trip.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        trips: trips.rows,
        pagination: {
          total: trips.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(trips.count / limit)
        }
      });
    } catch (error) {
      
      res.status(500).json({
        error: 'Failed to fetch trips',
        message: 'An error occurred while fetching trips'
      });
    }
  },

  // Get single trip by ID
  getTripById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const trip = await Trip.findOne({
        where: { id, isActive: true },
        include: [{
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profileImage', 'email']
        }]
      });

      if (!trip) {
        return res.status(404).json({
          error: 'Trip not found'
        });
      }

      res.json({ trip });
    } catch (error) {
      
      res.status(500).json({
        error: 'Failed to fetch trip',
        message: 'An error occurred while fetching trip'
      });
    }
  },

  // Create new trip (host only)
  createTrip: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const tripData = {
        ...req.body,
        hostId: req.userId
      };

      const trip = await Trip.create(tripData);
      
      const tripWithHost = await Trip.findByPk(trip.id, {
        include: [{
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }]
      });

      res.status(201).json({
        message: 'Trip created successfully',
        trip: tripWithHost
      });
    } catch (error) {
      
      res.status(500).json({
        error: 'Failed to create trip',
        message: 'An error occurred while creating trip'
      });
    }
  },

  // Update trip (host only)
  updateTrip: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      
      const trip = await Trip.findOne({
        where: { id, hostId: req.userId }
      });

      if (!trip) {
        return res.status(404).json({
          error: 'Trip not found or you are not authorized to update this trip'
        });
      }

      await trip.update(req.body);
      
      const updatedTrip = await Trip.findByPk(trip.id, {
        include: [{
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }]
      });

      res.json({
        message: 'Trip updated successfully',
        trip: updatedTrip
      });
    } catch (error) {
      
      res.status(500).json({
        error: 'Failed to update trip',
        message: 'An error occurred while updating trip'
      });
    }
  },

  // Delete trip (host only)
  deleteTrip: async (req, res) => {
    try {
      const { id } = req.params;
      
      const trip = await Trip.findOne({
        where: { id, hostId: req.userId }
      });

      if (!trip) {
        return res.status(404).json({
          error: 'Trip not found or you are not authorized to delete this trip'
        });
      }

      await trip.update({ isActive: false });

      res.json({
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      
      res.status(500).json({
        error: 'Failed to delete trip',
        message: 'An error occurred while deleting trip'
      });
    }
  },

  // Get trips by host
  getTripsByHost: async (req, res) => {
    try {
      const { hostId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const trips = await Trip.findAndCountAll({
        where: { hostId, isActive: true },
        include: [{
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        trips: trips.rows,
        pagination: {
          total: trips.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(trips.count / limit)
        }
      });
    } catch (error) {
      
      res.status(500).json({
        error: 'Failed to fetch host trips',
        message: 'An error occurred while fetching host trips'
      });
    }
  }
};

module.exports = tripController;
