const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { authenticateToken } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Upload routes (protected)
router.post('/upload/single/:type', 
  authenticateToken, 
  (req, res, next) => {
    const allowedTypes = ['avatar', 'experience', 'cover', 'story'];
    if (!allowedTypes.includes(req.params.type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload type. Allowed: ' + allowedTypes.join(', ')
      });
    }
    next();
  },
  ...imageController.uploadSingle('image')
);

router.post('/upload/multiple/experience', 
  authenticateToken, 
  requireRole(['host']),
  ...imageController.uploadMultiple('images', 10)
);

// Delete image (protected)
router.delete('/delete/:filename', 
  authenticateToken, 
  imageController.deleteImage
);

// Get image info (public)
router.get('/info/:filename', imageController.getImageInfo);

// Static image serving is handled by express.static in server.js
// Routes: 
// GET /images/* - serves from backend/public/images/
// GET /uploads/* - serves from backend/public/uploads/

module.exports = router;
