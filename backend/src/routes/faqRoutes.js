const express = require('express');
const { FAQ } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Category mapping from frontend to database
const CATEGORY_MAPPING = {
  // Frontend -> Database
  'travelers': 'traveller',
  'hosts': 'host', 
  'payments': 'payment',
  'safety': 'traveller', // Safety questions are often traveller-related
  'general': 'general',
  'booking': 'booking',
  'technical': 'technical'
};

// Reverse mapping from database to frontend
const REVERSE_CATEGORY_MAPPING = {
  'traveller': 'travelers',
  'host': 'hosts',
  'payment': 'payments', 
  'general': 'general',
  'booking': 'travelers', // Booking questions are traveller-oriented
  'technical': 'general'
};

// Special function to determine if a FAQ should be considered "safety"
const isSafetyFAQ = (question, answer, originalCategory) => {
  // Don't override host-specific or payment-specific FAQs even if they contain safety keywords
  if (originalCategory === 'host' || originalCategory === 'payment') {
    return false;
  }
  
  const safetyKeywords = ['safe', 'safety', 'secure', 'emergency', 'insurance', 'verified', 'background', 'trust', 'protection'];
  const text = (question + ' ' + answer).toLowerCase();
  return safetyKeywords.some(keyword => text.includes(keyword));
};

// GET /api/faqs - Get all FAQs with filters
router.get('/', async (req, res) => {
  try {
    const {
      featured,
      category,
      search,
      limit = 20,
      page = 1
    } = req.query;

    // Build where clause - using actual database column names
    let whereClause = {
      is_active: true
    };

    // Featured FAQs
    if (featured === 'true') {
      whereClause.is_featured = true;
    }

    // Filter by category
    if (category) {
      if (category === 'safety') {
        // For safety category, we need to fetch all FAQs and filter after transformation
        // Don't add category filter to where clause
      } else {
        // Map frontend category to database category
        const dbCategory = CATEGORY_MAPPING[category];
        if (dbCategory) {
          whereClause.category = dbCategory;
        } else {
          // If no mapping found, use the category as-is for backward compatibility
          whereClause.category = category;
        }
      }
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { question: { [Op.iLike]: `%${search}%` } },
        { answer: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Pagination
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    // Order: featured first, then by display order, then by helpful count
    const order = [
      ['is_featured', 'DESC'],
      ['display_order', 'ASC'], 
      ['helpful_count', 'DESC'],
      ['created_at', 'DESC']
    ];

    // For safety category, we need to fetch all FAQs to apply keyword filtering
    let fetchParams = {
      where: whereClause,
      order: order,
      attributes: [
        'id',
        'question',
        'answer', 
        'category',
        'is_featured',
        'view_count',
        'helpful_count',
        'tags',
        'created_at'
      ]
    };

    // If not safety category, apply normal pagination
    if (category !== 'safety') {
      fetchParams.limit = pageSize;
      fetchParams.offset = offset;
    }

    const faqs = await FAQ.findAndCountAll(fetchParams);

    // Transform data for frontend
    let transformedFAQs = faqs.rows.map(faq => {
      const faqData = faq.toJSON();
      
      // Determine frontend category
      let frontendCategory = REVERSE_CATEGORY_MAPPING[faqData.category] || faqData.category;
      
      // Special handling for safety category
      if (isSafetyFAQ(faqData.question, faqData.answer, faqData.category)) {
        frontendCategory = 'safety';
      }
      
      return {
        id: faqData.id,
        question: faqData.question,
        answer: faqData.answer,
        category: frontendCategory,
        featured: faqData.is_featured,
        viewCount: faqData.view_count || 0,
        helpfulCount: faqData.helpful_count || 0,
        tags: faqData.tags || [],
        createdAt: faqData.created_at
      };
    });

    // Apply application-level filtering for safety category
    if (category === 'safety') {
      transformedFAQs = transformedFAQs.filter(faq => faq.category === 'safety');
      
      // Apply pagination to filtered results
      const totalSafetyFAQs = transformedFAQs.length;
      const startIndex = offset;
      const endIndex = startIndex + pageSize;
      transformedFAQs = transformedFAQs.slice(startIndex, endIndex);
      
      return res.json({
        success: true,
        data: transformedFAQs,
        pagination: {
          page: parseInt(page),
          limit: pageSize,
          total: totalSafetyFAQs,
          totalPages: Math.ceil(totalSafetyFAQs / pageSize)
        }
      });
    }

    res.json({
      success: true,
      data: transformedFAQs,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total: faqs.count,
        totalPages: Math.ceil(faqs.count / pageSize)
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message
    });
  }
});

// GET /api/faqs/:id - Get single FAQ
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findOne({
      where: {
        id: id,
        is_active: true
      }
    });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment view count
    await FAQ.update(
      { view_count: faq.view_count + 1 },
      { where: { id: id } }
    );

    // Transform data for frontend
    const faqData = faq.toJSON();
    const transformedFAQ = {
      id: faqData.id,
      question: faqData.question,
      answer: faqData.answer,
      category: faqData.category,
      featured: faqData.is_featured,
      viewCount: faqData.view_count || 0,
      helpfulCount: faqData.helpful_count || 0,
      tags: faqData.tags || [],
      createdAt: faqData.created_at,
      updatedAt: faqData.updated_at
    };

    res.json({
      success: true,
      data: transformedFAQ
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ details',
      error: error.message
    });
  }
});

// POST /api/faqs/:id/helpful - Mark FAQ as helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment helpful count
    await FAQ.update(
      { helpful_count: faq.helpful_count + 1 },
      { where: { id: id } }
    );

    res.json({
      success: true,
      message: 'FAQ marked as helpful',
      data: {
        helpfulCount: faq.helpful_count + 1
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to mark FAQ as helpful',
      error: error.message
    });
  }
});

// GET /api/faqs/categories - Get all FAQ categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await FAQ.findAll({
      attributes: [
        'category',
        [FAQ.sequelize.fn('COUNT', FAQ.sequelize.col('id')), 'count']
      ],
      where: {
        is_active: true
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const transformedCategories = categories.map(cat => {
      const catData = cat.toJSON();
      return {
        name: catData.category,
        count: parseInt(catData.count)
      };
    });

    res.json({
      success: true,
      data: transformedCategories
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ categories',
      error: error.message
    });
  }
});

module.exports = router;
