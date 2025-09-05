const express = require('express');
const { User, Review, Experience, City, Country, HostCategory, UserLanguage, Language, Role, UserHostCategory } = require('../models');
const { Op, sequelize } = require('sequelize');
const { sequelize: dbInstance } = require('../config/database');

const router = express.Router();

// GET /api/hosts - Get all hosts with filters
router.get('/', async (req, res) => {
  try {
    const { 
      featured, 
      limit, 
      city, 
      category, 
      page = 1, 
      sort = 'newest' 
    } = req.query;

    // Build where clause
    let whereClause = {
      role: 'host',
      isActive: true
    };

    // Featured hosts: verified and highly rated
    if (featured === 'true') {
      whereClause.isVerified = true;
    }

    // Filter by city
    if (city) {
      whereClause['$City.name$'] = {
        [Op.iLike]: `%${city}%`
      };
    }

    // TODO: Re-implement category filtering using experience relationships
    // Currently disabled after removing UserHostCategory table

    // Sorting options - simplified for now
    let order = [['id', 'DESC']];

    const pageSize = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * pageSize;

    const hosts = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id',
        'uuid',
        'name',
        'avatarUrl',
        'bio',
        'isVerified'
      ],
      include: [
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }]
        },
        {
          model: Role,
          as: 'userRole',
          attributes: ['id', 'name', 'description']
        },
        {
          model: HostCategory,
          as: 'hostCategories',
          attributes: ['id', 'name', 'icon', 'description'],
          through: { 
            attributes: ['isPrimary', 'isActive'],
            where: { isActive: true }
          }
        },
        {
          model: Experience,
          as: 'hostedExperiences',
          attributes: ['id', 'category_id', 'pricePerPackage', 'currency'],
          include: [{
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }]
        },
        {
          model: Language,
          as: 'languages',
          attributes: ['id', 'name', 'code', 'nativeName'],
          through: {
            attributes: ['proficiency'],
            where: { isActive: true }
          },
          required: false
        }
      ],
      order: order,
      limit: pageSize,
      offset: offset,
      distinct: true
    });

    // Transform data for frontend
    const transformedHosts = await Promise.all(hosts.rows.map(async (hostData) => {
      // Get host categories from the direct relationship
      const hostCategories = hostData.hostCategories || [];
      const categoryNames = hostCategories.map(cat => cat.name);
      
      // Also get categories from experiences as fallback
      const experienceCategories = hostData.hostedExperiences
        ?.map(exp => exp.category?.name)
        .filter(Boolean) || [];
      
      // Combine both sources and remove duplicates
      const allCategories = [...new Set([...categoryNames, ...experienceCategories])];
      const uniqueCategories = allCategories.length > 0 ? allCategories : ['General'];

      // Get real reviews data from database using raw query via experiences
      const reviews = await dbInstance.query(`
        SELECT r.rating 
        FROM reviews r 
        JOIN experiences e ON r.experience_id = e.id 
        WHERE e.host_id = :hostId AND r.is_verified = true
      `, { 
        replacements: { hostId: hostData.id },
        type: dbInstance.QueryTypes.SELECT 
      });

      // Calculate real rating and review count
      const reviewCount = reviews ? reviews.length : 0;
      const rating = reviewCount > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;

      // Calculate price range from experiences
      const experiences = hostData.hostedExperiences || [];
      const experienceCount = experiences.length;
      
      // Get minimum price from all experiences
      const validPrices = experiences
        .filter(exp => exp.pricePerPackage && exp.pricePerPackage > 0)
        .map(exp => parseFloat(exp.pricePerPackage));
      
      const startFromPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
      const currency = experiences.find(exp => exp.currency)?.currency || 'USD';

      return {
        id: hostData.id,
        uuid: hostData.uuid,
        name: hostData.name,
        avatar: hostData.avatarUrl,  // No fallback, use null if no avatar
        bio: hostData.bio,
        location: hostData.City ? `${hostData.City.name}, ${hostData.City.country?.name}` : null,
        rating: Math.round(rating * 10) / 10, // Round to 1 decimal
        reviewCount: reviewCount,
        verified: hostData.isVerified,
        responseRate: hostData.responseRate || 0,
        responseTime: hostData.responseTime || 0,
        categories: uniqueCategories,
        toursCount: experienceCount,
        experienceCount: experienceCount, // Added explicit count
        startFromPrice: startFromPrice,
        currency: currency,
        languages: hostData.languages?.map(lang => ({
          id: lang.id,
          name: lang.name,
          code: lang.code,
          nativeName: lang.nativeName,
          proficiency: lang.UserLanguage?.proficiency || 'intermediate'
        })) || []
      };
    }));

    res.json({
      success: true,
      data: transformedHosts,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total: hosts.count,
        totalPages: Math.ceil(hosts.count / pageSize)
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hosts',
      error: error.message
    });
  }
});

