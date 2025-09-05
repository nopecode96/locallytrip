const express = require('express');
const { Story, User, City, Country, StoryLike, StoryComment } = require('../models');
const { Op } = require('sequelize');
const { createStoryWithUpload, createStory, getMyStories, getAllStories } = require('../controllers/storyController');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for story updates
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

const router = express.Router();

// GET /api/stories - Get all stories with filters
router.get('/', async (req, res) => {
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

    // Filter by category (if categories are in tags)
    if (category) {
      whereClause.tags = {
        [Op.contains]: [category]
      };
    }

    // Pagination
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    // Order by creation date or featured status
    let order = [['createdAt', 'DESC']];
    if (featured === 'true') {
      order = [['createdAt', 'DESC']];
    }

    const stories = await Story.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url'],
          required: true
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }],
          required: false
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
      order,
      limit: pageSize,
      offset,
      attributes: [
        'id',
        'title',
        'slug',
        'excerpt',
        'coverImage',
        'readingTime',
        'viewCount',
        'createdAt'
      ]
    });

    // Transform data for frontend
    const transformedStories = stories.map(story => {
      const storyData = story.toJSON();
      return {
        id: storyData.id,
        title: storyData.title,
        slug: storyData.slug,
        excerpt: storyData.excerpt || '',
        image: storyData.coverImage || 'default.jpg',  // Only filename, let frontend handle path
        readingTime: storyData.readingTime || 5,
        views: storyData.viewCount || 0,
        likes: storyData.likes ? storyData.likes.length : 0,
        likeCount: storyData.likes ? storyData.likes.length : 0,
        commentsCount: storyData.comments ? storyData.comments.length : 0,
        commentCount: storyData.comments ? storyData.comments.length : 0,
        comments: storyData.comments ? storyData.comments.map(comment => {
          // If comment has content, use it, else fallback to empty string
          return {
            id: comment.id,
            content: comment.content ? comment.content : (comment.dataValues && comment.dataValues.content ? comment.dataValues.content : ''),
            createdAt: comment.createdAt,
            userId: comment.userId
          };
        }) : [],
        publishedAt: storyData.createdAt,
        authorName: storyData.author.name || 'Unknown Author',
        authorImage: storyData.author.avatar_url || 'default.jpg',  // Only filename
        location: storyData.City ? `${storyData.City.name}, ${storyData.City.country?.name}` : 'Unknown'
      };
    });

    res.json({
      success: true,
      data: transformedStories,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total: stories.length,
        hasMore: stories.length === pageSize
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
});

// POST /api/stories - Create a new story (authenticated users only)
router.post('/', authenticateToken, ...createStoryWithUpload);

