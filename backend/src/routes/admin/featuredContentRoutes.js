const express = require('express');
const router = express.Router();
const { 
  FeaturedExperience, 
  FeaturedCity, 
  FeaturedStory, 
  FeaturedHost, 
  FeaturedTestimonial,
  Experience,
  City,
  Story,
  User
} = require('../../models');

// GET /api/admin/featured-content - Get all featured content for admin dashboard
router.get('/', async (req, res) => {
  try {
    const [experiences, cities, stories, hosts, testimonials] = await Promise.all([
      FeaturedExperience.findAll({
        where: { isActive: true },
        include: [{
          model: Experience,
          as: 'experience',
          attributes: ['id', 'uuid', 'title', 'images']
        }],
        order: [['displayOrder', 'ASC']]
      }),
      FeaturedCity.findAll({
        where: { isActive: true },
        include: [{
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'imageUrl']
        }],
        order: [['displayOrder', 'ASC']]
      }),
      FeaturedStory.findAll({
        where: { isActive: true },
        include: [{
          model: Story,
          as: 'story',
          attributes: ['id', 'uuid', 'title', 'coverImage']
        }],
        order: [['displayOrder', 'ASC']]
      }),
      FeaturedHost.findAll({
        where: { isActive: true },
        include: [{
          model: User,
          as: 'host',
          attributes: ['id', 'uuid', 'name', 'avatarUrl']
        }],
        order: [['displayOrder', 'ASC']]
      }),
      FeaturedTestimonial.findAll({
        where: { isActive: true },
        include: [{
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'avatar_url']
        }],
        order: [['displayOrder', 'ASC']]
      })
    ]);

    res.json({
      success: true,
      data: {
        experiences: experiences.map(item => ({
          id: item.id,
          title: item.title || item.experience?.title,
          description: item.description,
          badge: item.badge,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
          type: 'experience',
          itemId: item.experience?.uuid,
          imageUrl: item.featuredImageUrl || (Array.isArray(item.experience?.images) ? item.experience.images[0] : item.experience?.images)
        })),
        cities: cities.map(item => ({
          id: item.id,
          title: item.title || item.city?.name,
          description: item.description,
          badge: item.badge,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
          type: 'city',
          itemId: item.city?.id,
          imageUrl: item.featuredImageUrl || item.city?.imageUrl
        })),
        stories: stories.map(item => ({
          id: item.id,
          title: item.title || item.story?.title,
          description: item.description,
          badge: item.badge,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
          type: 'story',
          itemId: item.story?.uuid,
          imageUrl: item.featuredImageUrl || item.story?.coverImage
        })),
        hosts: hosts.map(item => ({
          id: item.id,
          title: item.title || item.host?.name,
          description: item.description,
          badge: item.badge,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
          type: 'host',
          itemId: item.host?.uuid,
          imageUrl: item.featuredImageUrl || item.host?.avatarUrl
        })),
        testimonials: testimonials.map(item => ({
          id: item.id,
          title: item.title || 'Testimonial',
          description: item.testimonialText,
          badge: item.badge,
          displayOrder: item.displayOrder,
          isActive: item.isActive,
          type: 'testimonial',
          itemId: item.id,
          reviewerName: item.reviewerName
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured content',
      error: error.message
    });
  }
});

// POST /api/admin/featured-content/reorder - Update display order for featured items
router.post('/reorder', async (req, res) => {
  try {
    const { type, items } = req.body; // items: [{ id, displayOrder }]

    let Model;
    switch (type) {
      case 'experience':
        Model = FeaturedExperience;
        break;
      case 'city':
        Model = FeaturedCity;
        break;
      case 'story':
        Model = FeaturedStory;
        break;
      case 'host':
        Model = FeaturedHost;
        break;
      case 'testimonial':
        Model = FeaturedTestimonial;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type specified'
        });
    }

    // Update display order for each item
    await Promise.all(
      items.map(item => 
        Model.update(
          { displayOrder: item.displayOrder },
          { where: { id: item.id } }
        )
      )
    );

    res.json({
      success: true,
      message: `${type} display order updated successfully`
    });

  } catch (error) {
    console.error('Error updating display order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update display order',
      error: error.message
    });
  }
});

// DELETE /api/admin/featured-content/:type/:id - Remove item from featured list
router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;

    let Model;
    switch (type) {
      case 'experience':
        Model = FeaturedExperience;
        break;
      case 'city':
        Model = FeaturedCity;
        break;
      case 'story':
        Model = FeaturedStory;
        break;
      case 'host':
        Model = FeaturedHost;
        break;
      case 'testimonial':
        Model = FeaturedTestimonial;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type specified'
        });
    }

    const item = await Model.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Featured ${type} not found`
      });
    }

    await item.update({ isActive: false });

    res.json({
      success: true,
      message: `${type} removed from featured list`
    });

  } catch (error) {
    console.error('Error removing featured item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove featured item',
      error: error.message
    });
  }
});

module.exports = router;