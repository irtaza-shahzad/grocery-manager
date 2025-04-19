const { sql } = require('../config/db');

// 1. Get total sales by category (simple query)
const getSalesByCategory = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT 
          c.Name AS CategoryName, 
          SUM(oi.Quantity * oi.UnitPrice) AS TotalSales
        FROM OrderItems oi
        JOIN Products p ON oi.ProductID = p.ProductID
        JOIN Categories c ON p.CategoryID = c.CategoryID
        GROUP BY c.Name
        ORDER BY TotalSales DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Sales by category error:', err);
    res.status(500).json({ error: 'Failed to get sales data' });
  }
};

// 2. Get orders by status (simple query)
const getOrdersByStatus = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT 
          Status, 
          COUNT(*) AS OrderCount
        FROM Orders
        GROUP BY Status
        ORDER BY OrderCount DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Orders by status error:', err);
    res.status(500).json({ error: 'Failed to get order status data' });
  }
};

// 3. Update product stock (stored procedure)
const updateProductStock = async (req, res) => {
  const { productId } = req.params;
  const { quantityChange } = req.body;

  try {
    const pool = await sql.connect();
    await pool.request()
      .input('ProductID', sql.Int, productId)
      .input('QuantityChange', sql.Int, quantityChange)
      .execute('UpdateProductStock');

    res.json({ message: 'Product stock updated successfully' });
  } catch (err) {
    if (err.number === 50000) { // RAISERROR from stored proc
      return res.status(400).json({ error: err.message });
    }
    console.error('Update stock error:', err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

module.exports = {
  getSalesByCategory,
  getOrdersByStatus,
  updateProductStock
};