// GET /api/hosts/:id - Get single host details (supports both UUID and integer ID)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Determine if the id contains a UUID or is integer
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const uuidMatch = id.match(uuidRegex);
    
    let whereClause = {
      role: 'host',
      isActive: true
    };
    
    if (uuidMatch) {
      // Extract UUID from slug format (e.g., "name-uuid")
      whereClause.uuid = uuidMatch[0];
    } else {
      // Assume it's an integer ID
      whereClause.id = parseInt(id);
    }

    const host = await User.findOne({
      where: whereClause,
      attributes: [
        'id',
        'uuid',
        'name',
        'avatarUrl',
        'bio',
        'isVerified',
        'createdAt'
      ],
      include: [
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }]
        },
        {
          model: Experience,
          as: 'hostedExperiences',
          attributes: ['id', 'title', 'category_id', 'pricePerPackage', 'currency'],
          include: [{
            model: HostCategory,
            as: 'category',
            attributes: ['id', 'name', 'icon', 'description']
          }]
        },
        {
          model: Language,
          as: 'languages',
          attributes: ['id', 'name', 'code', 'nativeName'],
          through: {
            attributes: ['proficiency'],
            where: { isActive: true }
          },
          required: false
        }
      ]
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    // Transform data for frontend
    const hostData = host.toJSON();
    
    // Extract unique categories from hosted experiences
    const uniqueCategories = [];
    const categoryIds = new Set();
    
      if (hostData.hostedExperiences) {
        hostData.hostedExperiences.forEach(experience => {
          if (experience.category && !categoryIds.has(experience.category.id)) {
            categoryIds.add(experience.category.id);
            uniqueCategories.push(experience.category);
          }
        });
      }    // Get real reviews data from database using raw query via experiences
    const reviews = await dbInstance.query(`
      SELECT r.rating 
      FROM reviews r 
      JOIN experiences e ON r.experience_id = e.id 
      WHERE e.host_id = :hostId AND r.is_verified = true
    `, { 
      replacements: { hostId: hostData.id },
      type: dbInstance.QueryTypes.SELECT 
    });

    // Calculate real rating and review count  
    const reviewCount = reviews ? reviews.length : 0;
    const rating = reviewCount > 0 ? 
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;

    // Calculate response metrics from database if available
    const responseRate = hostData.responseRate || 0;
    const responseTime = hostData.responseTime || 0;

    const transformedHost = {
      id: hostData.id,
      uuid: hostData.uuid,
      name: hostData.name,
      avatar: hostData.avatarUrl,  // No fallback, use null if no avatar
      bio: hostData.bio || '',
      location: hostData.City ? `${hostData.City.name}, ${hostData.City.country?.name}` : 'Unknown',
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal
      reviewCount: reviewCount,
      verified: hostData.isVerified,
      responseRate: responseRate,
      responseTime: responseTime,
      instagramId: null, // Not in current schema
      memberSince: hostData.createdAt,
      categories: uniqueCategories,
      toursCount: hostData.hostedExperiences?.length || 0,
      languages: hostData.languages?.map(lang => ({
        id: lang.id,
        name: lang.name,
        code: lang.code,
        nativeName: lang.nativeName,
        proficiency: lang.UserLanguage?.proficiency || 'intermediate'
      })) || []
    };

    res.json({
      success: true,
      data: transformedHost
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host details',
      error: error.message
    });
  }
});

