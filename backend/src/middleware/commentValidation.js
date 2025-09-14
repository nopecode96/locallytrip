const { Story } = require('../models');

/**
 * Middleware untuk validasi comment content terhadap story context
 */

// Keywords yang relevan untuk setiap lokasi/tema
const LOCATION_KEYWORDS = {
  'jakarta': ['jakarta', 'jkt', 'kemang', 'tugu', 'betawi', 'kopi kenangan', 'warung kopi', 'cafe', 'coffee'],
  'bali': ['bali', 'ubud', 'denpasar', 'canggu', 'seminyak', 'sekumpul', 'warung', 'temple', 'beach', 'balinese'],
  'bandung': ['bandung', 'saung angklung', 'factory outlet', 'creative', 'mountain', 'rosemarie', 'angklung'],
  'yogyakarta': ['yogya', 'yogyakarta', 'malioboro', 'taman sari', 'batik', 'sultan', 'kraton', 'gudeg'],
  'medan': ['medan', 'soto medan', 'durian', 'chinese', 'indian', 'malay', 'food capital', 'culinary'],
  'solo': ['solo', 'surakarta', 'backpack', 'java', 'cultural', 'traditional', 'exploration'],
  'surabaya': ['surabaya', 'nightlife', 'pasar atom', 'taman bungkul', 'night scene', 'coffee culture', 'electric', 'performances'],
  'singapore': ['singapore', 'singlish', 'hawker', 'diversity', 'multicultural', 'mrt']
};

const THEME_KEYWORDS = {
  'food': ['food', 'culinary', 'eat', 'taste', 'delicious', 'restaurant', 'warung', 'menu', 'flavor'],
  'travel': ['travel', 'journey', 'adventure', 'explore', 'visit', 'destination', 'trip'],
  'culture': ['culture', 'tradition', 'local', 'authentic', 'heritage', 'community', 'experience'],
  'nightlife': ['nightlife', 'night', 'evening', 'club', 'bar', 'music', 'party', 'after dark'],
  'backpacking': ['backpack', 'solo', 'budget', 'hostel', 'adventure', 'journey', 'exploration'],
  'responsible': ['responsible', 'sustainable', 'eco', 'environment', 'conservation', 'community']
};

/**
 * Ekstrak keywords dari story content dan title
 */
function extractStoryKeywords(story) {
  const content = (story.content || '').toLowerCase();
  const title = (story.title || '').toLowerCase();
  const tags = story.tags || [];
  
  // Prioritas: tags > title > content
  const keywords = new Set();
  
  // Add tags dengan highest priority
  tags.forEach(tag => {
    keywords.add(tag.toLowerCase());
  });
  
  // Extract dari title (high priority)
  Object.entries(LOCATION_KEYWORDS).forEach(([location, locationKeywords]) => {
    locationKeywords.forEach(keyword => {
      if (title.includes(keyword.toLowerCase())) {
        keywords.add(location);
        keywords.add(keyword);
      }
    });
  });
  
  Object.entries(THEME_KEYWORDS).forEach(([theme, themeKeywords]) => {
    themeKeywords.forEach(keyword => {
      if (title.includes(keyword.toLowerCase())) {
        keywords.add(theme);
        keywords.add(keyword);
      }
    });
  });
  
  // Extract dari content dengan weight yang lebih rendah
  // Tapi hanya jika belum ada location keywords dari title/tags
  const hasLocationKeywords = Array.from(keywords).some(k => 
    Object.keys(LOCATION_KEYWORDS).includes(k)
  );
  
  if (!hasLocationKeywords) {
    Object.entries(LOCATION_KEYWORDS).forEach(([location, locationKeywords]) => {
      let matchCount = 0;
      locationKeywords.forEach(keyword => {
        if (content.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      });
      
      // Only add location if it appears multiple times in content
      if (matchCount >= 2) {
        keywords.add(location);
        locationKeywords.forEach(keyword => {
          if (content.includes(keyword.toLowerCase())) {
            keywords.add(keyword);
          }
        });
      }
    });
  }
  
  // Always extract theme keywords from content
  Object.entries(THEME_KEYWORDS).forEach(([theme, themeKeywords]) => {
    let matchCount = 0;
    themeKeywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase()) || title.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });
    
    if (matchCount >= 1) {
      keywords.add(theme);
      themeKeywords.forEach(keyword => {
        if (content.includes(keyword.toLowerCase()) || title.includes(keyword.toLowerCase())) {
          keywords.add(keyword);
        }
      });
    }
  });
  
  return Array.from(keywords);
}

