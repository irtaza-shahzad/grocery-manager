import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress,
  Box, TextField, Button
} from '@mui/material';
import axios from 'axios';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editProduct, setEditProduct] = useState({
    productID: '',
    name: '',
    price: '',
    stockQuantity: '',
    category: '',
    description: '',
    userID: 1,
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    category: '',
    description: '',
    userID: 1,
  });

  const category={
    "Fruits":1,
    "fruits":1,
    "Vegetables":2,
    "vegetables":2,
    "Dairy":3,
    "dairy":3,
    "Bakery":4,
    "bakery":4,
    "Pantry":5,
    "pantry":5,
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  const handleEditClick = (product) => {
    setEditProduct({
      productID: product.ProductID,
      name: product.Name,
      price: product.Price,
      stockQuantity: product.StockQuantity,
      category: product.CategoryName,
      description: product.Description,
      userID: 1,
    });
  };

  const handleInputChange = (e, isEdit = true) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = () => {
    axios.post(`http://localhost:5000/api/admin/update`, {
      productID: editProduct.productID,
      name: editProduct.name,
      price: parseFloat(editProduct.price),
      stockQuantity: parseInt(editProduct.stockQuantity),
      categoryID: category[editProduct.category],
      description: editProduct.description,
      userID: 1,
    })
      .then(() => {
        alert('Product updated!');
        setEditProduct({
          productID: '',
          name: '',
          price: '',
          stockQuantity: '',
          category: '',
          description: '',
          userID: 1,
        });
        fetchProducts();
      })
      .catch((err) => {
        console.error('Update error:', err);
        alert('Update failed');
      });
  };

  const handleAddProduct = () => {
    const categoryID = category[newProduct.category];
    if (!categoryID) {
      alert('Invalid category. Must be one of: ' + Object.keys(category).join(', '));
      return;
    }

    axios.post('http://localhost:5000/api/admin/add', {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stockQuantity: parseInt(newProduct.stockQuantity),
      categoryID: categoryID,
      description: newProduct.description,
      userID: 1,
    })
      .then(() => {
        alert('Product added!');
        setNewProduct({
          name: '',
          price: '',
          stockQuantity: '',
          category: '',
          description: '',
          userID: 1,
        });
        fetchProducts();
      })
      .catch((err) => {
        console.error('Add error:', err);
        alert('Add failed');
      });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginTop:"100px",px:"10px" }}>
      {/* Add Product Section */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Add New Product</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={(e) => handleInputChange(e, false)}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={(e) => handleInputChange(e, false)}
          />
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={newProduct.stockQuantity}
            onChange={(e) => handleInputChange(e, false)}
          />
          <TextField
            label="Category"
            name="category"
            value={newProduct.category}
            onChange={(e) => handleInputChange(e, false)}
          />
          <TextField
            label="Description"
            name="description"
            value={newProduct.description}
            onChange={(e) => handleInputChange(e, false)}
            fullWidth
            multiline
          />
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Box>
      </Paper>

      {/* Edit Product Section */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Edit Product</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={editProduct.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={editProduct.price}
            onChange={handleInputChange}
          />
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={editProduct.stockQuantity}
            onChange={handleInputChange}
          />
          <TextField
            label="Category"
            name="category"
            value={editProduct.category}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            value={editProduct.description}
            onChange={handleInputChange}
            fullWidth
            multiline
          />
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!editProduct.productID}
            sx={{ alignSelf: 'center' }}
          >
            Update
          </Button>
        </Box>
      </Paper>

      {/* Product List Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Products List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.ProductID}>
                <TableCell>{product.ProductID}</TableCell>
                <TableCell>{product.Name}</TableCell>
                <TableCell>{product.Price}</TableCell>
                <TableCell>{product.StockQuantity}</TableCell>
                <TableCell>{product.CategoryName}</TableCell>
                <TableCell>{product.Description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductsTable;
