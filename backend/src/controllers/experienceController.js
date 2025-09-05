const { Experience, User, City, HostCategory, ExperienceItinerary, Review, Booking } = require('../models');
const { validationResult } = require('express-validator');
const { Op, literal } = require('sequelize');

const experienceController = {
  // Get all experiences with filtering and pagination
  getAllExperiences: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        categories, // Support multiple categories
        city,
        hostId,
        minPrice,
        maxPrice,
        currency, // Add currency filter
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const where = { isActive: true };

      // Add filters
      if (category) {
        where.categoryId = category;
      }
      if (categories) {
        // Support multiple categories filter
        const categoryArray = Array.isArray(categories) ? categories : [categories];
        where.categoryId = { [Op.in]: categoryArray };
      }
      if (city) {
        where.cityId = city;
      }
      if (hostId) {
        where.hostId = hostId;
      }
      if (minPrice || maxPrice) {
        where.pricePerPackage = {}; // Fix: use correct model field
        if (minPrice) where.pricePerPackage[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.pricePerPackage[Op.lte] = parseFloat(maxPrice);
      }
      
      // Add currency filter
      if (currency) {
        where.currency = currency;
      }

      const experiences = await Experience.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatarUrl']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name']
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });

      // Transform data to ensure proper number types
      const transformedExperiences = experiences.rows.map(exp => {
        const experience = exp.toJSON();
        
        // Ensure rating is a number or null
        if (experience.rating !== null && experience.rating !== undefined) {
          experience.rating = parseFloat(experience.rating);
        } else {
          experience.rating = null;
        }
        
        // Ensure host rating is a number or null
        if (experience.host && experience.host.rating !== null && experience.host.rating !== undefined) {
          experience.host.rating = parseFloat(experience.host.rating);
        } else if (experience.host) {
          experience.host.rating = null;
        }
        
        // Use database field bookingCount (updated via booking status changes)
        // No need to override - field is automatically maintained
        
        return experience;
      });

      res.json({
        success: true,
        data: {
          experiences: transformedExperiences,
          pagination: {
            total: experiences.count,
            pages: Math.ceil(experiences.count / parseInt(limit)),
            currentPage: parseInt(page),
            hasNext: parseInt(page) * parseInt(limit) < experiences.count,
            hasPrev: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch experiences',
        error: error.message
      });
    }
  },

  // Get experience by ID or slug
  getExperienceById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if id is numeric (ID) or string (slug)
      const where = /^\d+$/.test(id) 
        ? { id: parseInt(id) } 
        : { slug: id };

      const experience = await Experience.findOne({
        where: { ...where, isActive: true },
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatarUrl', 'bio']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name'],
            include: [{
              model: require('../models').Country,
              as: 'country',
              attributes: ['id', 'name', 'code']
            }]
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon', 'description']
          },
          {
            model: require('../models').ExperienceType,
            as: 'experienceType',
            attributes: ['id', 'name', 'description']
          },
          {
            model: ExperienceItinerary,
            as: 'itinerary',
            attributes: ['id', 'title', 'description', 'durationMinutes', 'location', 'latitude', 'longitude', 'stepNumber'],
            where: { isActive: true },
            required: false
          },
          {
            model: require('../models').Review,
            as: 'reviews',
            attributes: ['id', 'rating', 'title', 'comment', 'is_verified', 'created_at'],
            include: [{
              model: User,
              as: 'reviewer',
              attributes: ['id', 'name', 'avatarUrl']
            }],
            required: false
          }
        ],
        order: [
          [{ model: ExperienceItinerary, as: 'itinerary' }, 'stepNumber', 'ASC']
        ]
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      // Transform experience data - bookingCount field is automatically maintained
      const transformedExperience = experience.toJSON();

      // Increment view count (commented out - field doesn't exist yet)
      // await experience.increment('viewCount');

      res.json({
        success: true,
        data: transformedExperience
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch experience',
        error: error.message
      });
    }
  },

  // Get experience by slug
  getExperienceBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const experience = await Experience.findOne({
        where: { slug: slug, isActive: true },
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatarUrl', 'bio']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name'],
            include: [{
              model: require('../models').Country,
              as: 'country',
              attributes: ['id', 'name', 'code']
            }]
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon', 'description']
          },
          {
            model: ExperienceItinerary,
            as: 'itinerary',
            attributes: ['id', 'title', 'description', 'durationMinutes', 'location', 'latitude', 'longitude', 'stepNumber'],
            where: { isActive: true },
            required: false
          },
          {
            model: require('../models').Review,
            as: 'reviews',
            attributes: ['id', 'rating', 'title', 'comment', 'is_verified', 'created_at'],
            include: [{
              model: User,
              as: 'reviewer',
              attributes: ['id', 'name', 'avatarUrl']
            }],
            required: false
          }
        ],
        order: [
          [{ model: ExperienceItinerary, as: 'itinerary' }, 'stepNumber', 'ASC']
        ]
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      // Increment view count (commented out - field doesn't exist yet)  
      // await experience.increment('viewCount');

      // Transform data to ensure proper number types
      const transformedExperience = experience.toJSON();
      
      // Ensure rating is a number or null
      if (transformedExperience.rating !== null && transformedExperience.rating !== undefined) {
        transformedExperience.rating = parseFloat(transformedExperience.rating);
      } else {
        transformedExperience.rating = null;
      }
      
      // Ensure host rating is a number or null
      if (transformedExperience.host && transformedExperience.host.rating !== null && transformedExperience.host.rating !== undefined) {
        transformedExperience.host.rating = parseFloat(transformedExperience.host.rating);
      } else if (transformedExperience.host) {
        transformedExperience.host.rating = null;
      }

      res.json({
        success: true,
        data: transformedExperience
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch experience',
        error: error.message
      });
    }
  },

  // Create new experience (Host only)
  createExperience: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const hostId = req.user.id;
      
      // Generate slug from title if not provided
      let slug = req.body.slug;
      if (!slug && req.body.title) {
        slug = req.body.title
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        
        // Ensure uniqueness by adding timestamp if needed
        const existingSlug = await Experience.findOne({ where: { slug } });
        if (existingSlug) {
          slug = `${slug}-${Date.now()}`;
        }
      }
      
      const experienceData = {
        ...req.body,
        hostId,
        slug
      };

      const experience = await Experience.create(experienceData);

      const experienceWithDetails = await Experience.findByPk(experience.id, {
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatarUrl']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name']
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Experience created successfully',
        data: experienceWithDetails
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to create experience',
        error: error.message
      });
    }
  },

  // Update experience (Host only)
  updateExperience: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const hostId = req.user.id;

      const experience = await Experience.findOne({
        where: { id, hostId }
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found or you are not authorized to update it'
        });
      }

      await experience.update(req.body);

      const updatedExperience = await Experience.findByPk(experience.id, {
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatarUrl']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name']
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Experience updated successfully',
        data: updatedExperience
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to update experience',
        error: error.message
      });
    }
  },

  // Delete experience (Host only)
  deleteExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const hostId = req.user.id;

      const experience = await Experience.findOne({
        where: { id, hostId }
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found or you are not authorized to delete it'
        });
      }

      // Soft delete
      await experience.update({ isActive: false });

      res.json({
        success: true,
        message: 'Experience deleted successfully'
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete experience',
        error: error.message
      });
    }
  },

  // Get host's experiences
  getHostExperiences: async (req, res) => {
    try {
      const hostId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const where = { hostId };

      if (false) {
        
      }

      const experiences = await Experience.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name']
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          experiences: experiences.rows,
          pagination: {
            total: experiences.count,
            pages: Math.ceil(experiences.count / parseInt(limit)),
            currentPage: parseInt(page)
          }
        }
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch host experiences',
        error: error.message
      });
    }
  },

  // Get featured experiences
  getFeaturedExperiences: async (req, res) => {
    try {
      const { limit = 8 } = req.query;

      const experiences = await Experience.findAll({
        where: { 
          
          isActive: true,
          isFeatured: true
        },
        limit: parseInt(limit),
        order: [['rating', 'DESC'], ['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'avatarUrl']
          },
          {
            model: City,
            as: 'city',
            attributes: ['id', 'name']
          },
          {
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });

      // Transform data to ensure proper number types
      const transformedExperiences = experiences.map(exp => {
        const experience = exp.toJSON();
        
        // Ensure rating is a number or null
        if (experience.rating !== null && experience.rating !== undefined) {
          experience.rating = parseFloat(experience.rating);
        } else {
          experience.rating = null;
        }
        
        // Ensure host rating is a number or null
        if (experience.host && experience.host.rating !== null && experience.host.rating !== undefined) {
          experience.host.rating = parseFloat(experience.host.rating);
        } else if (experience.host) {
          experience.host.rating = null;
        }
        
        return experience;
      });

      res.json({
        success: true,
        data: {
          experiences: transformedExperiences
        }
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured experiences',
        error: error.message
      });
    }
  },

  // Get price range from database by currency
  getPriceRange: async (req, res) => {
    try {
      const { currency = 'IDR' } = req.query;

      // Use direct SQL query to avoid any model associations
      const sequelize = Experience.sequelize;
      
      const [results] = await sequelize.query(`
        SELECT 
          MIN(package_price) as "minPrice",
          MAX(package_price) as "maxPrice",
          COUNT(*) as "totalExperiences"
        FROM experiences 
        WHERE is_active = true 
          AND currency = :currency
          AND package_price IS NOT NULL
      `, {
        replacements: { currency },
        type: sequelize.QueryTypes.SELECT
      });

      if (!results || !results.minPrice) {
        return res.status(404).json({
          success: false,
          message: `No experiences found with currency ${currency}`
        });
      }

      const responseData = {
        success: true,
        data: {
          minPrice: parseFloat(results.minPrice),
          maxPrice: parseFloat(results.maxPrice),
          currency: currency,
          totalExperiences: parseInt(results.totalExperiences)
        }
      };

      res.json(responseData);

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch price range',
        error: error.message
      });
    }
  }
};

module.exports = experienceController;
