const express = require('express');
const { createComment, updateComment, auditCommentRelevance, getComments, approveComment, deleteComment } = require('../controllers/commentController');
const { validateCommentMiddleware } = require('../middleware/commentValidation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get comments for a story
router.get('/', getComments);

// Create new comment dengan validasi
router.post('/', authenticateToken, validateCommentMiddleware, createComment);

// Update existing comment dengan validasi
router.put('/:id', authenticateToken, validateCommentMiddleware, updateComment);

// Admin endpoint untuk audit comment relevance
router.get('/audit', auditCommentRelevance);

// Approve comment (untuk host)
router.put('/:id/approve', authenticateToken, approveComment);

// Delete comment (untuk host)
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;
