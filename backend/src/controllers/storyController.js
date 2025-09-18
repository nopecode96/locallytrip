const { Story, User, City, StoryLike, StoryComment } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/images/stories');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `story-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create story
const createStory = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      status = 'draft',
      metaTitle,
      metaDescription,
      tags,
      keywords,
      language = 'en',
      cityId,
      publishedAt
    } = req.body;

    // Debug logging
    console.log('Story creation data:', {
      title,
      cityId: cityId ? parseInt(cityId) : null,
      cityIdType: typeof cityId,
      keywords: keywords,
      keywordsType: typeof keywords,
      tags: tags,
      tagsType: typeof tags
    });

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Parse tags if string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (error) {
        
        parsedTags = [];
      }
    }

    // Parse keywords - handle both JSON string and comma-separated string from multipart
    let parsedKeywords = [];
    if (keywords) {
      try {
        if (typeof keywords === 'string') {
          // Try to parse as JSON first
          try {
            parsedKeywords = JSON.parse(keywords);
          } catch (jsonError) {
            // If JSON parse fails, treat as comma-separated string (from multipart form)
            parsedKeywords = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
          }
        } else if (Array.isArray(keywords)) {
          parsedKeywords = keywords;
        }
        
        // Ensure it's an array
        if (!Array.isArray(parsedKeywords)) {
          parsedKeywords = [];
        }
      } catch (error) {
        parsedKeywords = [];
      }
    }

    // Generate slug
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Story.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const finalSlug = slug;

    // Handle cover image - store filename only
    let coverImage = null;
    if (req.file) {
      coverImage = req.file.filename; // Store filename only, not full path
    }

    // Extract images from content
    const extractImagesFromContent = (content) => {
      const images = [];
      
      // Helper function to extract filename from URL path
      const extractFilename = (url) => {
        // Remove query parameters and fragments
        const cleanUrl = url.split('?')[0].split('#')[0];
        // Extract filename from path
        const filename = cleanUrl.split('/').pop();
        return filename;
      };
      
      // Extract markdown images: ![alt](url)
      const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      while ((match = markdownImageRegex.exec(content)) !== null) {
        const imageUrl = match[2];
        if (imageUrl) {
          const filename = extractFilename(imageUrl);
          if (filename && !images.includes(filename)) {
            images.push(filename);
          }
        }
      }
      
      // Extract HTML img tags: <img src="url">
      const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      while ((match = htmlImageRegex.exec(content)) !== null) {
        const imageUrl = match[1];
        if (imageUrl) {
          const filename = extractFilename(imageUrl);
          if (filename && !images.includes(filename)) {
            images.push(filename);
          }
        }
      }
      
      return images;
    };

    const contentImages = extractImagesFromContent(content);

    // Calculate reading time
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const wordCount = textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Check if user is trusted for auto-publish
    const user = await User.findByPk(req.user.userId, { 
      attributes: ['isTrusted'] 
    });
    
    // Determine final status based on user trust level
    let finalStatus = status;
    if (status === 'published' && !user.isTrusted) {
      finalStatus = 'pending_review';
    }

    // Prepare story data
    const storyData = {
      uuid: uuidv4(), // Generate unique UUID
      title,
      slug: finalSlug,
      content,
      excerpt,
      authorId: req.user.userId, // Use userId from req.user
      cityId: cityId ? parseInt(cityId) : null,
      coverImage,
      images: contentImages, // Store extracted content images
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      keywords: parsedKeywords, // Use proper keywords array, not tags
      tags: parsedTags,
      readingTime,
      language: 'en',
      status: finalStatus,
      isActive: true,
      isFeatured: false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      publishedAt: finalStatus === 'published' ? new Date() : (publishedAt ? new Date(publishedAt) : null),
    };

    console.log('Final story data:', {
      ...storyData,
      content: `${storyData.content.substring(0, 100)}...`,
      authorId: storyData.authorId,
      tags: storyData.tags,
      keywords: storyData.keywords,
      cityId: storyData.cityId
    });

    // Create the story
    const story = await Story.create(storyData);

    console.log('Story created successfully:', {
      id: story.id,
      title: story.title,
      slug: story.slug,
      status: story.status
    });

    // Fetch the created story with associations
    const newStory = await Story.findByPk(story.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatarUrl']
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: newStory,
      message: 'Story created successfully'
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to create story',
      error: error.message
    });
  }
};

// Get my stories
const getMyStories = async (req, res) => {
  try {
    const userId = req.userId;

    

    const stories = await Story.findAll({
      where: {
        authorId: userId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: StoryComment,
          as: 'comments'
        },
        {
          model: StoryLike,
          as: 'likes'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    

    res.json({
      success: true,
      data: stories
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
};

// Get all stories (public)
const getAllStories = async (req, res) => {
  try {
    const {
      featured,
      limit = 10,
      page = 1,
      category,
      search,
      authorId,
      cityId
    } = req.query;
    

    // Build where clause
    let whereClause = {
      status: 'published',
      isActive: true
    };

    // Featured stories
    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by author
    if (authorId) {
      whereClause.authorId = authorId;
    }

    // Filter by city
    if (cityId) {
      whereClause.cityId = parseInt(cityId);
    }

    const offset = (page - 1) * limit;


    // Get total count separately to avoid issues with complex includes
    const totalCount = await Story.count({
      where: whereClause
    });


    // Get stories with all associations
    const stories = await Story.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatarUrl'],
          required: false // LEFT JOIN instead of INNER JOIN
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          required: false // LEFT JOIN instead of INNER JOIN
        },
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id'], // Only count, not full data
          required: false
        },
        {
          model: StoryLike,
          as: 'likes',
          attributes: ['id'], // Only count, not full data
          required: false
        }
      ],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });


    const totalPages = Math.ceil(totalCount / limit);

    // Transform stories to include counts
    const storiesWithCounts = stories.map(story => ({
      ...story.toJSON(),
      commentCount: story.comments ? story.comments.length : 0,
      likeCount: story.likes ? story.likes.length : 0
    }));


    res.json({
      success: true,
      data: storiesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages,
        hasMore: parseInt(page) < totalPages
      }
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
};

module.exports = {
  createStoryWithUpload: [upload.single('coverImage'), createStory],
  createStory,
  getMyStories,
  getAllStories
};
