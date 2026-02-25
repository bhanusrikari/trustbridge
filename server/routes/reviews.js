const express = require('express');
const { createReview, getReviewsByService } = require('../controllers/reviewController');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('User'), createReview);
router.get('/service/:service_id', getReviewsByService);

module.exports = router;
