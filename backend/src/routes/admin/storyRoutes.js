const express = require('express');
const { Story, User, City, Country, StoryLike, StoryComment, sequelize } = require('../../models');
const { Op } = require('sequelize');
const { authenticateAdminToken, requireAdminRole } = require('../../middleware/adminAuth');

const router = express.Router();

// Get all stories with filtering and pagination for admin
router.get('/', authenticateAdminToken, requireAdminRole(['super_admin', 'admin', 'moderator']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      search,
      author,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where conditions
    const whereConditions = {};
    
    if (status && status !== 'all') {
      whereConditions.status = status;
    }

    if (featured !== undefined) {
      whereConditions.isFeatured = featured === 'true';
    }

    // Build include conditions for search
    const includeConditions = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email', 'avatarUrl'],
        where: author ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${author}%` } },
            { email: { [Op.iLike]: `%${author}%` } }
          ]
        } : undefined
      },
      {
        model: City,
        as: 'City',
        attributes: ['id', 'name'],
        include: [
          {
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }
        ]
      }
    ];

    // Add search conditions
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get stories with pagination
    const { count, rows: stories } = await Story.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: offset,
      distinct: true
    });

    // Calculate statistics
    const statsQuery = await Story.findAll({
      attributes: [
        'status',
        'isFeatured',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status', 'isFeatured'],
      raw: true
    });

    const stats = {
      total: count,
      published: 0,
      pending: 0,
      draft: 0,
      archived: 0,
      featured: 0
    };

    statsQuery.forEach(stat => {
      if (stat.status === 'published') stats.published += parseInt(stat.count);
      if (stat.status === 'pending') stats.pending += parseInt(stat.count);
      if (stat.status === 'draft') stats.draft += parseInt(stat.count);
      if (stat.status === 'archived') stats.archived += parseInt(stat.count);
      if (stat.isFeatured) stats.featured += parseInt(stat.count);
    });

    // Format stories for response
    const formattedStories = stories.map(story => ({
      id: story.id,
      uuid: story.uuid,
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      coverImage: story.coverImage,
      status: story.status,
      isFeatured: story.isFeatured,
      viewCount: story.viewCount,
      likeCount: story.likeCount,
      commentCount: story.commentCount,
      readingTime: story.readingTime,
      language: story.language,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      author: story.author ? {
        id: story.author.id,
        name: story.author.name,
        email: story.author.email,
        avatarUrl: story.author.avatarUrl,
        fullName: story.author.name
      } : null,
      city: story.City ? {
        id: story.City.id,
        name: story.City.name,
        country: story.City.country ? {
          id: story.City.country.id,
          name: story.City.country.name,
          code: story.City.country.code
        } : null
      } : null
    }));

    res.json({
      success: true,
      data: {
        stories: formattedStories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit)),
          hasNext: offset + parseInt(limit) < count,
          hasPrev: parseInt(page) > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Admin Stories List Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
});

// Update story status (approve, reject, etc.)
router.patch('/:id/status', authenticateAdminToken, requireAdminRole(['super_admin', 'admin', 'moderator']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: draft, published, or archived'
      });
    }

    const story = await Story.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    const oldStatus = story.status;
    await story.update({ status });

    // Log the status change
    console.log(`Story ${id} status changed from ${oldStatus} to ${status} by admin ${req.user.id}`);

    // TODO: Send notification to story author about status change
    // if (story.author && status === 'published') {
    //   await sendNotification(story.author.email, 'Story Approved', `Your story "${story.title}" has been approved and published!`);
    // }

    res.json({
      success: true,
      message: `Story status updated to ${status}`,
      data: {
        id: story.id,
        title: story.title,
        oldStatus,
        newStatus: status,
        reason
      }
    });

  } catch (error) {
    console.error('Update Story Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update story status',
      error: error.message
    });
  }
});

// Toggle featured status
router.patch('/:id/featured', authenticateAdminToken, requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const story = await Story.findByPk(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Only published stories can be featured
    if (featured && story.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Only published stories can be featured'
      });
    }

    await story.update({ isFeatured: featured });

    res.json({
      success: true,
      message: `Story ${featured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        id: story.id,
        title: story.title,
        isFeatured: story.isFeatured
      }
    });

  } catch (error) {
    console.error('Toggle Featured Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status',
      error: error.message
    });
  }
});

