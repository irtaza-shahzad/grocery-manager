const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// POST /favorites - Add to favorites
router.post('/', favoriteController.addFavorite);

// GET /favorites/:userId - Get user favorites
router.get('/:userId', favoriteController.getUserFavorites);

// DELETE /favorites/:favoriteId/:userId - Remove from favorites
router.delete('/:favoriteId/:userId', favoriteController.removeFavorite);

module.exports = router;