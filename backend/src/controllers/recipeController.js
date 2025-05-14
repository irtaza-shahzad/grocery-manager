const { sql, getPool } = require('../config/db');

const addRecipe = async (req, res) => {
    const { name, description, ingredients } = req.body;
  
    if (!name || !ingredients) {
      return res.status(400).json({ error: 'Name and ingredients are required' });
    }
  
    try {
      const pool = await getPool();
      const tvp = new sql.Table();
      tvp.columns.add('ProductID', sql.Int);
      tvp.columns.add('Quantity', sql.Int);
      
      ingredients.forEach(ing => {
        if (!ing.productId || !ing.quantity) {
          throw new Error('Each ingredient requires productId and quantity');
        }
        tvp.rows.add(ing.productId, ing.quantity);
      });
  
      const result = await pool.request()
        .input('Name', sql.NVarChar(100), name)
        .input('Description', sql.NVarChar(500), description || '')
        .input('Ingredients', tvp)
        .execute('AddRecipeWithIngredients');
  
      const recipeId = result.recordset[0]?.RecipeID;
      
      if (!recipeId) {
        throw new Error('Failed to retrieve RecipeID after insertion');
      }
  
      res.status(201).json({
        message: 'Recipe added',
        recipeId: recipeId
      });
    } catch (err) {
      console.error('Recipe creation failed:', err);
      res.status(500).json({ 
        error: err.message || 'Failed to add recipe',
        details: err.number ? `SQL Error ${err.number}` : undefined
      });
    }
  };
  
// 2. Get Recipe Ingredients
const getRecipeIngredients = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('RecipeID', sql.Int, recipeId)
      .execute('GetRecipeIngredients');

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get ingredients' });
  }
};

// 3. Add to Cart from Recipe
const addToCartFromRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const pool = await getPool();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('RecipeID', sql.Int, recipeId)
      .execute('AddRecipeIngredientsToCart');

    res.json({ message: 'Ingredients added to cart' });
  } catch (err) {
    res.status(500).json({ 
      error: err.message || 'Failed to add to cart' 
    });
  }
};

// 4. Get All Recipes
const getAllRecipes = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM vw_AllRecipes');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get recipes' });
  }
};

const addRecipes=async (req,res)=>{
  const {name,description}=req.body
  if(!name || !description)
  {
    res.status(500).json({error:"all fields are required"})
  }
  const pool = await getPool();
  await pool.request().input('name',sql.NVarChar,name)
  .input('description',sql.NVarChar,description)
  .execute('AddRecipe')
  res.status(200).json({message:"recipe added successfully"})
}
module.exports = {
  addRecipe,
  getRecipeIngredients,
  addToCartFromRecipe,
  getAllRecipes,
  addRecipes
};