const { sql } = require('../config/db');

// 1. Get low stock products (<10 quantity)
const getLowStockProducts = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT ProductID, Name, StockQuantity
        FROM Products
        WHERE StockQuantity < 50
        ORDER BY StockQuantity ASC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Low stock products error:', err);
    res.status(500).json({ error: 'Failed to get low stock products' });
  }
};

// 2. Get popular products (top 10 by sales)
const getPopularProducts = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`
        SELECT TOP 10 
          p.ProductID, 
          p.Name, 
          SUM(oi.Quantity) AS TotalSold
        FROM OrderItems oi
        JOIN Products p ON oi.ProductID = p.ProductID
        GROUP BY p.ProductID, p.Name
        ORDER BY TotalSold DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Popular products error:', err);
    res.status(500).json({ error: 'Failed to get popular products' });
  }
};

module.exports = {
  getLowStockProducts,
  getPopularProducts
};