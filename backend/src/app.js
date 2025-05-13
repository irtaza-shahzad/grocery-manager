require('dotenv').config({ path: '../.env' });
const cors = require('cors');

const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const interfaceRoutes = require('./routes/interfaceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running shukar hai...');
});



async function startServer() {
  connectDB(); // call this ONCE to connect to DB


  // mount user-management routes under /api/users
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/interface', interfaceRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/favorites', favoriteRoutes);
  app.use('/api/admin', adminRoutes);


  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    // console.log(`Database Connected Successfully`);
    console.log(`Visit: http://localhost:${PORT}`);
  });
  
}

startServer();