// Get story details for admin
router.get('/:id', authenticateAdminToken, requireAdminRole(['super_admin', 'admin', 'moderator']), async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'role']
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [
            {
              model: Country,
              as: 'country',
              attributes: ['id', 'name', 'code']
            }
          ]
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Get recent comments for this story
    const recentComments = await StoryComment.findAll({
      where: { storyId: story.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const formattedStory = {
      id: story.id,
      uuid: story.uuid,
      title: story.title,
      slug: story.slug,
      content: story.content,
      excerpt: story.excerpt,
      coverImage: story.coverImage,
      images: story.images,
      metaTitle: story.metaTitle,
      metaDescription: story.metaDescription,
      keywords: story.keywords,
      tags: story.tags,
      readingTime: story.readingTime,
      language: story.language,
      status: story.status,
      isActive: story.isActive,
      isFeatured: story.isFeatured,
      viewCount: story.viewCount,
      likeCount: story.likeCount,
      commentCount: story.commentCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      author: story.author ? {
        id: story.author.id,
        name: story.author.name,
        email: story.author.email,
        avatarUrl: story.author.avatarUrl,
        role: story.author.role,
        fullName: story.author.name
      } : null,
      city: story.City ? {
        id: story.City.id,
        name: story.City.name,
        country: story.City.country ? {
          id: story.City.country.id,
          name: story.City.country.name,
          code: story.City.country.code
        } : null
      } : null,
      recentComments: recentComments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user ? {
          id: comment.user.id,
          name: comment.user.name,
          email: comment.user.email,
          avatarUrl: comment.user.avatarUrl,
          fullName: comment.user.name
        } : null
      }))
    };

    res.json({
      success: true,
      data: formattedStory
    });

  } catch (error) {
    console.error('Get Story Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story details',
      error: error.message
    });
  }
});

// Bulk actions for stories
router.post('/bulk-action', authenticateAdminToken, requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const { action, storyIds, data = {} } = req.body;

    if (!Array.isArray(storyIds) || storyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Story IDs array is required'
      });
    }

    let updateData = {};
    let actionMessage = '';

    switch (action) {
      case 'publish':
        updateData.status = 'published';
        actionMessage = 'published';
        break;
      case 'archive':
        updateData.status = 'archived';
        actionMessage = 'archived';
        break;
      case 'draft':
        updateData.status = 'draft';
        actionMessage = 'moved to draft';
        break;
      case 'feature':
        updateData.isFeatured = true;
        actionMessage = 'featured';
        break;
      case 'unfeature':
        updateData.isFeatured = false;
        actionMessage = 'unfeatured';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const [updatedCount] = await Story.update(updateData, {
      where: {
        id: {
          [Op.in]: storyIds
        }
      }
    });

    res.json({
      success: true,
      message: `${updatedCount} stories ${actionMessage} successfully`,
      data: {
        updatedCount,
        action,
        storyIds
      }
    });

  } catch (error) {
    console.error('Bulk Action Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk action',
      error: error.message
    });
  }
});

// Delete story (admin only)
router.delete('/:id', authenticateAdminToken, requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findByPk(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Delete associated comments first
    await StoryComment.destroy({
      where: { storyId: id }
    });

    // Delete associated likes
    await StoryLike.destroy({
      where: { storyId: id }
    });

    // Delete the story
    await story.destroy();

    res.json({
      success: true,
      message: 'Story deleted successfully',
      data: {
        id: story.id,
        title: story.title
      }
    });

  } catch (error) {
    console.error('Delete Story Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete story',
      error: error.message
    });
  }
});

module.exports = router;
