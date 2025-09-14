const { User, NotificationSettings } = require('../models');

class NotificationController {
  // Get user notification settings
  static async getNotificationSettings(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Get or create notification settings for user
      let settings = await NotificationSettings.findOne({
        where: { userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }]
      });

      // If no settings exist, create default ones
      if (!settings) {
        settings = await NotificationSettings.create({
          userId,
          // Default values are handled by the model
        });

        // Fetch the created settings with user info
        settings = await NotificationSettings.findOne({
          where: { userId },
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'role']
          }]
        });
      }

      // Transform to frontend format
      const notificationPreferences = {
        // Essential notifications
        booking_confirmations: {
          email: settings.bookingConfirmationsEmail,
          push: settings.bookingConfirmationsPush,
          sms: settings.bookingConfirmationsSms
        },
        payment_updates: {
          email: settings.paymentUpdatesEmail,
          push: settings.paymentUpdatesPush,
          sms: settings.paymentUpdatesSms
        },
        messages: {
          email: settings.messagesEmail,
          push: settings.messagesPush,
          sms: settings.messagesSms
        },
        // Update notifications
        reviews: {
          email: settings.reviewsEmail,
          push: settings.reviewsPush,
          sms: settings.reviewsSms
        },
        favorites: {
          email: settings.favoritesEmail,
          push: settings.favoritesPush,
          sms: settings.favoritesSms
        },
        // Marketing notifications
        promotions: {
          email: settings.promotionsEmail,
          push: settings.promotionsPush,
          sms: settings.promotionsSms
        },
        newsletter: {
          email: settings.newsletterEmail,
          push: settings.newsletterPush,
          sms: settings.newsletterSms
        }
      };

      res.json({
        success: true,
        data: {
          preferences: notificationPreferences,
          globalSettings: {
            emailEnabled: settings.emailEnabled,
            pushEnabled: settings.pushEnabled,
            smsEnabled: settings.smsEnabled,
            marketingConsent: settings.marketingConsent,
            marketingConsentDate: settings.marketingConsentDate
          },
          metadata: {
            id: settings.id,
            uuid: settings.uuid,
            userId: settings.userId,
            updatedAt: settings.updatedAt
          }
        }
      });

    } catch (error) {
      console.error('Error fetching notification settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification settings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Update user notification settings
  static async updateNotificationSettings(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      const { preferences, globalSettings } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Validate input
      if (!preferences && !globalSettings) {
        return res.status(400).json({
          success: false,
          message: 'Preferences or global settings must be provided'
        });
      }

      // Find existing settings or create new ones
      let settings = await NotificationSettings.findOne({
        where: { userId }
      });

      if (!settings) {
        settings = await NotificationSettings.create({ userId });
      }

      // Prepare update data
      const updateData = {};

      // Update individual notification preferences
      if (preferences) {
        if (preferences.booking_confirmations) {
          updateData.bookingConfirmationsEmail = preferences.booking_confirmations.email;
          updateData.bookingConfirmationsPush = preferences.booking_confirmations.push;
          updateData.bookingConfirmationsSms = preferences.booking_confirmations.sms;
        }
        if (preferences.payment_updates) {
          updateData.paymentUpdatesEmail = preferences.payment_updates.email;
          updateData.paymentUpdatesPush = preferences.payment_updates.push;
          updateData.paymentUpdatesSms = preferences.payment_updates.sms;
        }
        if (preferences.messages) {
          updateData.messagesEmail = preferences.messages.email;
          updateData.messagesPush = preferences.messages.push;
          updateData.messagesSms = preferences.messages.sms;
        }
        if (preferences.reviews) {
          updateData.reviewsEmail = preferences.reviews.email;
          updateData.reviewsPush = preferences.reviews.push;
          updateData.reviewsSms = preferences.reviews.sms;
        }
        if (preferences.favorites) {
          updateData.favoritesEmail = preferences.favorites.email;
          updateData.favoritesPush = preferences.favorites.push;
          updateData.favoritesSms = preferences.favorites.sms;
        }
        if (preferences.promotions) {
          updateData.promotionsEmail = preferences.promotions.email;
          updateData.promotionsPush = preferences.promotions.push;
          updateData.promotionsSms = preferences.promotions.sms;
        }
        if (preferences.newsletter) {
          updateData.newsletterEmail = preferences.newsletter.email;
          updateData.newsletterPush = preferences.newsletter.push;
          updateData.newsletterSms = preferences.newsletter.sms;
        }
      }

      // Update global settings
      if (globalSettings) {
        if (typeof globalSettings.emailEnabled === 'boolean') {
          updateData.emailEnabled = globalSettings.emailEnabled;
        }
        if (typeof globalSettings.pushEnabled === 'boolean') {
          updateData.pushEnabled = globalSettings.pushEnabled;
        }
        if (typeof globalSettings.smsEnabled === 'boolean') {
          updateData.smsEnabled = globalSettings.smsEnabled;
        }
        if (typeof globalSettings.marketingConsent === 'boolean') {
          updateData.marketingConsent = globalSettings.marketingConsent;
          if (globalSettings.marketingConsent) {
            updateData.marketingConsentDate = new Date();
          }
        }
      }

      // Update settings
      await settings.update(updateData);

      // Fetch updated settings with user info
      const updatedSettings = await NotificationSettings.findOne({
        where: { userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }]
      });

      res.json({
        success: true,
        message: 'Notification settings updated successfully',
        data: {
          preferences: {
            booking_confirmations: {
              email: updatedSettings.bookingConfirmationsEmail,
              push: updatedSettings.bookingConfirmationsPush,
              sms: updatedSettings.bookingConfirmationsSms
            },
            payment_updates: {
              email: updatedSettings.paymentUpdatesEmail,
              push: updatedSettings.paymentUpdatesPush,
              sms: updatedSettings.paymentUpdatesSms
            },
            messages: {
              email: updatedSettings.messagesEmail,
              push: updatedSettings.messagesPush,
              sms: updatedSettings.messagesSms
            },
            reviews: {
              email: updatedSettings.reviewsEmail,
              push: updatedSettings.reviewsPush,
              sms: updatedSettings.reviewsSms
            },
            favorites: {
              email: updatedSettings.favoritesEmail,
              push: updatedSettings.favoritesPush,
              sms: updatedSettings.favoritesSms
            },
            promotions: {
              email: updatedSettings.promotionsEmail,
              push: updatedSettings.promotionsPush,
              sms: updatedSettings.promotionsSms
            },
            newsletter: {
              email: updatedSettings.newsletterEmail,
              push: updatedSettings.newsletterPush,
              sms: updatedSettings.newsletterSms
            }
          },
          globalSettings: {
            emailEnabled: updatedSettings.emailEnabled,
            pushEnabled: updatedSettings.pushEnabled,
            smsEnabled: updatedSettings.smsEnabled,
            marketingConsent: updatedSettings.marketingConsent,
            marketingConsentDate: updatedSettings.marketingConsentDate
          },
          metadata: {
            id: updatedSettings.id,
            uuid: updatedSettings.uuid,
            userId: updatedSettings.userId,
            updatedAt: updatedSettings.updatedAt
          }
        }
      });

    } catch (error) {
      console.error('Error updating notification settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification settings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Reset notification settings to defaults
  static async resetNotificationSettings(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Delete existing settings (will recreate with defaults)
      await NotificationSettings.destroy({
        where: { userId }
      });

      // Create new default settings
      const newSettings = await NotificationSettings.create({
        userId
      });

      res.json({
        success: true,
        message: 'Notification settings reset to defaults',
        data: {
          id: newSettings.id,
          uuid: newSettings.uuid,
          userId: newSettings.userId,
          updatedAt: newSettings.updatedAt
        }
      });

    } catch (error) {
      console.error('Error resetting notification settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset notification settings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = NotificationController;
