
const express = require('express');
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, getUserNotifications);
router.put('/read-all', authMiddleware, markAllAsRead);
router.put('/:id/read', authMiddleware, markAsRead);

module.exports = router;
