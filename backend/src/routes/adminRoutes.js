const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminsController');

// Admin-only route to add a product
router.post('/add-product', adminController.addProduct);

// Admin-only route to update a product
router.put('/update-product', adminController.updateProduct);

// Admin-only route to delete a product
router.delete('/delete-product', adminController.deleteProduct);

// Admin-only route to manage users (update role or delete)
router.put('/manage-users', adminController.manageUsers);

module.exports = router;
