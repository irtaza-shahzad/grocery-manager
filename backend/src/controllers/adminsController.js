const sql = require('mssql');
const { poolPromise } = require('../config/db'); // Assuming you've set up the poolPromise

// Add Product (Admin Only)
exports.addProduct = async (req, res) => {
  const { Name, Price, StockQuantity, CategoryID, Description, UserID } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Name', sql.NVarChar(100), Name)
      .input('Price', sql.Decimal(10, 2), Price)
      .input('StockQuantity', sql.Int, StockQuantity)
      .input('CategoryID', sql.Int, CategoryID)
      .input('Description', sql.NVarChar(sql.MAX), Description)
      .input('UserID', sql.Int, UserID)
      .execute('AddProduct'); // Call stored procedure
    
    res.status(200).json({ productId: result.recordset[0].NewProductID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding product' });
  }
};

// Update Product (Admin Only)
exports.updateProduct = async (req, res) => {
  const { ProductID, Name, Price, StockQuantity, CategoryID, Description, UserID } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ProductID', sql.Int, ProductID)
      .input('Name', sql.NVarChar(100), Name)
      .input('Price', sql.Decimal(10, 2), Price)
      .input('StockQuantity', sql.Int, StockQuantity)
      .input('CategoryID', sql.Int, CategoryID)
      .input('Description', sql.NVarChar(sql.MAX), Description)
      .input('UserID', sql.Int, UserID)
      .execute('UpdateProduct'); // Call stored procedure

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Delete Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  const { ProductID, UserID } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ProductID', sql.Int, ProductID)
      .input('UserID', sql.Int, UserID)
      .execute('DeleteProduct'); // Call stored procedure

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};

// Manage Users (Admin Only - Update Role or Delete)
exports.manageUsers = async (req, res) => {
  const { UserID, TargetUserID, Action, NewRole } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('UserID', sql.Int, UserID)
      .input('TargetUserID', sql.Int, TargetUserID)
      .input('Action', sql.NVarChar(20), Action)
      .input('NewRole', sql.NVarChar(20), NewRole)
      .execute('ManageUsers'); // Call stored procedure
    
    res.status(200).json({ message: 'User managed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error managing user' });
  }
};
