const express = require('express');
const router = express.Router();
const interfaceController = require('../controllers/interfaceController');

// GET /api/interface/low-stock - Get low stock products
router.get('/low-stock', interfaceController.getLowStockProducts);

// GET /api/interface/popular - Get popular products
router.get('/popular', interfaceController.getPopularProducts);

module.exports = router;