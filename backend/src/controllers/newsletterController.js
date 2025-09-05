const { Newsletter, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const crypto = require('crypto');
const emailService = require('../services/emailService');

const newsletterController = {
  // Subscribe to newsletter (for guest users or logged-in users)
  subscribe: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Newsletter validation errors:', {
          body: req.body,
          errors: errors.array(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, name, categories = [], frequency = 'weekly', source = 'homepage' } = req.body;
      const userId = req.user?.id || null;
      
      console.log('Newsletter subscription data:', {
        body: req.body,
        extracted: { email, name, categories, frequency, source, userId }
      });

      // Check if email already subscribed
      const existingSubscription = await Newsletter.findOne({
        where: { email: email.toLowerCase().trim() }
      });

      if (existingSubscription) {
        // If already subscribed and active
        if (existingSubscription.isSubscribed) {
          return res.status(409).json({
            success: false,
            message: 'This email is already subscribed to our newsletter'
          });
        }
        
        // Reactivate if previously unsubscribed
        await existingSubscription.update({
          isSubscribed: true,
          unsubscribedAt: null,
          subscriptionSource: source,
          subscribedAt: new Date(),
          // Reset verification for guest users
          ...((!existingSubscription.userId && !existingSubscription.isVerified) && {
            verificationToken: crypto.randomBytes(32).toString('hex')
          })
        });

        // Send verification email for guest resubscribers
        if (!existingSubscription.userId && !existingSubscription.isVerified) {
          await emailService.sendNewsletterVerification(
            email, 
            name || 'Friend', 
            existingSubscription.verificationToken
          );
        }

        return res.json({
          success: true,
          message: existingSubscription.userId 
            ? 'Newsletter subscription reactivated successfully!' 
            : 'Please check your email to confirm your subscription',
          data: {
            requiresVerification: !existingSubscription.userId && !existingSubscription.isVerified
          }
        });
      }

      // Create new subscription
      const subscriptionData = {
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        categories: Array.isArray(categories) ? categories : [],
        frequency: frequency,
        userId,
        subscriptionSource: source,
        unsubscribeToken: crypto.randomBytes(32).toString('hex')
      };

      // For guest users, add verification token
      if (!userId) {
        subscriptionData.verificationToken = crypto.randomBytes(32).toString('hex');
        subscriptionData.isVerified = false;
      } else {
        // Auto-verify for logged-in users
        subscriptionData.isVerified = true;
        subscriptionData.verifiedAt = new Date();
      }

      const newsletter = await Newsletter.create(subscriptionData);

      // Send appropriate email
      if (userId) {
        // Send welcome email for logged-in users
        const user = await User.findByPk(userId);
        await emailService.sendNewsletterWelcome(email, user?.name || name || 'Friend');
      } else {
        // Send verification email for guest users
        await emailService.sendNewsletterVerification(
          email, 
          name || 'Friend', 
          newsletter.verificationToken
        );
      }

      res.status(201).json({
        success: true,
        message: userId 
          ? 'Successfully subscribed to newsletter!' 
          : 'Please check your email to confirm your subscription',
        data: {
          requiresVerification: !userId,
          subscriptionId: newsletter.id
        }
      });

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to subscribe to newsletter. Please try again.',
        error: error.message
      });
    }
  },

  // Verify newsletter subscription (for guest users)
  verifySubscription: async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      const newsletter = await Newsletter.findOne({
        where: { 
          verificationToken: token,
          isSubscribed: true
        }
      });

      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      if (newsletter.isVerified) {
        return res.json({
          success: true,
          message: 'Email is already verified!'
        });
      }

      // Verify the subscription
      await newsletter.update({
        isVerified: true,
        verifiedAt: new Date(),
        verificationToken: null
      });

      // Send welcome email
      await emailService.sendNewsletterWelcome(
        newsletter.email, 
        newsletter.name || 'Friend'
      );

      res.json({
        success: true,
        message: 'Email verified successfully! Welcome to LocallyTrip newsletter!'
      });

    } catch (error) {
      console.error('Newsletter verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify subscription. Please try again.',
        error: error.message
      });
    }
  },

  // Unsubscribe from newsletter
  unsubscribe: async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Unsubscribe token is required'
        });
      }

      const newsletter = await Newsletter.findOne({
        where: { 
          unsubscribeToken: token,
          isSubscribed: true
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: 'Invalid unsubscribe link or already unsubscribed'
        });
      }

      // Unsubscribe
      await newsletter.update({
        isSubscribed: false,
        unsubscribedAt: new Date()
      });

      // Send confirmation email
      await emailService.sendNewsletterUnsubscribeConfirmation(
        newsletter.email,
        newsletter.user?.name || newsletter.name || 'Friend'
      );

      res.json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });

    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe. Please try again.',
        error: error.message
      });
    }
  },

  // Get newsletter statistics (Admin only)
  getStats: async (req, res) => {
    try {
      const [
        totalSubscribers,
        activeSubscribers, 
        verifiedSubscribers,
        userSubscribers,
        guestSubscribers,
        recentSubscriptions
      ] = await Promise.all([
        Newsletter.count(),
        Newsletter.count({ where: { isSubscribed: true } }),
        Newsletter.count({ where: { isSubscribed: true, isVerified: true } }),
        Newsletter.count({ where: { isSubscribed: true, userId: { [Op.not]: null } } }),
        Newsletter.count({ where: { isSubscribed: true, userId: null } }),
        Newsletter.count({
          where: {
            isSubscribed: true,
            subscribedAt: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        })
      ]);

      // Subscription sources breakdown
      const sourceStats = await Newsletter.findAll({
        attributes: [
          'subscriptionSource',
          [Newsletter.sequelize.fn('COUNT', Newsletter.sequelize.col('id')), 'count']
        ],
        where: { isSubscribed: true },
        group: ['subscriptionSource']
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalSubscribers,
            activeSubscribers,
            verifiedSubscribers,
            userSubscribers,
            guestSubscribers,
            recentSubscriptions
          },
          sourceBreakdown: sourceStats.map(stat => ({
            source: stat.subscriptionSource,
            count: parseInt(stat.dataValues.count)
          }))
        }
      });

    } catch (error) {
      console.error('Newsletter stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get newsletter statistics',
        error: error.message
      });
    }
  },

  // Get user's newsletter subscription status
  getUserSubscription: async (req, res) => {
    try {
      const userId = req.user.id;

      const subscription = await Newsletter.findOne({
        where: { userId },
        attributes: ['id', 'isSubscribed', 'isVerified', 'preferences', 'subscribedAt']
      });

      res.json({
        success: true,
        data: {
          isSubscribed: !!subscription?.isSubscribed,
          subscription: subscription || null
        }
      });

    } catch (error) {
      console.error('Get user subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription status',
        error: error.message
      });
    }
  },

  // Update user's newsletter preferences
  updatePreferences: async (req, res) => {
    try {
      const userId = req.user.id;
      const { preferences, isSubscribed } = req.body;

      let subscription = await Newsletter.findOne({
        where: { userId }
      });

      if (!subscription) {
        // Create subscription if doesn't exist
        const user = await User.findByPk(userId);
        subscription = await Newsletter.create({
          email: user.email,
          userId,
          isSubscribed: isSubscribed !== undefined ? isSubscribed : true,
          isVerified: true,
          verifiedAt: new Date(),
          preferences: preferences || {},
          subscriptionSource: 'user_settings'
        });
      } else {
        // Update existing subscription
        const updateData = {};
        if (preferences) updateData.preferences = preferences;
        if (isSubscribed !== undefined) {
          updateData.isSubscribed = isSubscribed;
          if (isSubscribed && !subscription.isSubscribed) {
            updateData.subscribedAt = new Date();
            updateData.unsubscribedAt = null;
          } else if (!isSubscribed && subscription.isSubscribed) {
            updateData.unsubscribedAt = new Date();
          }
        }

        await subscription.update(updateData);
      }

      res.json({
        success: true,
        message: 'Newsletter preferences updated successfully',
        data: {
          subscription: {
            uuid: subscription.uuid,
            isSubscribed: subscription.isSubscribed,
            preferences: subscription.preferences
          }
        }
      });

    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update newsletter preferences',
        error: error.message
      });
    }
  }
};

module.exports = newsletterController;
