const { Booking, Experience, User, Payment } = require('../models');
const { sequelize } = require('../config/database');

// Helper functions for category-specific logic
const calculateTotalPrice = (category, experience, bookingDetails) => {
  const basePrice = parseFloat(experience.pricePerPackage || experience.package_price);
  let finalPrice = basePrice;
  
  switch (category) {
    case 'guide':
      // Price per person
      finalPrice = basePrice * (bookingDetails.participantCount || 1);
      break;
      
    case 'photographer':
      // Fixed package price + extras
      const packageMultiplier = {
        'basic': 1.0,
        'standard': 1.5,
        'premium': 2.0
      };
      finalPrice = basePrice * (packageMultiplier[bookingDetails.packageType] || 1.0);
      break;
      
    case 'tripplanner':
      // Fixed service price
      finalPrice = basePrice;
      break;
      
    case 'combo':
      // Base price + service add-ons
      const services = bookingDetails.selectedServices || [];
      if (services.includes('photography')) {
        finalPrice += basePrice * 0.8; // 80% additional for photo service
      }
      break;
      
    default:
      finalPrice = basePrice * (bookingDetails.participantCount || 1);
  }
  
  return Math.round(finalPrice);
};

const validateCategorySpecificData = (category, bookingDetails) => {
  switch (category) {
    case 'guide':
      return {
        tourDuration: bookingDetails.tourDuration,
        meetingPoint: bookingDetails.meetingPoint,
        languages: bookingDetails.languages || ['Indonesian', 'English'],
        specialInterests: bookingDetails.specialInterests || [],
        accessibilityNeeds: bookingDetails.accessibilityNeeds,
        dietaryRestrictions: bookingDetails.dietaryRestrictions
      };
      
    case 'photographer':
      return {
        packageType: bookingDetails.packageType || 'standard',
        photographyStyle: bookingDetails.photographyStyle || 'lifestyle',
        sessionDuration: bookingDetails.sessionDuration || 120,
        numberOfPhotos: bookingDetails.numberOfPhotos || 50,
        editedPhotosCount: bookingDetails.editedPhotosCount || 25,
        outfitChanges: bookingDetails.outfitChanges || 1,
        preferredLocations: bookingDetails.preferredLocations || [],
        backupDate: bookingDetails.backupDate,
        editingTimelineDays: 7,
        deliveryFormat: 'digital_gallery',
        printRights: true,
        commercialUse: false
      };
      
    case 'tripplanner':
      return {
        destination: bookingDetails.destination,
        tripDuration: bookingDetails.tripDuration,
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        budgetRange: bookingDetails.budgetRange,
        travelStyle: bookingDetails.travelStyle,
        interests: bookingDetails.interests || [],
        revisionCount: 0,
        maxRevisions: 2,
        pdfDeliveryMethod: 'email',
        planningNotes: bookingDetails.planningNotes
      };
      
    case 'combo':
      return {
        selectedServices: bookingDetails.selectedServices || ['guide', 'photography'],
        guideDuration: bookingDetails.guideDuration,
        photographyDuration: bookingDetails.photographyDuration,
        coordinationComplexity: bookingDetails.coordinationComplexity || 'moderate',
        teamCoordinationNotes: bookingDetails.teamCoordinationNotes,
        serviceTimeline: bookingDetails.serviceTimeline || {}
      };
      
    default:
      return {};
  }
};

