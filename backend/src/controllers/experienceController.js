const { Experience, User, City, HostCategory, ExperienceItinerary, Review, Booking, sequelize } = require('../models');
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
      const where = { 
        status: Experience.STATUS.PUBLISHED // Only show published experiences
      };

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
        where: { ...where },
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
            attributes: ['id', 'title', 'description', 'durationMinutes', 'stepNumber'],
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
        where: { slug: slug },
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
            attributes: ['id', 'title', 'description', 'durationMinutes', 'stepNumber'],
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
      console.log('Creating experience with parsed data:', Object.keys(req.body));
      console.log('Received files:', req.files ? req.files.length : 0);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const hostId = req.user.id;
      
      // Handle uploaded images
      let imageFilenames = [];
      if (req.files && req.files.length > 0) {
        imageFilenames = req.files.map(file => file.filename);
        console.log('Uploaded image files:', imageFilenames);
      }
      
      // Get city coordinates
      let coordinates = { latitude: null, longitude: null };
      if (req.body.cityId) {
        const city = await City.findByPk(req.body.cityId);
        if (city) {
          coordinates.latitude = city.latitude;
          coordinates.longitude = city.longitude;
          console.log(`Using city coordinates for ${city.name}:`, coordinates);
        }
      }
      
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
      
      // Prepare experience data with all required fields
      const experienceData = {
        // Basic Info
        title: req.body.title,
        slug,
        description: req.body.description,
        shortDescription: req.body.shortDescription || '',
        
        // Host & Category
        hostId,
        categoryId: req.body.categoryId,
        experienceTypeId: req.body.experienceTypeId || null,
        cityId: req.body.cityId,
        
        // Pricing & Logistics
        pricePerPackage: req.body.pricePerPackage,
        currency: req.body.currency || 'IDR',
        duration: req.body.duration,
        maxGuests: req.body.maxGuests,
        minGuests: req.body.minGuests || 1,
        
        // Location & Difficulty
        meetingPoint: req.body.meetingPoint,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        difficulty: req.body.difficulty || 'Easy',
        endingPoint: req.body.endingPoint || req.body.meetingPoint,
        walkingDistance: req.body.walkingDistance || 0,
        fitnessLevel: req.body.fitnessLevel || 'Beginner',
        
        // Arrays
        images: imageFilenames,
        included: req.body.included || [],
        excluded: req.body.excluded || [],
        deliverables: req.body.deliverables || [],
        equipmentUsed: req.body.equipmentUsed || [],
        
        // Status - Set to draft for new experiences
        status: Experience.STATUS.DRAFT, // New status field
        isActive: false, // Keep for backward compatibility
        isFeatured: false,
        
        // Host specific data
        hostSpecificData: req.body.hostSpecificData || {}
      };

      console.log('Creating experience with data:', {
        title: experienceData.title,
        status: experienceData.status,
        isActive: experienceData.isActive,
        coordinates: { latitude: experienceData.latitude, longitude: experienceData.longitude },
        hasItinerary: !!req.body.itinerary
      });

      const experience = await Experience.create(experienceData);

      // Handle itinerary creation if provided
      let itineraryData = req.body.itinerary;
      
      // Parse itinerary if it's a JSON string
      if (typeof itineraryData === 'string') {
        try {
          itineraryData = JSON.parse(itineraryData);
        } catch (error) {
          console.log('Failed to parse itinerary JSON:', error);
          itineraryData = null;
        }
      }
      
      if (itineraryData && Array.isArray(itineraryData) && itineraryData.length > 0) {
        console.log('Creating itinerary with', itineraryData.length, 'steps');
        
        // Create itinerary items in experience_itineraries table
        const itineraryItems = itineraryData.map((item, index) => ({
          experienceId: experience.id,
          stepNumber: index + 1,
          title: item.title,
          description: item.description,
          location: item.location, // Will map to location_name field
          durationMinutes: item.durationMinutes || item.duration
        }));
        
        try {
          await ExperienceItinerary.bulkCreate(itineraryItems);
          console.log('Itinerary items created in database');
        } catch (itineraryError) {
          console.error('Error creating itinerary items:', itineraryError);
          // Don't fail the whole experience creation if itinerary fails
        }
      }

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
      console.error('Error in createExperience:', error);
      console.error('Error stack:', error.stack);
      
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

  // Delete experience (Host only) - Soft delete with status
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

      // Use new soft delete method with booking check
      try {
        await experience.softDelete();
        
        res.json({
          success: true,
          message: 'Experience deleted successfully'
        });
      } catch (deleteError) {
        res.status(400).json({
          success: false,
          message: deleteError.message
        });
      }

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete experience',
        error: error.message
      });
    }
  },

  // Submit experience for review (Host only)
  submitForReview: async (req, res) => {
    try {
      const { id } = req.params;
      const hostId = req.user.id;

      const experience = await Experience.findOne({
        where: { id, hostId, status: Experience.STATUS.DRAFT }
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found or not in draft status'
        });
      }

      await experience.update({ status: Experience.STATUS.PENDING_REVIEW });

      res.json({
        success: true,
        message: 'Experience submitted for review successfully',
        data: experience
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit experience for review',
        error: error.message
      });
    }
  },

  // Publish experience (Admin only)
  publishExperience: async (req, res) => {
    try {
      const { id } = req.params;

      const experience = await Experience.findByPk(id);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      try {
        await experience.publishExperience();
        
        res.json({
          success: true,
          message: 'Experience published successfully',
          data: experience
        });
      } catch (publishError) {
        res.status(400).json({
          success: false,
          message: publishError.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to publish experience',
        error: error.message
      });
    }
  },

  // Pause experience (Host only)
  pauseExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const hostId = req.user.id;

      const experience = await Experience.findOne({
        where: { id, hostId }
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found or you are not authorized'
        });
      }

      try {
        await experience.pauseExperience();
        
        res.json({
          success: true,
          message: 'Experience paused successfully',
          data: experience
        });
      } catch (pauseError) {
        res.status(400).json({
          success: false,
          message: pauseError.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to pause experience',
        error: error.message
      });
    }
  },

  // Resume experience (Host only)
  resumeExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const hostId = req.user.id;

      const experience = await Experience.findOne({
        where: { id, hostId }
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found or you are not authorized'
        });
      }

      try {
        await experience.resumeExperience();
        
        res.json({
          success: true,
          message: 'Experience resumed successfully',
          data: experience
        });
      } catch (resumeError) {
        res.status(400).json({
          success: false,
          message: resumeError.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to resume experience',
        error: error.message
      });
    }
  },

  // Suspend experience (Admin only)
  suspendExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const experience = await Experience.findByPk(id);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      await experience.update({ 
        status: Experience.STATUS.SUSPENDED,
        isActive: false,
        suspendReason: reason || 'Suspended by admin'
      });

      res.json({
        success: true,
        message: 'Experience suspended successfully',
        data: experience
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to suspend experience',
        error: error.message
      });
    }
  },

  // Reject experience (Admin only)
  rejectExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const experience = await Experience.findByPk(id);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      try {
        await experience.rejectExperience(reason);
        
        res.json({
          success: true,
          message: 'Experience rejected successfully',
          data: experience
        });
      } catch (rejectError) {
        res.status(400).json({
          success: false,
          message: rejectError.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to reject experience',
        error: error.message
      });
    }
  },

  // Resubmit experience after rejection (Host only)
  resubmitExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const hostId = req.user.id;

      const experience = await Experience.findOne({
        where: { id, hostId }
      });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found or you are not authorized'
        });
      }

      try {
        await experience.resubmitAfterRejection();
        
        res.json({
          success: true,
          message: 'Experience resubmitted for review successfully',
          data: experience
        });
      } catch (resubmitError) {
        res.status(400).json({
          success: false,
          message: resubmitError.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to resubmit experience',
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

      // Filter by status if provided
      if (status && status !== 'all') {
        if (status === 'active') {
          where.status = Experience.STATUS.PUBLISHED;
        } else if (status === 'inactive') {
          where.status = [Experience.STATUS.PAUSED, Experience.STATUS.SUSPENDED];
        } else if (status === 'draft') {
          where.status = Experience.STATUS.DRAFT;
        } else if (status === 'pending') {
          where.status = Experience.STATUS.PENDING_REVIEW;
        } else if (status === 'rejected') {
          where.status = Experience.STATUS.REJECTED;
        } else if (status === 'deleted') {
          where.status = Experience.STATUS.DELETED;
        } else {
          // Direct status match
          where.status = status;
        }
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
          status: Experience.STATUS.PUBLISHED,
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
  },

  // Get host experiences statistics by status
  getHostExperiencesStats: async (req, res) => {
    try {
      const hostId = req.user.id;

      // Count experiences by status
      const stats = await Experience.findAll({
        where: { hostId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Initialize all status counts to 0
      const statusCounts = {
        draft: 0,
        pending_review: 0,
        published: 0,
        rejected: 0,
        paused: 0,
        suspended: 0,
        deleted: 0
      };

      // Fill in actual counts
      stats.forEach(stat => {
        statusCounts[stat.status] = parseInt(stat.count);
      });

      // Calculate derived stats
      const totalActive = statusCounts.published;
      const totalInactive = statusCounts.paused + statusCounts.suspended;
      const needsAttention = statusCounts.rejected + statusCounts.pending_review;
      const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

      res.json({
        success: true,
        data: {
          stats: {
            // Individual status counts
            draft: statusCounts.draft,
            pending: statusCounts.pending_review,
            published: statusCounts.published,
            rejected: statusCounts.rejected,
            paused: statusCounts.paused,
            suspended: statusCounts.suspended,
            deleted: statusCounts.deleted,
            
            // Aggregate counts for tabs
            active: totalActive,
            inactive: totalInactive,
            needsAttention: needsAttention,
            total: total,
            
            // Additional useful stats
            totalViews: 0, // TODO: Implement when view tracking is added
            totalBookings: 0 // TODO: Implement when booking stats are needed
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch experiences statistics',
        error: error.message
      });
    }
  }
};

module.exports = experienceController;
