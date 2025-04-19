const { sql } = require('../config/db');

// Add a new recipe with ingredients
const addRecipeWithIngredients = async (req, res) => {
  const { name, description, ingredients } = req.body;

  try {
    const pool = await sql.connect();

    const request = pool.request();
    request.input('Name', sql.NVarChar, name);
    request.input('Description', sql.NVarChar, description);
    request.input('Ingredients', sql.TVP, ingredients); // Table-Valued Parameter

    await request.execute('AddRecipeWithIngredients');

    res.status(201).json({ message: 'Recipe added successfully' });
  } catch (err) {
    console.error('Add recipe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get ingredients for a specific recipe
const getRecipeIngredients = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('RecipeID', sql.Int, recipeId)
      .execute('GetRecipeIngredients');

    res.json(result.recordset);
  } catch (err) {
    console.error('Get recipe ingredients error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add recipe ingredients to a user's cart
const addRecipeIngredientsToCart = async (req, res) => {
  const { userId } = req.body;
  const { recipeId } = req.params;

  try {
    const pool = await sql.connect();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('RecipeID', sql.Int, recipeId)
      .execute('AddRecipeIngredientsToCart');

    res.json({ message: 'Recipe ingredients added to cart successfully' });
  } catch (err) {
    console.error('Add recipe to cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query('SELECT * FROM vw_AllRecipes'); // View to get all recipes

    res.json(result.recordset);
  } catch (err) {
    console.error('Get all recipes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addRecipeWithIngredients,
  getRecipeIngredients,
  addRecipeIngredientsToCart,
  getAllRecipes
};
