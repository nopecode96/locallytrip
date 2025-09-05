const express = require('express');
const { StoryComment, Story, User } = require('../models');
const { validateBulkComments, extractStoryKeywords, validateCommentRelevance } = require('../middleware/commentValidation');

const router = express.Router();

/**
 * Test validation terhadap existing comments
 */
router.get('/test-validation', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    
    
    // Get sample comments dengan story data
    const comments = await StoryComment.findAll({
      include: [
        {
          model: Story,
          as: 'story',
          attributes: ['id', 'title', 'content', 'tags', 'excerpt'],
          required: true
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          required: true
        }
      ],
      limit: parseInt(limit),
      order: [['created_at', 'DESC']]
    });
    
    
    
    const results = [];
    
    for (const comment of comments) {
      const storyKeywords = extractStoryKeywords(comment.story);
      const validation = validateCommentRelevance(comment.content, storyKeywords);
      
      results.push({
        commentId: comment.id,
        storyId: comment.story.id,
        storyTitle: comment.story.title,
        userName: comment.user.name,
        commentPreview: comment.content.substring(0, 100) + '...',
        storyKeywords: storyKeywords.slice(0, 10), // First 10 keywords
        validation: validation,
        status: validation.isValid ? 
          (validation.confidence >= 0.5 ? 'GOOD' : 'ACCEPTABLE') : 
          'FLAGGED'
      });
    }
    
    // Summary statistics
    const goodComments = results.filter(r => r.status === 'GOOD').length;
    const acceptableComments = results.filter(r => r.status === 'ACCEPTABLE').length;
    const flaggedComments = results.filter(r => r.status === 'FLAGGED').length;
    
    const summary = {
      totalComments: results.length,
      good: goodComments,
      acceptable: acceptableComments, 
      flagged: flaggedComments,
      goodPercentage: ((goodComments / results.length) * 100).toFixed(2),
      flaggedPercentage: ((flaggedComments / results.length) * 100).toFixed(2),
      averageConfidence: (results.reduce((sum, r) => sum + (r.validation.confidence || 0), 0) / results.length).toFixed(3)
    };
    
    
    
    res.json({
      success: true,
      message: 'Comment validation test completed',
      summary: summary,
      results: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to test validation',
      error: error.message
    });
  }
});

/**
 * Test single comment validation
 */
router.post('/test-single', async (req, res) => {
  try {
    const { story_id, content } = req.body;
    
    if (!story_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'story_id and content are required'
      });
    }
    
    const story = await Story.findByPk(story_id, {
      attributes: ['id', 'title', 'content', 'tags', 'excerpt']
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    const storyKeywords = extractStoryKeywords(story);
    const validation = validateCommentRelevance(content, storyKeywords);
    
    res.json({
      success: true,
      storyInfo: {
        id: story.id,
        title: story.title,
        keywords: storyKeywords
      },
      commentContent: content,
      validation: validation,
      recommendation: validation.isValid ? 
        (validation.confidence >= 0.5 ? 'Approve' : 'Review') : 
        'Reject'
    });
    
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to test comment',
      error: error.message
    });
  }
});

/**
 * Get validation keywords untuk debugging
 */
router.get('/keywords', (req, res) => {
  const { LOCATION_KEYWORDS, THEME_KEYWORDS } = require('../middleware/commentValidation');
  
  res.json({
    success: true,
    locationKeywords: LOCATION_KEYWORDS,
    themeKeywords: THEME_KEYWORDS,
    usage: {
      testSingleComment: 'POST /validation/test-single',
      testExistingComments: 'GET /validation/test-validation?limit=20',
      auditComments: 'GET /comments/audit'
    }
  });
});

module.exports = router;
