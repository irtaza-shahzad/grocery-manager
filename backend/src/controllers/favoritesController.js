const { sql } = require('../config/db');

// Add a product to the user's favorites list
const addToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .execute('AddToFavourites'); // Execute stored procedure

    res.status(201).json({ message: 'Product added to favorites' });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get the list of favorite products for a user
const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetUserFavourites'); // Execute stored procedure

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching user favorites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove a product from a user's favorites list
const removeFromFavorites = async (req, res) => {
  const { favouriteId, userId } = req.body;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('FavouriteID', sql.Int, favouriteId)
      .input('UserID', sql.Int, userId)
      .execute('RemoveFromFavourites'); // Execute stored procedure

    res.status(200).json({ message: 'Product removed from favorites' });
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites
};
