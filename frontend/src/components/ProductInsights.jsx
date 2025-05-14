import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const ProductInsights = () => {
  const [activeTab, setActiveTab] = useState('popular');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (type) => {
    setLoading(true);
    const url =
      type === 'popular'
        ? 'http://localhost:5000/api/interface/popular'
        : 'http://localhost:5000/api/interface/low-stock';

    try {
      const res = await axios.get(url);
      console.log("insignhts",res.data)
      setData(res.data);
    } catch (error) {
      console.error(`Failed to fetch ${type} products:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  return (
    <Box sx={{ mt: 5 ,width:"100%",marginTop:"100px",px:"10px"}}>
      <Typography variant="h5" gutterBottom>
        {activeTab === 'popular' ? 'Popular Products' : 'Low Stock Products'}
      </Typography>

      <ButtonGroup sx={{ mb: 3 }}>
        <Button
          variant={activeTab === 'low-stock' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('low-stock')}
        >
          Low Stock
        </Button>
      </ButtonGroup>
        {/* <Button
          variant={activeTab === 'popular' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('popular')}
        >
          Popular
        </Button> */}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>{activeTab=="popular"?"Total Sold":"Stock Quantity"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((product) => (
                <TableRow key={product.ProductID}>
                  <TableCell>{product.ProductID}</TableCell>
                  <TableCell>{product.Name}</TableCell>
                  <TableCell>{product.StockQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ProductInsights;
