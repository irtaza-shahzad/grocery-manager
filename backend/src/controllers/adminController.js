const sql = require('mssql');
const {getPool} = require('../config/db');


// 1. Add Product
const addProduct = async (req, res) => {
    try {
        const { name, price, stockQuantity, categoryID, description, userID } = req.body;

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        const pool = await getPool();
        const result = await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Price', sql.Decimal, price)
            .input('StockQuantity', sql.Int, stockQuantity)
            .input('CategoryID', sql.Int, categoryID)
            .input('Description', sql.NVarChar, description)
            .input('UserID', sql.Int, userID) // Now properly included
            .execute('AddProduct');

        res.status(201).json({ 
            message: 'Product added successfully',
            productId: result.recordset[0].NewProductID 
        });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ 
            message: 'Error adding product',
            error: error.message 
        });
    }
};

// 2. Update Product
const updateProduct = async (req, res) => {
    try {
        const { productID, name, price, stockQuantity, categoryID, description, userID } = req.body;

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        const pool = await getPool();
        await pool.request()
            .input('ProductID', sql.Int, productID)
            .input('Name', sql.NVarChar, name)
            .input('Price', sql.Decimal, price)
            .input('StockQuantity', sql.Int, stockQuantity)
            .input('CategoryID', sql.Int, categoryID)
            .input('Description', sql.NVarChar, description)
            .input('UserID', sql.Int, userID)
            .execute('UpdateProduct');

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ 
            message: 'Error updating product',
            error: error.message 
        });
    }
};

// 3. Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { productID } = req.params;
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        const pool = await getPool();
        await pool.request()
            .input('ProductID', sql.Int, productID)
            .input('UserID', sql.Int, userID)
            .execute('DeleteProduct');

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ 
            message: 'Error deleting product',
            error: error.message 
        });
    }
};

// 4. Manage Users
const manageUsers = async (req, res) => {
    try {
        const { targetUserID, action, newRole, userID } = req.body;

        if (!userID) {
            return res.status(400).json({ message: 'Admin UserID is required' });
        }

        const pool = await getPool();
        await pool.request()
            .input('UserID', sql.Int, userID)
            .input('TargetUserID', sql.Int, targetUserID)
            .input('Action', sql.NVarChar, action)
            .input('NewRole', sql.NVarChar, newRole)
            .execute('ManageUsers');

        res.status(200).json({ message: 'User management action completed successfully' });
    } catch (error) {
        console.error('Manage users error:', error);
        res.status(500).json({ 
            message: 'Error managing user',
            error: error.message 
        });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    manageUsers
};