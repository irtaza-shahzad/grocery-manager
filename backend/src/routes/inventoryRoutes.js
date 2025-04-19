const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const adminCheck = require('../middleware/adminCheck');

// GET /api/inventory/sales-by-category
router.get('/sales-by-category', inventoryController.getSalesByCategory);

// GET /api/inventory/orders-by-status
router.get('/orders-by-status', inventoryController.getOrdersByStatus);

// PUT /api/inventory/update-stock/:productId (Admin only)
router.put('/update-stock/:productId', adminCheck, inventoryController.updateProductStock);

module.exports = router;