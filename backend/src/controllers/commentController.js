const { StoryComment, User, Story } = require('../models');
const { validateCommentRelevance, extractStoryKeywords } = require('../middleware/commentValidation');

/**
 * Create new comment dengan validasi
 */
const createComment = async (req, res) => {
  try {
    const { story_id, content, parent_id } = req.body;
    const user_id = req.user?.id; // Assuming auth middleware provides user
    
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
      parent_id: parent_id || null
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

module.exports = {
  createComment,
  updateComment,
  auditCommentRelevance
};
