const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipesController');

// POST /api/recipes - Add a new recipe with ingredients
router.post('/', recipeController.addRecipeWithIngredients);

// GET /api/recipes/:recipeId/ingredients - Get ingredients for a specific recipe
router.get('/:recipeId/ingredients', recipeController.getRecipeIngredients);

// POST /api/recipes/:recipeId/cart - Add recipe ingredients to a user's cart
router.post('/:recipeId/cart', recipeController.addRecipeIngredientsToCart);

// GET /api/recipes - Get all recipes
router.get('/', recipeController.getAllRecipes);

module.exports = router;
