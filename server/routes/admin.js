const express = require('express');
const {
    verifyProvider,
    verifyLocalResident,
    getDashboardStats,
    getAllProviders,
    getAllResidents
} = require('../controllers/adminController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// All routes require Admin role
router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/stats', getDashboardStats);
router.put('/verify/provider', verifyProvider);
router.put('/verify/resident', verifyLocalResident);
router.get('/providers', getAllProviders);
router.get('/residents', getAllResidents);

module.exports = router;
