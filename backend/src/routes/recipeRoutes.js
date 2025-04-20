const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// POST /recipes - Add new recipe
router.post('/', recipeController.addRecipe);

// GET /recipes/:id/ingredients - Get ingredients
router.get('/:recipeId/ingredients', recipeController.getRecipeIngredients);

// POST /recipes/add-to-cart - Add to user's cart
router.post('/add-to-cart', recipeController.addToCartFromRecipe);

// GET /recipes - Get all recipes
router.get('/', recipeController.getAllRecipes);

module.exports = router;