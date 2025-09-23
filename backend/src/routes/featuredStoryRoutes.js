const express = require('express');
const router = express.Router();
const { FeaturedStory, Story, User } = require('../models');

// GET /api/featured-stories - Get featured stories selected by admin
router.get('/', async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const featuredStories = await FeaturedStory.findAll({
      where: { isActive: true },
      include: [
        {
          model: Story,
          as: 'story',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'uuid', 'name', 'avatarUrl']
            }
          ]
        }
      ],
      order: [['displayOrder', 'ASC']],
      limit: parseInt(limit)
    });

    // Transform data for frontend
    const transformedStories = featuredStories.map(featured => {
      const story = featured.story;
      return {
        id: featured.id,
        storyId: story.uuid,
        title: featured.title || story.title,
        description: featured.description || story.excerpt,
        badge: featured.badge || 'Featured Story',
        imageUrl: featured.featuredImageUrl || story.coverImage || 'default-story.jpg',
        content: story.content,
        excerpt: story.excerpt,
        readTime: story.readTime || 5,
        publishedAt: story.publishedAt,
        author: {
          id: story.author?.uuid,
          name: story.author?.name,
          avatar: story.author?.avatarUrl
        },
        tags: story.tags || [],
        viewCount: story.viewCount || 0,
        likeCount: story.likeCount || 0,
        displayOrder: featured.displayOrder
      };
    });

    res.json({
      success: true,
      data: transformedStories,
      count: transformedStories.length
    });

  } catch (error) {
    console.error('Error fetching featured stories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured stories',
      error: error.message
    });
  }
});

// POST /api/featured-stories - Add story to featured list
router.post('/', async (req, res) => {
  try {
    const { storyId, title, description, badge, displayOrder, featuredImageUrl } = req.body;

    // Check if story exists
    const story = await Story.findByPk(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if already featured
    const existingFeatured = await FeaturedStory.findOne({
      where: { storyId, isActive: true }
    });

    if (existingFeatured) {
      return res.status(400).json({
        success: false,
        message: 'Story is already featured'
      });
    }

    const featuredStory = await FeaturedStory.create({
      storyId,
      title,
      description,
      badge: badge || 'Featured Story',
      displayOrder: displayOrder || 0,
      featuredImageUrl,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: featuredStory,
      message: 'Story added to featured list'
    });

  } catch (error) {
    console.error('Error adding featured story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add featured story',
      error: error.message
    });
  }
});

// PUT /api/featured-stories/:id - Update featured story
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, badge, displayOrder, featuredImageUrl, isActive } = req.body;

    const featuredStory = await FeaturedStory.findByPk(id);
    if (!featuredStory) {
      return res.status(404).json({
        success: false,
        message: 'Featured story not found'
      });
    }

    await featuredStory.update({
      title,
      description,
      badge,
      displayOrder,
      featuredImageUrl,
      isActive
    });

    res.json({
      success: true,
      data: featuredStory,
      message: 'Featured story updated'
    });

  } catch (error) {
    console.error('Error updating featured story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured story',
      error: error.message
    });
  }
});

// DELETE /api/featured-stories/:id - Remove from featured list
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const featuredStory = await FeaturedStory.findByPk(id);
    if (!featuredStory) {
      return res.status(404).json({
        success: false,
        message: 'Featured story not found'
      });
    }

    await featuredStory.update({ isActive: false });

    res.json({
      success: true,
      message: 'Story removed from featured list'
    });

  } catch (error) {
    console.error('Error removing featured story:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove featured story',
      error: error.message
    });
  }
});

// GET /api/featured-stories/available - Get available stories to feature
router.get('/available', async (req, res) => {
  try {
    const { limit = 20, search = '' } = req.query;

    // Get IDs of already featured stories
    const featuredIds = await FeaturedStory.findAll({
      where: { isActive: true },
      attributes: ['storyId']
    }).then(results => results.map(r => r.storyId));

    const whereClause = {
      id: { [require('sequelize').Op.notIn]: featuredIds },
      isPublished: true
    };

    if (search) {
      whereClause.title = {
        [require('sequelize').Op.iLike]: `%${search}%`
      };
    }

    const stories = await Story.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'uuid', 'name']
        }
      ],
      limit: parseInt(limit),
      order: [['publishedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: stories
    });

  } catch (error) {
    console.error('Error fetching available stories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available stories',
      error: error.message
    });
  }
});

module.exports = router;