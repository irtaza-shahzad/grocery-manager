const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Route to add a product to favorites
router.post('/add', favoritesController.addToFavorites);

// Route to view a user's favorite products
router.get('/:userId', favoritesController.getUserFavorites);

// Route to remove a product from favorites
router.delete('/remove', favoritesController.removeFromFavorites);

module.exports = router;
