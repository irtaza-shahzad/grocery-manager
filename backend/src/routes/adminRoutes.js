const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Product Management Routes
router.post('/products', adminController.addProduct);
router.put('/products', adminController.updateProduct);
router.delete('/products/:productID', adminController.deleteProduct);

// User Management Routes
router.post('/users/manage', adminController.manageUsers);

module.exports = router;