/**
 * Validasi apakah comment content relevan dengan story
 */
function validateCommentRelevance(commentContent, storyKeywords) {
  if (!commentContent || typeof commentContent !== 'string') {
    return { isValid: false, reason: 'Comment content is required' };
  }
  
  const commentText = commentContent.toLowerCase();
  const minLength = 10; // Minimum comment length
  
  // Check minimum length
  if (commentContent.trim().length < minLength) {
    return { isValid: false, reason: `Comment must be at least ${minLength} characters long` };
  }
  
  // Check for spam/irrelevant patterns
  const spamPatterns = [
    /(.)\1{4,}/g, // Repeated characters (aaaaa, 11111)
    /^[^a-zA-Z]*$/g, // Only symbols/numbers
    /https?:\/\/[^\s]+/g // URLs (basic check)
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(commentText)) {
      return { isValid: false, reason: 'Comment appears to be spam or contains inappropriate content' };
    }
  }
  
  // If no story keywords available, allow comment (fallback)
  if (!storyKeywords || storyKeywords.length === 0) {
    return { isValid: true, confidence: 0.5 };
  }
  
  // Enhanced relevance checking with weighted scoring
  let relevanceScore = 0;
  let matchedKeywords = [];
  
  // Check for direct keyword matches (improved for multi-word phrases)
  storyKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (commentText.includes(keywordLower)) {
      // Weight different types of matches
      if (Object.keys(LOCATION_KEYWORDS).includes(keyword) || 
          Object.values(LOCATION_KEYWORDS).flat().includes(keyword)) {
        relevanceScore += 3; // Higher weight for location
      } else if (Object.keys(THEME_KEYWORDS).includes(keyword) || 
                 Object.values(THEME_KEYWORDS).flat().includes(keyword)) {
        relevanceScore += 2; // Medium weight for themes
      } else {
        relevanceScore += 1; // Basic weight for other keywords
      }
      matchedKeywords.push(keyword);
    }
  });
  
  // Additional check: if comment mentions location-specific landmarks not in story
  // but story is about that location, consider it relevant
  if (relevanceScore === 0) {
    // Check if comment mentions any location-specific keywords
    Object.entries(LOCATION_KEYWORDS).forEach(([location, locationKeywords]) => {
      locationKeywords.forEach(locationKeyword => {
        if (commentText.includes(locationKeyword.toLowerCase())) {
          // Check if story is about the same location
          const storyMentionsLocation = storyKeywords.some(sk => 
            sk.toLowerCase() === location || 
            LOCATION_KEYWORDS[location].includes(sk.toLowerCase())
          );
          
          if (storyMentionsLocation) {
            relevanceScore += 2; // Medium relevance for location-specific context
            matchedKeywords.push(`${location}-context: ${locationKeyword}`);
          }
        }
      });
    });
  }
  
  
  
  
  
  
  
  // Calculate confidence based on weighted score
  const confidence = Math.min(relevanceScore / 5, 1); // Max confidence 1, based on weighted score
  
  // Generic travel terms as fallback for borderline cases
  const genericTravelTerms = ['amazing', 'awesome', 'great', 'love', 'beautiful', 'incredible', 
                             'experience', 'visit', 'travel', 'thanks', 'inspiring', 'perfect',
                             'wonderful', 'fantastic', 'best', 'recommend'];
  
  const hasGenericTravel = genericTravelTerms.some(term => commentText.includes(term));
  
  // Improved validation logic: more permissive approach
  // Accept if decent score OR has travel terms OR has minimum engagement indicators
  const minEngagementWords = ['the', 'this', 'very', 'really', 'nice', 'good', 'like', 'love', 'great'];
  const hasMinEngagement = minEngagementWords.some(word => commentText.includes(word));
  
  if (confidence >= 0.1 || 
      (hasGenericTravel && matchedKeywords.length > 0) ||
      (hasMinEngagement && commentText.length >= 15)) {
    return { 
      isValid: true, 
      confidence: Math.max(confidence, hasGenericTravel && matchedKeywords.length > 0 ? 0.3 : confidence),
      matchedKeywords 
    };
  }
  
  return { 
    isValid: false, 
    reason: 'Comment content does not appear to be relevant to the story topic',
    confidence: confidence,
    storyKeywords: storyKeywords.slice(0, 5) // Hint for user
  };
}

