const express = require('express');
const router = express.Router();
const { StoryComment, User, Story } = require('../../models');
const { Op } = require('sequelize');

// GET /admin/comments - Get all comments with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      storyId,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where conditions
    const whereConditions = {};
    
    if (status === 'approved') {
      whereConditions.is_approved = true;
    } else if (status === 'pending') {
      whereConditions.is_approved = false;
    }
    
    if (storyId) {
      whereConditions.story_id = storyId;
    }
    
    // Build search conditions
    let searchConditions = {};
    if (search) {
      searchConditions = {
        [Op.or]: [
          { content: { [Op.iLike]: `%${search}%` } },
          { '$user.name$': { [Op.iLike]: `%${search}%` } },
          { '$user.email$': { [Op.iLike]: `%${search}%` } },
          { '$story.title$': { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    // Combine where conditions
    const finalWhere = {
      ...whereConditions,
      ...searchConditions
    };

    // Get comments with associations
    const result = await StoryComment.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar_url']
        },
        {
          model: Story,
          as: 'story',
          attributes: ['id', 'title', 'slug']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    console.log('Query result type:', typeof result);
    console.log('Result keys:', Object.keys(result));
    console.log('Comments type:', typeof result.rows);
    
    const { rows: comments, count } = result;

    // Get stats
    const stats = await Promise.all([
      StoryComment.count(), // total
      StoryComment.count({ where: { is_approved: true } }), // approved
      StoryComment.count({ where: { is_approved: false } }), // pending
      StoryComment.count({ where: { parent_id: { [Op.not]: null } } }) // replies
    ]);

    const response = {
      success: true,
      data: {
        comments: comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          isApproved: comment.is_approved,
          parentId: comment.parent_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          user: comment.user,
          story: comment.story
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        },
        stats: {
          total: stats[0],
          approved: stats[1],
          pending: stats[2],
          replies: stats[3]
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
});

// PATCH /admin/comments/:id - Approve or reject comment
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const comment = await StoryComment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Story,
          as: 'story',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    let updateData = {};
    
    if (action === 'approve') {
      updateData.is_approved = true;
    } else if (action === 'reject') {
      updateData.is_approved = false;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }

    await comment.update(updateData);

    res.json({
      success: true,
      message: `Comment ${action}ed successfully`,
      data: {
        id: comment.id,
        isApproved: comment.is_approved,
        action: action
      }
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
});

// DELETE /admin/comments/:id - Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await StoryComment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Story,
          as: 'story',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Delete the comment
    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: {
        id: parseInt(id),
        deletedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
});

// GET /admin/comments/stats - Get comment statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      StoryComment.count(), // total
      StoryComment.count({ where: { is_approved: true } }), // approved  
      StoryComment.count({ where: { is_approved: false } }), // pending
      StoryComment.count({ where: { parent_id: { [Op.not]: null } } }) // replies
    ]);

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayComments = await StoryComment.count({
      where: {
        created_at: { [Op.gte]: today }
      }
    });

    res.json({
      success: true,
      data: {
        total: stats[0],
        approved: stats[1], 
        pending: stats[2],
        replies: stats[3],
        today: todayComments
      }
    });
  } catch (error) {
    console.error('Error fetching comment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comment stats',
      error: error.message
    });
  }
});

// GET /admin/comments/:id - Get single comment details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await StoryComment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar_url']
        },
        {
          model: Story,
          as: 'story',
          attributes: ['id', 'title', 'slug']
        },
        {
          model: StoryComment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'avatar_url']
            }
          ]
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        isApproved: comment.is_approved,
        parentId: comment.parent_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        user: comment.user,
        story: comment.story,
        replies: comment.replies || []
      }
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comment',
      error: error.message
    });
  }
});

module.exports = router;