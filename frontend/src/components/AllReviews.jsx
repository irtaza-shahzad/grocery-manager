import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  CircularProgress, Box
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews/all');
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Box sx={{ mt: 5,width:"100%",marginTop:"100px",px:"10px" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        All Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Review ID</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.ReviewID}>
                  <TableCell>{review.ReviewID}</TableCell>
                  <TableCell>{review.ProductID}</TableCell>
                  <TableCell>{review.Username}</TableCell>
                  <TableCell>{review.Rating}</TableCell>
                  <TableCell>{review.Comments}</TableCell>
                  <TableCell>{dayjs(review.CreatedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AllReviews;