// GET /api/stories/my-stories - Get current user's stories (MUST be before /:id route)
router.get('/my-stories', authenticateToken, async (req, res) => {
  try {
    console.log('req.user:', JSON.stringify(req.user, null, 2));
    const userId = req.user.userId;
    console.log('userId:', userId);

    

    const stories = await Story.findAll({
      where: {
        author_id: userId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url']
        },
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id']
        },
        {
          model: StoryLike,
          as: 'likes',
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    

    if (!stories || stories.length === 0) {
      return res.json({
        success: true,
        data: [],
        statistics: {
          totalStories: 0,
          totalViews: 0,
          totalComments: 0,
          totalLikes: 0
        }
      });
    }

    const transformedStories = stories.map(story => {
      const storyData = story.toJSON();
      return {
        id: storyData.id,
        title: storyData.title,
        content: storyData.content,
        excerpt: storyData.excerpt,
        slug: storyData.slug,
        featuredImage: storyData.coverImage || 'default.jpg',  // Only filename
        published: storyData.status === 'published',
        viewCount: storyData.viewCount || 0,
        commentCount: storyData.comments ? storyData.comments.length : 0,
        likeCount: storyData.likes ? storyData.likes.length : 0,
        createdAt: storyData.createdAt,
        updatedAt: storyData.updatedAt
      };
    });

    // Calculate statistics
    const statistics = {
      totalStories: transformedStories.length,
      totalViews: transformedStories.reduce((sum, story) => sum + (story.viewCount || 0), 0),
      totalComments: transformedStories.reduce((sum, story) => sum + (story.commentCount || 0), 0),
      totalLikes: transformedStories.reduce((sum, story) => sum + (story.likeCount || 0), 0)
    };

    res.json({
      success: true,
      data: transformedStories,
      statistics
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stories',
      error: error.message
    });
  }
});

// GET /api/stories/slug/:slug - Get single story details by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const story = await Story.findOne({
      where: {
        slug: slug,
        status: 'published',
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url', 'bio'],
          required: true
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }],
          required: false
        },
        {
          model: StoryLike,
          as: 'likes',
          attributes: ['id'],
          required: false
        },
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id', 'content', 'created_at'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar_url'],
            required: true
          }],
          required: false
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Transform data for frontend
    const storyData = story.toJSON();
    const transformedStory = {
      id: storyData.id,
      slug: storyData.slug,
      title: storyData.title,
      content: storyData.content,
      excerpt: storyData.excerpt,
      coverImage: storyData.coverImage || storyData.cover_image,
      images: storyData.images || [],
      readingTime: storyData.reading_time,
      views: storyData.views || 0,
      likesCount: storyData.likes ? storyData.likes.length : 0,
      commentsCount: storyData.comments ? storyData.comments.length : 0,
      comments: storyData.comments ? storyData.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.avatar_url
        }
      })) : [],
      tags: storyData.tags || [],
      keywords: storyData.keywords || [],
      language: storyData.language || 'en',
      createdAt: storyData.createdAt || storyData.created_at,
      updatedAt: storyData.updatedAt || storyData.updated_at,
      author: {
        id: storyData.author.id,
        name: storyData.author.name,
  name: storyData.author.name || '',
        avatar: storyData.author.avatar_url,
        bio: storyData.author.bio
      },
      location: storyData.City ? {
        id: storyData.City.id,
        name: storyData.City.name,
        country: storyData.City.country ? storyData.City.country.name : null
      } : null,
      meta: {
        title: storyData.meta_title || storyData.title,
        description: storyData.meta_description || storyData.excerpt
      }
    };

    // Get related stories
    let relatedStories = [];
    if (storyData.tags && storyData.tags.length > 0) {
      try {
        const relatedStoriesData = await Story.findAll({
          where: {
            id: { [Op.ne]: storyData.id },
            status: 'published',
            isActive: true
          },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['name', 'avatar_url'],
              required: true
            },
            {
              model: City,
              as: 'City',
              attributes: ['id', 'name'],
              include: [{
                model: Country,
                as: 'country',
                attributes: ['id', 'name', 'code']
              }],
              required: false
            }
          ],
          limit: 4,
          order: [['created_at', 'DESC']]
        });

        relatedStories = relatedStoriesData.map(rs => ({
          id: rs.id,
          slug: rs.slug,
          title: rs.title,
          image: rs.coverImage || rs.cover_image || 'default-story.jpg',
          authorName: rs.author.name,
          location: rs.City ? `${rs.City.name}${rs.City.country ? ', ' + rs.City.country.name : ''}` : 'Unknown'
        }));
      } catch (relatedError) {
        
        relatedStories = [];
      }
    }

    transformedStory.relatedStories = relatedStories;

    res.json(transformedStory);

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story',
      error: error.message
    });
  }
});

