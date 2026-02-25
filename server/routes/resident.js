const express = require('express');
const { getDashboardStats, getGuidanceRequests } = require('../controllers/residentController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', authMiddleware, authorizeRoles('LocalResident'), getDashboardStats);
router.get('/guidance-requests', authMiddleware, authorizeRoles('LocalResident'), getGuidanceRequests);

module.exports = router;
