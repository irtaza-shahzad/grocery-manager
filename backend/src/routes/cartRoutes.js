const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

const adminCheck = require('../middleware/adminCheck');

// Apply auth middleware to all routes
// router.use(authMiddleware);

// POST /api/cart - Add item to cart
router.post('/', cartController.addToCart);

// GET /api/cart/:userId - Get user's cart
router.get('/:userId', cartController.getUserCart);

// PUT /api/cart/:cartItemId - Update cart item
router.put('/:cartItemId', cartController.updateCartItem);

// DELETE /api/cart/clear/:userId - Clear entire cart
router.delete('/clear/:userId', cartController.clearCart);

// DELETE /api/cart/:cartItemId/:userId - Remove item
router.delete('/:cartItemId/:userId', cartController.removeCartItem);


// GET /api/cart/admin/all - View all user carts (admin only)
router.get('/admin/all',  cartController.getAllCarts);

module.exports = router;