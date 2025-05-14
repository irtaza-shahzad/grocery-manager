import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress, Box
} from '@mui/material';
import axios from 'axios';

const AllCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/cart/admin/all');
      setCarts(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        All Carts
      </Typography>
      {carts.length === 0 ? (
        <Typography>No cart items found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Cart Item ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carts.map((cart) =>
                cart.items.map((item) => (
                  <TableRow key={item.CartItemID}>
                    <TableCell>{cart.userId}</TableCell>
                    <TableCell>{item.CartItemID}</TableCell>
                    <TableCell>{item.Name}</TableCell>
                    <TableCell>{item.Quantity}</TableCell>
                    <TableCell>${item.Price}</TableCell>
                    <TableCell>${item.Price * item.Quantity}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AllCarts;