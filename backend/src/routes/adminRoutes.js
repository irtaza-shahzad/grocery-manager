const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Product Management Routes
router.post('/add', adminController.addProduct);
router.post('/update', adminController.updateProduct);
router.delete('/:productID', adminController.deleteProduct);

// User Management Routes
router.post('/users/manage', adminController.manageUsers);

module.exports = router;