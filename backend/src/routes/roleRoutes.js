const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

// Get all active roles
router.get('/', roleController.getRoles);

module.exports = router;