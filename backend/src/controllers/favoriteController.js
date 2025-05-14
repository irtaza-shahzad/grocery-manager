const { getPool, sql } = require('../config/db');

// 1. Add to Favorites
const addFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: 'Missing userId or productId' });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .execute('AddToFavourites'); // This should match the stored procedure

    res.status(201).json({ message: 'Product added to favorites' });
  } catch (err) {
    console.error('Add favorite error:', err);
    console.log('Request body its meee:', req.body); // Log the request body for debugging
    console.log('User ID:', userId); // Log the user ID for debugging
    console.log('Product ID:', productId); // Log the product ID for debugging

    res.status(500).json({ error: 'Failed to add to favorites' });
  }
};

// 2. Get User Favorites (Matches GetUserFavourites proc)
const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await getPool();
    console.log('pool:', pool); // Log the pool for debugging
    console.log('userId:', userId); // Log the user ID for debugging
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetUserFavouritesV3');

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
    const pool = await getPool();
    await pool.request()
      .input('FavouriteID', sql.Int, favoriteId)
      .input('UserID', sql.Int, userId)
      .execute('RemoveFromFavouritesV2');

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