require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());



connectDB(); // call this ONCE to connect to DB

// mount user-management routes under /api/users
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
 // console.log(`Database Connected Successfully`);
  console.log(`Visit: http://localhost:${PORT}`);
});
