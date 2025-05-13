const { getPool, sql } = require('../config/db');

// Add item to cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  try {
    const pool = await getPool();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .input('Quantity', sql.Int, quantity)
      .execute('AddToCart');

    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (err) {
    if (err.number === 50000) { // RAISERROR from stored proc
      return res.status(400).json({ error: err.message });
    }
    console.error('Cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's cart
const getUserCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetUserCart');

    res.json(result.recordset);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const { cartItemId } = req.params;
  const { userId, quantity } = req.body;

  try {
    const pool = await getPool();
    await pool.request()
      .input('CartItemID', sql.Int, cartItemId)
      .input('UserID', sql.Int, userId)
      .input('Quantity', sql.Int, quantity)
      .execute('UpdateCartItemQuantity');

    res.json({ message: 'Cart item updated successfully' });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  const { cartItemId, userId } = req.params;

  try {
    const pool = await getPool();
    await pool.request()
      .input('CartItemID', sql.Int, cartItemId)
      .input('UserID', sql.Int, userId)
      .execute('RemoveCartItem');

    res.json({ message: 'Item removed from cart successfully' });
  } catch (err) {
    console.error('Remove item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear user's cart
const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('ClearUserCart'); // Using the new stored procedure

    res.json({ message: result.recordset[0].Message });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ 
      error: err.message || 'Internal server error' 
    });
  }
};
  
  // Get all carts (admin view using vw_UserCart)
  const getAllCarts = async (req, res) => {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .query('SELECT * FROM vw_UserCart'); // Uses your view
  
      // Group by user
      const cartsByUser = result.recordset.reduce((acc, item) => {
        if (!acc[item.UserID]) {
          acc[item.UserID] = {
            userId: item.UserID,
            items: [],
            total: 0
          };
        }
        acc[item.UserID].items.push(item);
        acc[item.UserID].total += item.SubTotal;
        return acc;
      }, {});
  
      res.json(Object.values(cartsByUser));
    } catch (err) {
      console.error('All carts error:', err);
      res.status(500).json({ error: 'Failed to retrieve all carts' });
    }
  };

module.exports = {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getAllCarts
};