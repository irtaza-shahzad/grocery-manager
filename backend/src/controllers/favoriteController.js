const { sql } = require('../config/db');

// 1. Add to Favorites (Matches AddToFavourites proc)
const addFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const pool = await sql.connect();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .execute('AddToFavourites');

    res.status(201).json({ message: 'Product added to favorites' });
  } catch (err) {
    if (err.number === 50000) { // RAISERROR from stored proc
      return res.status(400).json({ error: err.message });
    }
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// 2. Get User Favorites (Matches GetUserFavourites proc)
const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetUserFavourites');

    res.json(result.recordset);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

// 3. Remove from Favorites (Matches RemoveFromFavourites proc)
const removeFavorite = async (req, res) => {
  const { favoriteId, userId } = req.params;

  try {
    const pool = await sql.connect();
    await pool.request()
      .input('FavouriteID', sql.Int, favoriteId)
      .input('UserID', sql.Int, userId)
      .execute('RemoveFromFavourites');

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

module.exports = {
  addFavorite,
  getUserFavorites,
  removeFavorite
};