const bookingController = {
  // Create a new booking
  async createBooking(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        category,
        experience,
        contactInfo,
        bookingDetails,
        paymentMethod
      } = req.body;

      // Validate required fields
      if (!category || !experience || !contactInfo || !bookingDetails) {
        return res.status(400).json({
          success: false,
          message: 'Missing required booking information'
        });
      }

      // Get experience details to determine category
      const experienceRecord = await Experience.findByPk(experience.id, {
        include: [{
          model: require('../models').HostCategory,
          as: 'category',
          attributes: ['name']
        }]
      });

      if (!experienceRecord) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      // Calculate total price based on category and selections
      const totalPrice = calculateTotalPrice(category, experience, bookingDetails);

      // Prepare category-specific data
      const categorySpecificData = validateCategorySpecificData(category, bookingDetails);

      // Create main booking record
      const booking = await Booking.create({
        experienceId: experience.id,
        userId: contactInfo.userId || null, // Could be null for guest bookings
        bookingDate: bookingDetails.selectedDate,
        bookingTime: bookingDetails.selectedTime || null,
        participantCount: bookingDetails.participantCount || 1,
        totalPrice,
        currency: 'IDR',
        status: 'pending',
        specialRequests: bookingDetails.specialRequests,
        contactPhone: contactInfo.phone,
        contactEmail: contactInfo.email,
        paymentMethod,
        paymentStatus: 'pending',
        categorySpecificData
      }, { transaction });

      await transaction.commit();

      // Reload to get generated booking_reference
      await booking.reload();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking: {
            id: booking.id,
            bookingReference: booking.bookingReference,
            category: experienceRecord.category.name,
            status: booking.status,
            totalPrice: booking.totalPrice,
            currency: booking.currency,
            experienceTitle: experienceRecord.title,
            selectedDate: booking.bookingDate,
            selectedTime: booking.bookingTime
          },
          categoryDetails: categorySpecificData
        }
      });

    } catch (error) {
      await transaction.rollback();
      
      
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Get booking by reference number
  async getBookingByReference(req, res) {
    try {
      const { reference } = req.params;

      const booking = await Booking.findOne({
        where: { bookingReference: reference },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Experience,
            as: 'experience',
            attributes: ['id', 'title', 'hostId'],
            include: [{
              model: User,
              as: 'host',
              attributes: ['id', 'name', 'email']
            }, {
              model: require('../models').HostCategory,
              as: 'category',
              attributes: ['name']
            }]
          }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: {
          booking,
          categoryDetails: booking.categorySpecificData
        }
      });

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Update booking status
  async updateBookingStatus(req, res) {
    try {
      const { reference } = req.params;
      const { status, reason } = req.body;

      const booking = await Booking.findOne({
        where: { bookingReference: reference }
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Update booking status
      await booking.update({
        status,
        cancellationReason: status === 'cancelled' ? reason : null
      });

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: {
          booking: {
            id: booking.id,
            bookingReference: booking.bookingReference,
            status: booking.status,
            updatedAt: booking.updatedAt
          }
        }
      });

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Get user bookings
  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;
      const { status, category, page = 1, limit = 10 } = req.query;

      const where = { userId: parseInt(userId) };
      if (status) where.status = status;

      const bookings = await Booking.findAndCountAll({
        where,
        include: [{
          model: Experience,
          as: 'experience',
          attributes: ['id', 'title', 'images'],
          include: [{
            model: require('../models').HostCategory,
            as: 'category',
            attributes: ['name'],
            where: category ? { name: category } : undefined
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      res.json({
        success: true,
        data: {
          bookings: bookings.rows,
          pagination: {
            total: bookings.count,
            pages: Math.ceil(bookings.count / parseInt(limit)),
            currentPage: parseInt(page),
            hasNext: parseInt(page) * parseInt(limit) < bookings.count,
            hasPrev: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Get all bookings (for admin/host)
  async getAllBookings(req, res) {
    try {
      const { status, category, hostId, page = 1, limit = 20 } = req.query;
      
      const where = {};
      if (status) where.status = status;

      const includeConditions = [{
        model: Experience,
        as: 'experience',
        attributes: ['id', 'title', 'hostId'],
        where: hostId ? { hostId: parseInt(hostId) } : undefined,
        include: [{
          model: require('../models').HostCategory,
          as: 'category',
          attributes: ['name'],
          where: category ? { name: category } : undefined
        }, {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'email']
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }];

      const bookings = await Booking.findAndCountAll({
        where,
        include: includeConditions,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      res.json({
        success: true,
        data: {
          bookings: bookings.rows,
          pagination: {
            total: bookings.count,
            pages: Math.ceil(bookings.count / parseInt(limit)),
            currentPage: parseInt(page),
            hasNext: parseInt(page) * parseInt(limit) < bookings.count,
            hasPrev: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

module.exports = bookingController;
