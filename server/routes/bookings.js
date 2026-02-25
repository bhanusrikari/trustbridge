const express = require('express');
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    getBookingById
} = require('../controllers/bookingController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('User'), createBooking);
router.get('/', authMiddleware, getBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id', authMiddleware, updateBookingStatus);

module.exports = router;
