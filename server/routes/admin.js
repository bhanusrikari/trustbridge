const express = require('express');
const {
    verifyProvider,
    verifyLocalResident,
    getDashboardStats,
    getAllProviders,
    getAllResidents,
    getPendingServices,
    approveService,
    rejectService
} = require('../controllers/adminController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const { importGoogleServices, searchPlaces } = require('../controllers/googleMapsController');
const router = express.Router();

// All routes require Admin role
router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/pending-services', getPendingServices);
router.post('/approve-service/:id', approveService);
router.post('/reject-service/:id', rejectService);
router.put('/verify/provider', verifyProvider);
router.put('/verify/resident', verifyLocalResident);
router.get('/providers', getAllProviders);
router.get('/residents', getAllResidents);
router.post('/import-google-services', importGoogleServices);
router.get('/search-places', searchPlaces);

module.exports = router;
