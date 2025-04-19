const { sql } = require('../config/db');

// Get all products by category
const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('CategoryName', sql.NVarChar(50), categoryName)
      .query(`
        SELECT p.ProductID, p.Name, p.Price, p.StockQuantity, c.Name AS CategoryName
        FROM Products p
        JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE c.Name = @CategoryName
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Filter products by price range
const filterProductsByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('MinPrice', sql.Decimal(10,2), parseFloat(minPrice))
      .input('MaxPrice', sql.Decimal(10,2), parseFloat(maxPrice))
      .query(`
        SELECT ProductID, Name, Price, StockQuantity
        FROM Products
        WHERE Price BETWEEN @MinPrice AND @MaxPrice
          AND StockQuantity > 0
        ORDER BY Price ASC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error filtering products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Search products by name
const searchProducts = async (req, res) => {
  const { term } = req.query;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('SearchTerm', sql.NVarChar(100), term)
      .execute('SearchProductsByName');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error searching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all products (using view)
const getAllProducts = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query('SELECT * FROM vw_ProductListing');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getProductsByCategory,
  filterProductsByPrice,
  searchProducts,
  getAllProducts
};