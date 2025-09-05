const express = require('express');
const router = express.Router();
const { Language, UserLanguage, User } = require('../models');
const { Op } = require('sequelize');

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