// GET /api/hosts/:id/experiences - Get host experiences
router.get('/:id/experiences', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log('Received ID for experiences:', id);

    // Determine if the id contains a UUID or is integer
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const uuidMatch = id.match(uuidRegex);
    
    console.log('UUID match:', uuidMatch);
    
    let whereClause = {
      role: 'host',
      isActive: true
    };
    
    if (uuidMatch) {
      // Extract UUID from slug format (e.g., "name-uuid")
      whereClause.uuid = uuidMatch[0];
      console.log('Using UUID:', uuidMatch[0]);
    } else {
      // Assume it's an integer ID
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid host ID format'
        });
      }
      whereClause.id = numericId;
      console.log('Using numeric ID:', numericId);
    }

    console.log('Where clause:', whereClause);

    // First get the host to verify it exists
    const host = await User.findOne({
      where: whereClause,
      attributes: ['id', 'name', 'avatarUrl', 'bio'],
      include: [
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name']
          }]
        }
      ]
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found'
      });
    }

    // Get experiences for this host
    const experiences = await Experience.findAll({
      where: { hostId: host.id },
      attributes: [
        'id',
        'uuid',
        'title',
        'slug',
        'description',
        'shortDescription',
        'pricePerPackage',
        'currency',
        'duration',
        'difficulty',
        'maxGuests',
        'minGuests',
        'meetingPoint',
        'images',
        'isActive',
        'createdAt'
      ],
      include: [
        {
          model: HostCategory,
          as: 'category',
          attributes: ['id', 'name', 'icon', 'description']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Transform experiences data for frontend
    const transformedExperiences = await Promise.all(experiences.map(async (exp) => {
      const expData = exp.toJSON();
      
      // Calculate reviews and ratings for this experience
      const reviews = await dbInstance.query(`
        SELECT r.rating 
        FROM reviews r 
        WHERE r.experience_id = :expId AND r.is_verified = true
      `, { 
        replacements: { expId: expData.id },
        type: dbInstance.QueryTypes.SELECT 
      });

      const reviewCount = reviews ? reviews.length : 0;
      const avgRating = reviewCount > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;

      // Handle image URLs - take first image or default
      let coverImage = null;
      if (expData.images && Array.isArray(expData.images) && expData.images.length > 0) {
        coverImage = expData.images[0];
      }

      const transformedExp = {
        id: expData.id,
        uuid: expData.uuid,
        title: expData.title,
        description: expData.description,
        shortDescription: expData.shortDescription,
        slug: expData.slug, // Use slug from database - NOT UUID!
        price: expData.pricePerPackage,
        pricePerPackage: expData.pricePerPackage,
        currency: expData.currency || 'IDR',
        duration: expData.duration,
        difficulty: expData.difficulty,
        status: expData.isActive ? 'active' : 'inactive',
        isActive: expData.isActive,
        isFeatured: false, // Default to false, can be enhanced later
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: reviewCount,
        reviewCount: reviewCount,
        viewCount: 0, // Not tracked yet
        bookingCount: expData.bookingCount || 0, // From database field, maintained via booking status changes
        maxGuests: expData.maxGuests,
        minGuests: expData.minGuests,
        hostName: host.name,
        host: {
          id: host.id,
          name: host.name,
          avatar: host.avatarUrl,
          rating: 0, // TODO: Calculate from reviews
          totalReviews: 0, // TODO: Count from reviews
          bio: host.bio
        },
        coverImage: coverImage,
        imageUrl: coverImage,
        images: expData.images || [],
        included: [], // TODO: Add from database
        excluded: [], // TODO: Add from database
        requirements: [], // TODO: Add from database
        cancellationPolicy: null, // TODO: Add from database
        meetingPoint: expData.meetingPoint,
        latitude: null, // TODO: Add coordinates
        longitude: null,
        location: expData.city?.name || host.City?.name,
        category: expData.category ? {
          id: expData.category.id,
          name: expData.category.name,
          slug: expData.category.name.toLowerCase().replace(/\s+/g, '-'),
          icon: expData.category.icon,
          description: expData.category.description
        } : null,
        city: expData.City ? {
          id: expData.City.id,
          name: expData.City.name,
          slug: expData.City.name.toLowerCase().replace(/\s+/g, '-'),
          country: expData.City.country
        } : null,
        createdAt: expData.createdAt
      };
      
      return transformedExp;
    }));

    // Get total count
    const totalCount = await Experience.count({
      where: { hostId: host.id }
    });

    res.json({
      success: true,
      data: transformedExperiences,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host experiences',
      error: error.message
    });
  }
});

// GET /api/hosts/:id/reviews - Get host reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Determine if the id contains a UUID or is integer
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const uuidMatch = id.match(uuidRegex);
    
    // First get the host to get the numeric ID
    let hostId = id;
    if (uuidMatch) {
      // Extract UUID from slug format (e.g., "name-uuid")
      const host = await User.findOne({
        where: { uuid: uuidMatch[0], role: 'host', isActive: true },
        attributes: ['id']
      });
      
      if (!host) {
        return res.status(404).json({
          success: false,
          message: 'Host not found'
        });
      }
      
      hostId = host.id;
    } else {
      hostId = parseInt(id);
    }

    // Get reviews from database using raw query via experiences 
    const reviews = await dbInstance.query(`
      SELECT r.id, r.rating, r.title, r.comment, r.created_at,
             u.name as reviewer_name, u.avatar_url as reviewer_avatar,
             e.title as experience_title
      FROM reviews r 
      LEFT JOIN users u ON r.reviewer_id = u.id
      JOIN experiences e ON r.experience_id = e.id
      WHERE e.host_id = :hostId AND r.is_verified = true
      ORDER BY r.created_at DESC
      LIMIT :limit OFFSET :offset
    `, { 
      replacements: { 
        hostId: hostId, 
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      },
      type: dbInstance.QueryTypes.SELECT 
    });

    // Transform real reviews data only
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title || 'Great Experience!',
      comment: review.comment,
      date: review.created_at.toISOString().split('T')[0],
      travelerName: review.reviewer_name || 'Anonymous',
      travelerAvatar: review.reviewer_avatar, // No fallback
      experienceTitle: review.experience_title || 'LocallyTrip Experience'
    }));

    // Get total count
    const [countResult] = await dbInstance.query(`
      SELECT COUNT(*) as count 
      FROM reviews r 
      JOIN experiences e ON r.experience_id = e.id 
      WHERE e.host_id = :hostId AND r.is_verified = true
    `, { 
      replacements: { hostId: hostId },
      type: dbInstance.QueryTypes.SELECT 
    });
    
    const totalCount = countResult ? countResult.count : 0;

    res.json({
      success: true,
      data: transformedReviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host reviews',
      error: error.message
    });
  }
});

