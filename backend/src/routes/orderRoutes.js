const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const adminCheck = require('../middleware/adminCheck');

// Order Placement (From Cart)
router.post('/', orderController.placeOrderFromCart);

// Order Status - User Endpoints
router.get('/history/:userId', orderController.getUserOrderHistory);
router.get('/details/:orderId', orderController.getOrderDetails);

// Order Status - Admin Only
router.get('/admin/all', adminCheck, orderController.getAllOrders);

module.exports = router;