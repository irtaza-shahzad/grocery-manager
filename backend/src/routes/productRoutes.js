const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/category/:categoryName
router.get('/category/:categoryName', productController.getProductsByCategory);

// GET /api/products/filter?minPrice=0&maxPrice=100
router.get('/filter', productController.filterProductsByPrice);

// GET /api/products/search?term=apple
router.get('/search', productController.searchProducts);

// GET /api/products
router.get('/', productController.getAllProducts);

module.exports = router;