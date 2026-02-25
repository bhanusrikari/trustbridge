const express = require('express');
const { createPost, getAllPosts, likePost, addComment } = require('../controllers/forumController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware, createPost); // Create post
router.put('/:id/like', authMiddleware, likePost); // Like a post
router.post('/:id/comment', authMiddleware, addComment); // Add comment
router.get('/', getAllPosts); // Get all posts

module.exports = router;
