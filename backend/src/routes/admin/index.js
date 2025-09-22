const express = require('express');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');
const storyRoutes = require('./storyRoutes');
const commentRoutes = require('./commentRoutes');
const experienceTypesRoutes = require('./experienceTypesRoutes');

const router = express.Router();

// Admin API routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/stories', storyRoutes);
router.use('/comments', commentRoutes);
router.use('/experience-types', experienceTypesRoutes);

// Health check for admin API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
