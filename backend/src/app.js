const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');

const app = express();
const port = require('./config/dotenv').port;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to database
connectDB();

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Listen to requests
app.listen(port, () => console.log(` Server running on port ${port}`));
