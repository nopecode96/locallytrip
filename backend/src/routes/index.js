const express = require('express');
const authRoutes = require('./authRoutes');
const auditRoutes = require('./audit');
const experienceRoutes = require('./experienceRoutes');
const bookingRoutes = require('./bookingRoutes');
const hostRoutes = require('./hostRoutes');
const hostDashboardRoutes = require('./hostDashboardRoutes');
const storyRoutes = require('./storyRoutes');
const commentRoutes = require('./commentRoutes');
const validationRoutes = require('./validationRoutes');
const faqRoutes = require('./faqRoutes');
const cityRoutes = require('./cityRoutes');
const featuredHostRoutes = require('./featuredHostRoutes');
const featuredTestimonialRoutes = require('./featuredTestimonialRoutes');
const reviewRoutes = require('./reviewRoutes');
const languageRoutes = require('./languageRoutes');
const userLanguageRoutes = require('./userLanguageRoutes');
const itineraryRoutes = require('./itineraryRoutes');
const emailTestRoutes = require('./emailTest');
const newsletterRoutes = require('./newsletterRoutes');
const paymentRoutes = require('./paymentRoutes');
const notificationRoutes = require('./notificationRoutes');
const communicationAppRoutes = require('./communicationApps');
const bookingContactRoutes = require('./bookingContacts');
const adminRoutes = require('./admin');
const { HostCategory, ExperienceType } = require('../models');
// const imageRoutes = require('./imageRoutes');

const router = express.Router();

// Admin API Routes (untuk web-admin) - MENGGUNAKAN STRUKTUR FOLDER ADMIN
router.use('/admin', adminRoutes);

// Public API Routes (untuk web frontend) - TETAP MENGGUNAKAN STRUKTUR NORMAL
router.use('/auth', authRoutes);
router.use('/audit', auditRoutes);
router.use('/experiences', experienceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/bookings', bookingContactRoutes);
router.use('/hosts', hostRoutes);
router.use('/hosts', hostDashboardRoutes); // Dashboard routes for hosts
router.use('/stories', storyRoutes);
router.use('/comments', commentRoutes);
router.use('/validation', validationRoutes);
router.use('/faqs', faqRoutes);
router.use('/cities', cityRoutes);
router.use('/featured-hosts', featuredHostRoutes);
router.use('/featured-testimonials', featuredTestimonialRoutes);
router.use('/reviews', reviewRoutes);
router.use('/languages', languageRoutes);
router.use('/user-languages', userLanguageRoutes);
router.use('/itinerary', itineraryRoutes);
router.use('/email-test', emailTestRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/communication', communicationAppRoutes);
// router.use('/images', imageRoutes);

// Host Categories Route
router.get('/host-categories', async (req, res) => {
  try {
    const categories = await HostCategory.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'description', 'icon'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch host categories'
    });
  }
});

// Experience Types Route
router.get('/experience-types', async (req, res) => {
  try {
    const types = await ExperienceType.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'description', 'icon', 'color'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience types'
    });
  }
});

// API Info
router.get('/', (req, res) => {
  res.json({
    message: 'LocallyTrip.com API - Ready to make your trips epic! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      experiences: '/experiences',
      bookings: '/bookings',
      hosts: '/hosts',
      stories: '/stories',
      cities: '/cities',
      faqs: '/faqs',
      reviews: '/reviews',
      'host-categories': '/host-categories',
      'featured-hosts': '/featured-hosts',
      'featured-testimonials': '/featured-testimonials'
    }
  });
});

module.exports = router;
