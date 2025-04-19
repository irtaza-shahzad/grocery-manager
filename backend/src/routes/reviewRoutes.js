const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Add review
router.post('/', reviewController.addReview);

// Get reviews for specific product
router.get('/product/:productId', reviewController.getProductReviews);

// Get rating summary
router.get('/summary/:productId', reviewController.getRatingSummary);

// Get all reviews (admin view)
router.get('/all', reviewController.getAllReviews);

module.exports = router;