// GET /api/stories/:id - Get single story details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the parameter is a numeric ID or slug (like experiences)
    const isNumericId = /^\d+$/.test(id);
    
    const whereClause = {
      status: 'published',
      isActive: true
    };
    
    // Search by numeric ID or slug
    if (isNumericId) {
      whereClause.id = parseInt(id);
    } else {
      whereClause.slug = id;
    }

    const story = await Story.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url', 'bio'],
          required: true
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }],
          required: false
        },
        {
          model: StoryLike,
          as: 'likes',
          attributes: ['id'],
          required: false
        },
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id', 'content', 'created_at'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar_url'],
            required: true
          }],
          required: false
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // TODO: Increment view count when views column is added
    // await story.increment('views');

    // Transform data for frontend
    const storyData = story.toJSON();
    // Ambil related stories berdasarkan kategori/tags yang sama, exclude current story
    let relatedStories = [];
    if (storyData.tags && storyData.tags.length > 0) {
      relatedStories = await Story.findAll({
        where: {
          id: { [Op.ne]: storyData.id },
          status: 'published',
          isActive: true
        },
        limit: 3,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['name']
          },
          {
            model: City,
            as: 'City',
            attributes: ['name'],
            include: [{
              model: Country,
              as: 'country',
              attributes: ['name']
            }]
          }
        ],
        attributes: ['id', 'slug', 'title', 'coverImage']
      });
    }
    const transformedStory = {
      id: storyData.id,
      title: storyData.title,
      slug: storyData.slug,
      content: storyData.content,
      excerpt: storyData.excerpt || '',
      coverImage: storyData.coverImage || 'default.jpg',  // Only filename
      images: storyData.images || [],
      readingTime: storyData.readingTime || 5,
      views: storyData.viewCount || 0,
      likesCount: storyData.likes ? storyData.likes.length : 0,
      commentsCount: storyData.comments ? storyData.comments.length : 0,
      comments: storyData.comments ? storyData.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.avatar_url || 'default.jpg'  // Only filename
        }
      })) : [],
      tags: storyData.tags || [],
      keywords: storyData.keywords || [],
      language: storyData.language || 'en',
      createdAt: storyData.createdAt,
      updatedAt: storyData.updatedAt,
      author: {
        id: storyData.author.id,
        name: storyData.author.name,
  name: storyData.author.name || '',
        avatar: storyData.author.avatar_url || 'default.jpg',  // Only filename
        bio: storyData.author.bio
      },
      location: storyData.City ? {
        id: storyData.City.id,
        name: storyData.City.name,
        country: storyData.City.country?.name
      } : null,
      // SEO data
      meta: {
        title: storyData.metaTitle || storyData.title,
        description: storyData.metaDescription || storyData.excerpt
      },
      relatedStories: Array.isArray(relatedStories) ? relatedStories.map(rs => ({
        id: rs.id,
        slug: rs.slug,
        title: rs.title,
        image: rs.coverImage || 'default.jpg',  // Only filename
        authorName: rs.author ? rs.author.name : '',
        location: rs.City ? `${rs.City.name}${rs.City.country ? ', ' + rs.City.country.name : ''}` : ''
      })) : []
    };

    res.json({
      success: true,
      data: transformedStory
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story details',
      error: error.message
    });
  }
});

// PUT /api/stories/:id - Update a story
router.put('/:id', authenticateToken, upload.single('coverImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if the parameter is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const whereClause = {
      isActive: true
    };
    
    // Search by UUID or slug
    if (isUUID) {
      whereClause.id = id;
    } else {
      whereClause.slug = id;
    }

    // Find the story and check ownership
    const story = await Story.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id'],
          required: true
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if the user is the author of the story
    if (story.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own stories'
      });
    }

    // Handle both JSON and FormData requests
    let updateData = {};
    
    if (req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded')) {
      // FormData from frontend
      updateData.title = req.body.title;
      updateData.excerpt = req.body.excerpt;
      updateData.content = req.body.content;
      updateData.language = req.body.language || 'en';
      
      if (req.body.tags) {
        try {
          updateData.tags = JSON.parse(req.body.tags);
        } catch (e) {
          updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
        }
      }
      
      if (req.body.keywords) {
        try {
          updateData.keywords = JSON.parse(req.body.keywords);
        } catch (e) {
          updateData.keywords = req.body.keywords.split(',').map(kw => kw.trim());
        }
      }
      
      if (req.body.cityId) {
        updateData.cityId = req.body.cityId;
      }

      // Handle cover image upload
      if (req.file) {
        const imageFilename = req.file.filename;  // Only store filename
        updateData.coverImage = imageFilename;
      }
    } else {
      // JSON request
      updateData = req.body;
    }

    // Update the story
    await story.update(updateData);

    // Fetch the updated story with all relations
    const updatedStory = await Story.findOne({
      where: { id: story.id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar_url', 'bio'],
          required: true
        },
        {
          model: City,
          as: 'City',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Story updated successfully',
      data: updatedStory
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to update story',
      error: error.message
    });
  }
});

// DELETE /api/stories/:id - Delete a story (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  
  
  
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    

    if (!userId) {
      
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if the parameter is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const whereClause = {
      isActive: true
    };
    
    // Search by UUID or slug
    if (isUUID) {
      whereClause.id = id;
    } else {
      whereClause.slug = id;
    }

    // Find the story and check ownership
    const story = await Story.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id'],
          required: true
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Check if the user is the author of the story
    if (story.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own stories'
      });
    }

    // Perform soft delete by setting isActive to false
    await story.update({
      isActive: false,
      deletedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete story',
      error: error.message
    });
  }
});

// POST /api/stories/:id/like - Like a story
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Increment likes count
    await story.increment('likesCount');

    res.json({
      success: true,
      message: 'Story liked successfully',
      data: {
        likesCount: story.likesCount + 1
      }
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'Failed to like story',
      error: error.message
    });
  }
});

module.exports = router;
