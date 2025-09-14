const express = require('express');
const router = express.Router();
const communicationAppController = require('../controllers/communicationAppController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/apps', communicationAppController.getAllApps);
router.get('/users/:userId/contacts', communicationAppController.getUserContacts);
router.get('/users/:userId/contacts/formatted', communicationAppController.getFormattedUserContacts);

// Protected routes
router.post('/users/:userId/contacts', authenticateToken, communicationAppController.addOrUpdateUserContact);
router.delete('/users/:userId/contacts/:contactId', authenticateToken, communicationAppController.deleteUserContact);

module.exports = router;
