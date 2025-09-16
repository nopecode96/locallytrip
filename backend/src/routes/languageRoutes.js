const express = require('express');
const { Language } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all languages
router.get('/', async (req, res) => {
  try {
    const languages = await Language.findAll({
      where: {
        isActive: true
      },
      attributes: ['id', 'name', 'code', 'nativeName'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: languages,
      message: 'Languages retrieved successfully'
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search languages
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchTerm = query.trim();
    
    const languages = await Language.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { nativeName: { [Op.iLike]: `%${searchTerm}%` } },
          { code: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'name', 'code', 'nativeName'],
      order: [
        // Exact matches first
        [sequelize.literal(`CASE WHEN LOWER(name) = LOWER('${searchTerm}') THEN 1 ELSE 2 END`)],
        ['name', 'ASC']
      ],
      limit: 20
    });

    res.json({
      success: true,
      data: languages,
      message: `Found ${languages.length} matching languages`
    });
  } catch (error) {
    console.error('Language search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get language by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const language = await Language.findByPk(id, {
      attributes: ['id', 'name', 'code', 'nativeName']
    });

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    res.json({
      success: true,
      data: language,
      message: 'Language retrieved successfully'
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user languages for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      include: [{
        model: Language,
        as: 'languages',
        attributes: ['id', 'name', 'code', 'nativeName'],
        through: {
          attributes: ['proficiency'],
          where: { isActive: true }
        }
      }],
      attributes: ['id']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const formattedLanguages = user.languages?.map(lang => ({
      id: lang.id,
      name: lang.name,
      code: lang.code,
      nativeName: lang.nativeName,
      proficiency: lang.UserLanguage?.proficiency || 'intermediate'
    })) || [];

    res.json({
      success: true,
      data: formattedLanguages,
      message: 'User languages retrieved successfully'
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
