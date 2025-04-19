const { sql } = require('../config/db');

// 1. Add product review (Matches AddProductReview proc)
const addReview = async (req, res) => {
  const { productId, userId, rating, comments } = req.body;

  try {
    const pool = await sql.connect();
    await pool.request()
      .input('ProductID', sql.Int, productId)
      .input('UserID', sql.Int, userId)
      .input('Rating', sql.TinyInt, rating)
      .input('Comments', sql.NVarChar(sql.MAX), comments)
      .execute('AddProductReview');

    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    if (err.number === 50000) { // RAISERROR from stored proc
      return res.status(400).json({ error: err.message });
    }
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// 2. Get product reviews (Matches GetProductReviews proc)
const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('ProductID', sql.Int, productId)
      .execute('GetProductReviews');

    res.json(result.recordset);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

// 3. Get product rating summary (Matches GetProductRatingSummary proc)
const getRatingSummary = async (req, res) => {
  const { productId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('ProductID', sql.Int, productId)
      .execute('GetProductRatingSummary');

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Get rating error:', err);
    res.status(500).json({ error: 'Failed to get rating summary' });
  }
};

// 4. Get all reviews (Uses vw_ProductReviews view)
const getAllReviews = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query('SELECT * FROM vw_ProductReviews');

    res.json(result.recordset);
  } catch (err) {
    console.error('Get all reviews error:', err);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  getRatingSummary,
  getAllReviews
};