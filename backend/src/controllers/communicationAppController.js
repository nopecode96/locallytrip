const { CommunicationApp, UserCommunicationContact, User } = require('../models');

const communicationAppController = {
  // Get all active communication apps
  async getAllApps(req, res) {
    try {
      const apps = await CommunicationApp.findAll({
        where: {
          isActive: true
        },
        order: [['sortOrder', 'ASC'], ['displayName', 'ASC']]
      });

      res.json({
        success: true,
        data: apps,
        message: 'Communication apps retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching communication apps:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch communication apps',
        error: error.message
      });
    }
  },

  // Get user's communication contacts
  async getUserContacts(req, res) {
    try {
      const { userId } = req.params;
      const { includePrivate = false } = req.query;

      // Check if requesting own contacts or if admin
      const canViewPrivate = req.user && (req.user.id == userId || req.user.role === 'admin');

      const whereClause = {
        userId: userId
      };

      // Filter by public contacts unless viewing own or admin
      if (!canViewPrivate || includePrivate === 'false') {
        whereClause.isPublic = true;
      }

      const contacts = await UserCommunicationContact.findAll({
        where: whereClause,
        include: [{
          model: CommunicationApp,
          as: 'app',
          where: { isActive: true }
        }],
        order: [
          ['isPreferred', 'DESC'],
          [{ model: CommunicationApp, as: 'app' }, 'sortOrder', 'ASC']
        ]
      });

      res.json({
        success: true,
        data: contacts,
        message: 'User communication contacts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching user communication contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user communication contacts',
        error: error.message
      });
    }
  },

  // Add or update user communication contact
  async addOrUpdateUserContact(req, res) {
    try {
      const { userId } = req.params;
      const { communicationAppId, contactValue, isPreferred = false, isPublic = true } = req.body;

      // Check if user can modify this contact (own account or admin)
      if (!req.user || (req.user.id != userId && req.user.role !== 'admin')) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to modify this user\'s contacts'
        });
      }

      // Validate communication app exists
      const app = await CommunicationApp.findByPk(communicationAppId);
      if (!app || !app.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Invalid communication app'
        });
      }

      // If setting as preferred, unset other preferred contacts for this user
      if (isPreferred) {
        await UserCommunicationContact.update(
          { isPreferred: false },
          { where: { userId: userId } }
        );
      }

      // Create or update contact
      const [contact, created] = await UserCommunicationContact.upsert({
        userId: userId,
        communicationAppId: communicationAppId,
        contactValue: contactValue,
        isPreferred: isPreferred,
        isPublic: isPublic
      }, {
        returning: true
      });

      // Fetch with app details
      const contactWithApp = await UserCommunicationContact.findByPk(contact.id, {
        include: [{
          model: CommunicationApp,
          as: 'app'
        }]
      });

      res.json({
        success: true,
        data: contactWithApp,
        message: created ? 'Communication contact added successfully' : 'Communication contact updated successfully'
      });
    } catch (error) {
      console.error('Error adding/updating user communication contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add/update communication contact',
        error: error.message
      });
    }
  },

  // Delete user communication contact
  async deleteUserContact(req, res) {
    try {
      const { userId, contactId } = req.params;

      // Check if user can modify this contact (own account or admin)
      if (!req.user || (req.user.id != userId && req.user.role !== 'admin')) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to modify this user\'s contacts'
        });
      }

      const contact = await UserCommunicationContact.findOne({
        where: {
          id: contactId,
          userId: userId
        }
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Communication contact not found'
        });
      }

      await contact.destroy();

      res.json({
        success: true,
        message: 'Communication contact deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user communication contact:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete communication contact',
        error: error.message
      });
    }
  },

  // Generate contact link using URL pattern
  generateContactLink(app, contactValue) {
    if (!app.urlPattern) {
      return null;
    }

    let link = app.urlPattern;
    
    // Replace common placeholders
    link = link.replace('{username}', contactValue);
    link = link.replace('{phone}', contactValue);
    link = link.replace('{lineid}', contactValue);
    link = link.replace('{zaloid}', contactValue);
    link = link.replace('{userid}', contactValue);
    
    return link;
  },

  // Get formatted contacts for display (with generated links)
  async getFormattedUserContacts(req, res) {
    try {
      const { userId } = req.params;
      const { includePrivate = false } = req.query;

      // Check if requesting own contacts or if admin
      const canViewPrivate = req.user && (req.user.id == userId || req.user.role === 'admin');

      const whereClause = {
        userId: userId
      };

      // Filter by public contacts unless viewing own or admin
      if (!canViewPrivate || includePrivate === 'false') {
        whereClause.isPublic = true;
      }

      const contacts = await UserCommunicationContact.findAll({
        where: whereClause,
        include: [{
          model: CommunicationApp,
          as: 'app',
          where: { isActive: true }
        }],
        order: [
          ['isPreferred', 'DESC'],
          [{ model: CommunicationApp, as: 'app' }, 'sortOrder', 'ASC']
        ]
      });

      // Format with generated links
      const formattedContacts = contacts.map(contact => ({
        id: contact.id,
        app: contact.app,
        contactValue: contact.contactValue,
        isPreferred: contact.isPreferred,
        isPublic: contact.isPublic,
        contactLink: communicationAppController.generateContactLink(contact.app, contact.contactValue),
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }));

      res.json({
        success: true,
        data: formattedContacts,
        message: 'Formatted user communication contacts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching formatted user communication contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch formatted user communication contacts',
        error: error.message
      });
    }
  }
};

module.exports = communicationAppController;
