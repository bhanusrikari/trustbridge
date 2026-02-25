const express = require('express');
const { sendMessage, getChatHistory, getConversations, getUnreadCounts } = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/send', sendMessage);
router.get('/history', getChatHistory);
router.get('/conversations', getConversations);
router.get('/unread-counts', getUnreadCounts);

module.exports = router;
