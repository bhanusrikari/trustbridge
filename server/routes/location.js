const express = require('express');
const { updateLocation, getLocation } = require('../controllers/locationController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/update', authMiddleware, authorizeRoles('ServiceProvider'), updateLocation);
router.get('/:booking_id', authMiddleware, getLocation);

module.exports = router;
