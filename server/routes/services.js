const express = require('express');
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,

    getServicesByProvider,
    getProviderProfile,
    verifyProvider
} = require('../controllers/serviceController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllServices);
router.get('/categories', (require('../controllers/serviceController')).getCategories);

router.get('/:id', getServiceById);
// Provider Profile & Verification
router.get('/provider/:id/profile', getProviderProfile);
router.post('/provider/verify', authMiddleware, verifyProvider); // Public profile route


// Protected routes
router.post('/', authMiddleware, authorizeRoles('ServiceProvider'), createService);
router.put('/:id', authMiddleware, authorizeRoles('ServiceProvider'), updateService);
router.delete('/:id', authMiddleware, authorizeRoles('ServiceProvider'), deleteService);
router.get('/provider/all', authMiddleware, authorizeRoles('ServiceProvider'), getServicesByProvider);

module.exports = router;