/**
 * Middleware untuk validasi comment sebelum create/update
 */
const validateCommentMiddleware = async (req, res, next) => {
  try {
    const { story_id, storyId, content } = req.body;
    const finalStoryId = story_id || storyId;
    
    if (!finalStoryId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Story ID and comment content are required',
        validation: { isValid: false, reason: 'Missing required fields' }
      });
    }

    // Basic content validation only
    if (!content.trim() || content.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 3 characters long',
        validation: { isValid: false, reason: 'Comment too short' }
      });
    }

    // Check for obvious spam patterns only
    const spamPatterns = [
      /(.)\1{10,}/g, // Repeated characters (very long sequences)
      /^[^a-zA-Z\s]*$/g // Only symbols/numbers, no letters
    ];
    
    const commentText = content.toLowerCase();
    for (const pattern of spamPatterns) {
      if (pattern.test(commentText)) {
        return res.status(400).json({
          success: false,
          message: 'Comment appears to be spam',
          validation: { isValid: false, reason: 'Spam detected' }
        });
      }
    }

    // Fetch story untuk mendapatkan context (but don't block if not found)
    const story = await Story.findByPk(finalStoryId, {
      attributes: ['id', 'title', 'content', 'tags', 'excerpt']
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
        validation: { isValid: false, reason: 'Story does not exist' }
      });
    }
    
    // Always allow comments - just attach basic validation info
    req.commentValidation = { 
      isValid: true, 
      confidence: 0.8,
      reason: 'Basic validation passed'
    };
    req.storyKeywords = [];
    
    next();
    
  } catch (error) {
    console.error('Validation middleware error:', error);
    // Don't block comment creation on validation errors - log and continue
    req.commentValidation = { isValid: true, confidence: 0.5, error: error.message };
    next();
  }
};

/**
 * Utility function untuk bulk validation (untuk data seeding)
 */
const validateBulkComments = async (comments) => {
  const results = [];
  
  for (const comment of comments) {
    try {
      const story = await Story.findByPk(comment.story_id, {
        attributes: ['id', 'title', 'content', 'tags', 'excerpt']
      });
      
      if (!story) {
        results.push({
          commentId: comment.id,
          isValid: false,
          reason: 'Story not found'
        });
        continue;
      }
      
      const storyKeywords = extractStoryKeywords(story);
      const validation = validateCommentRelevance(comment.content, storyKeywords);
      
      results.push({
        commentId: comment.id,
        storyId: comment.story_id,
        storyTitle: story.title,
        ...validation
      });
      
    } catch (error) {
      results.push({
        commentId: comment.id,
        isValid: false,
        reason: `Validation error: ${error.message}`
      });
    }
  }
  
  return results;
};

module.exports = {
  validateCommentMiddleware,
  validateCommentRelevance,
  extractStoryKeywords,
  validateBulkComments,
  LOCATION_KEYWORDS,
  THEME_KEYWORDS
};
