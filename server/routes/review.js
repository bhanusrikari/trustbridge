const express = require('express');
const { createReview, getReviewsByProvider } = require('../controllers/reviewController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/provider/:spid', getReviewsByProvider);

module.exports = router;
