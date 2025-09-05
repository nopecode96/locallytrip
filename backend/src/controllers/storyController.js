const { Story, User, City, StoryLike, StoryComment } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

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

    // Handle cover image
    let coverImage = null;
    if (req.file) {
      coverImage = `/images/stories/${req.file.filename}`;
    }

    // Calculate reading time
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const wordCount = textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Prepare story data
    const storyData = {
      title,
      slug: finalSlug,
      content,
      excerpt,
      authorId: req.user.userId, // Use userId from req.user
      cityId: cityId || null,
      coverImage,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      keywords: parsedTags.join(', '),
      tags: parsedTags,
      readingTime,
      language: 'en',
      status,
      isActive: true,
      isFeatured: false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      publishedAt: status === 'published' ? new Date() : (publishedAt ? new Date(publishedAt) : null),
    };

    console.log('Creating story with data:', {
      ...storyData,
      content: `${storyData.content.substring(0, 100)}...`,
      authorId: storyData.authorId
    });

    // Create the story
    const story = await Story.create(storyData);

    console.log('✅ Story created successfully:', {
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
          attributes: ['id', 'firstName', 'lastName', 'avatar']
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
      authorId
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

    const offset = (page - 1) * limit;

    const { count, rows: stories } = await Story.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name']
        },
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id'], // Only count, not full data
        },
        {
          model: StoryLike,
          as: 'likes',
          attributes: ['id'], // Only count, not full data
        }
      ],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / limit);

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
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        hasMore: page < totalPages
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
