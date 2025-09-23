const { StoryComment, User, Story } = require('../models');
const { validateCommentRelevance, extractStoryKeywords } = require('../middleware/commentValidation');

/**
 * Create new comment dengan validasi
 */
const createComment = async (req, res) => {
  try {
    const { story_id, content, parent_id } = req.body;
    const user_id = req.user?.userId || req.user?.id; // Support both userId and id for compatibility
    
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Validasi sudah dilakukan oleh middleware
    const validation = req.commentValidation || { isValid: true, confidence: 0.5 };
    
    const comment = await StoryComment.create({
      story_id,
      user_id,
      content: content.trim(),
      parent_id: parent_id || null,
      is_approved: true // Auto-approve comments from authenticated users
    });
    
    // Fetch comment dengan user data untuk response
    const createdComment = await StoryComment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatar_url']
      }]
    });
    
    // Log validation info
    console.log('Comment validation info:', {
      commentId: comment.id,
      storyId: story_id,
      confidence: validation.confidence,
      matchedKeywords: validation.matchedKeywords
    });
    
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: {
        id: createdComment.id,
        content: createdComment.content,
        createdAt: createdComment.createdAt,
        user: {
          id: createdComment.user.id,
          name: createdComment.user.name,
          avatar: createdComment.user.avatar_url
        }
      },
      validation: {
        confidence: validation.confidence,
        relevanceCheck: 'passed'
      }
    });
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: error.message
    });
  }
};

/**
 * Update comment dengan validasi ulang
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user?.id;
    
    const comment = await StoryComment.findOne({
      where: { id, user_id }, // User can only update their own comments
      include: [{
        model: Story,
        as: 'story',
        attributes: ['id', 'title', 'content', 'tags', 'excerpt']
      }]
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or unauthorized'
      });
    }
    
    // Re-validate dengan story context
    const storyKeywords = extractStoryKeywords(comment.story);
    const validation = validateCommentRelevance(content, storyKeywords);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Comment validation failed',
        validation: validation
      });
    }
    
    await comment.update({ content: content.trim() });
    
    res.json({
      success: true,
      message: 'Comment updated successfully',
      validation: {
        confidence: validation.confidence,
        relevanceCheck: 'passed'
      }
    });
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

/**
 * Admin endpoint untuk audit comment relevance
 */
const auditCommentRelevance = async (req, res) => {
  try {
    const { limit = 50, offset = 0, confidence_threshold = 0.3 } = req.query;
    
    const comments = await StoryComment.findAll({
      include: [
        {
          model: Story,
          as: 'story',
          attributes: ['id', 'title', 'content', 'tags', 'excerpt']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    const auditResults = [];
    
    for (const comment of comments) {
      const storyKeywords = extractStoryKeywords(comment.story);
      const validation = validateCommentRelevance(comment.content, storyKeywords);
      
      auditResults.push({
        commentId: comment.id,
        storyId: comment.story.id,
        storyTitle: comment.story.title,
        userName: comment.user.name,
        content: comment.content.substring(0, 100) + '...',
        validation: validation,
        flagged: validation.confidence < parseFloat(confidence_threshold)
      });
    }
    
    const flaggedCount = auditResults.filter(r => r.flagged).length;
    
    res.json({
      success: true,
      data: auditResults,
      summary: {
        total: auditResults.length,
        flagged: flaggedCount,
        flaggedPercentage: ((flaggedCount / auditResults.length) * 100).toFixed(2)
      }
    });
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to audit comments',
      error: error.message
    });
  }
};

/**
 * Get comments for a story
 */
const getComments = async (req, res) => {
  try {
    const { storyId, limit = 50, offset = 0 } = req.query;

    if (!storyId) {
      return res.status(400).json({
        success: false,
        message: 'Story ID is required'
      });
    }

    const comments = await StoryComment.findAll({
      where: { 
        story_id: storyId,
        is_approved: true // Only show approved comments
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatarUrl']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Transform the data to match frontend expectations
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      parent_id: comment.parent_id,
      user_id: comment.user_id,
      userName: comment.user?.name || 'Anonymous',
      userImage: comment.user?.avatarUrl || null
    }));

    res.json({
      success: true,
      data: transformedComments,
      message: 'Comments retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Approve comment (untuk host)
 */
const approveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // Find comment and verify if user is the story author
    const comment = await StoryComment.findOne({
      where: { id },
      include: [
        {
          model: Story,
          as: 'story',
          where: { authorId: userId },
          attributes: ['id', 'title', 'authorId']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you do not have permission to approve it'
      });
    }

    // Update comment approval status
    await comment.update({
      is_approved: true
    });

    res.json({
      success: true,
      message: 'Comment approved successfully',
      data: {
        id: comment.id,
        isApproved: true
      }
    });

  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve comment',
      error: error.message
    });
  }
};

/**
 * Delete comment (untuk host)
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // Find comment and verify if user is the story author
    const comment = await StoryComment.findOne({
      where: { id },
      include: [
        {
          model: Story,
          as: 'story',
          where: { authorId: userId },
          attributes: ['id', 'title', 'authorId']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you do not have permission to delete it'
      });
    }

    // Delete comment
    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  updateComment,
  auditCommentRelevance,
  getComments,
  approveComment,
  deleteComment
};