// GET /api/hosts/:id/stories - Get host stories
router.get('/:id/stories', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Determine if the id contains a UUID or is integer
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const uuidMatch = id.match(uuidRegex);
    
    // First get the user to get the numeric ID (don't filter by role for stories)
    let userId = id;
    if (uuidMatch) {
      // Extract UUID from slug format (e.g., "name-uuid")
      const user = await User.findOne({
        where: { uuid: uuidMatch[0], isActive: true },
        attributes: ['id']
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      userId = user.id;
    } else {
      userId = parseInt(id);
    }

    // Get stories from database
    const stories = await dbInstance.query(`
      SELECT s.id, s.title, s.slug, s.content, s.excerpt, s.cover_image, 
             s.created_at, s.updated_at, s.status, s.view_count,
             u.name as author_name, u.avatar_url as author_avatar
      FROM stories s 
      LEFT JOIN users u ON s.author_id = u.id
      WHERE s.author_id = :userId AND s.status = 'published'
      ORDER BY s.created_at DESC
      LIMIT :limit OFFSET :offset
    `, { 
      replacements: { 
        userId: userId, 
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      },
      type: dbInstance.QueryTypes.SELECT 
    });

    // Transform stories data
    const transformedStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt || story.content?.substring(0, 200) + '...',
      image: story.cover_image,
      publishedAt: story.created_at,
      readTime: Math.ceil((story.content?.length || 0) / 200) + ' min read',
      author: story.author_name,
      authorAvatar: story.author_avatar,
      viewCount: story.view_count || 0
    }));

    // Get total count
    const [countResult] = await dbInstance.query(`
      SELECT COUNT(*) as count 
      FROM stories s 
      WHERE s.author_id = :userId AND s.status = 'published'
    `, { 
      replacements: { userId: userId },
      type: dbInstance.QueryTypes.SELECT 
    });
    
    const totalCount = countResult ? countResult.count : 0;

    res.json({
      success: true,
      data: transformedStories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch host stories',
      error: error.message
    });
  }
});

module.exports = router;
