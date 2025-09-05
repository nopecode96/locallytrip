const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');
    
    // Create uploads directory if it doesn't exist
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files at once
  }
});

const imageController = {
  // Upload single image
  uploadSingle: (fieldName) => {
    return [
      upload.single(fieldName),
      async (req, res) => {
        try {
          if (!req.file) {
            return res.status(400).json({
              success: false,
              message: 'No file uploaded'
            });
          }

          const imageUrl = `/uploads/${req.file.filename}`;
          
          res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
              filename: req.file.filename,
              originalName: req.file.originalname,
              url: imageUrl,
              size: req.file.size,
              mimetype: req.file.mimetype
            }
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
          });
        }
      }
    ];
  },

  // Upload multiple images
  uploadMultiple: (fieldName, maxCount = 5) => {
    return [
      upload.array(fieldName, maxCount),
      async (req, res) => {
        try {
          if (!req.files || req.files.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No files uploaded'
            });
          }

          const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            url: `/uploads/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype
          }));

          res.status(200).json({
            success: true,
            message: `${req.files.length} images uploaded successfully`,
            data: uploadedFiles
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
          });
        }
      }
    ];
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      const filePath = path.join(__dirname, '../public/uploads', filename);
      
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        
        res.status(200).json({
          success: true,
          message: 'Image deleted successfully'
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting image',
        error: error.message
      });
    }
  },

  // Get image info
  getImageInfo: async (req, res) => {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      const filePath = path.join(__dirname, '../public/uploads', filename);
      
      try {
        const stats = await fs.stat(filePath);
        
        res.status(200).json({
          success: true,
          data: {
            filename: filename,
            url: `/uploads/${filename}`,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          }
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting image info',
        error: error.message
      });
    }
  }
};

module.exports = imageController;
