const { sql, getPool } = require('../config/db');

// // 1. Order Placement (Matches PlaceOrderFromCart proc)
// const placeOrderFromCart = async (req, res) => {
//     const { userId } = req.body;
  
//     try {
//       const pool = await getPool();
//       const result = await pool.request()
//         .input('UserID', sql.Int, userId)
//         .execute('PlaceOrderFromCart');
  
//       // Check the returned message
//       const response = result.recordset[0];
      
//       if (response.Message === 'Cart is empty') {
//         return res.status(400).json({ error: response.Message });
//       }
  
//       res.status(201).json({
//         message: response.Message,
//         orderId: response.OrderID,
//         totalAmount: response.TotalAmount
//       });
  
//     } catch (err) {
//       console.error('Order placement error:', err);
//       res.status(500).json({
//         error: err.message || 'Order placement failed'
//       });
//     }
//   };


// 1. Order Placement (Matches PlaceOrderFromCart proc)
const placeOrderFromCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('PlaceOrderFromCart');

    const response = result.recordset[0];
    
    if (response.Message === 'Cart is empty') {
      return res.status(400).json({ error: response.Message });
    }

    // Clear cart after placing the order
    await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('ClearCart');  // Ensure you have a stored procedure to clear the cart.

    res.status(201).json({
      message: response.Message,
      orderId: response.OrderID,
      totalAmount: response.TotalAmount
    });

  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({
      error: err.message || 'Order placement failed'
    });
  }
};

  
// 2. Order Status - User History (Matches GetUserOrderHistory proc)
const getUserOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetUserOrderHistory');

    res.json(result.recordset);
  } catch (err) {
    console.error('Order history error:', err);
    res.status(500).json({ error: 'Failed to get order history' });
  }
};

// 3. Order Status - Details (Matches GetOrderDetails proc)
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('OrderID', sql.Int, orderId)
      .execute('GetOrderDetails');

    res.json(result.recordset);
  } catch (err) {
    console.error('Order details error:', err);
    res.status(500).json({ error: 'Failed to get order details' });
  }
};

// 4. Order Status - Admin View (Matches vw_OrderHistory)
const getAllOrders = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM vw_OrderHistory');

    res.json(result.recordset);
  } catch (err) {
    console.error('All orders error:', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

module.exports = {
  placeOrderFromCart,
  getUserOrderHistory,
  getOrderDetails,
  getAllOrders
};