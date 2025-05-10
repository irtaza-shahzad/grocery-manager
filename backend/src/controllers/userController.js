const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

// Register user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const pool = await getPool();
    
    // Check if the username or email already exists in the database
    const existingUser = await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .input('Email', sql.NVarChar(100), email)
      .query(`
        SELECT * FROM Users
        WHERE Username = @Username OR Email = @Email
      `);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'Username or Email already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the Users table
    await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .input('Email', sql.NVarChar(100), email)
      .input('PasswordHash', sql.NVarChar(255), hashedPassword)
      .input('Role', sql.NVarChar(50), 'Customer  ')  // Default role is 'Customer'
      .execute('RegisterUser');  // Ensure the RegisterUser stored procedure exists and is correct

    // Send success response
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Registration error:', err);  // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Login user

const loginUser = async (req, res) => {
  console.log('Login request body:', req.body);  // Log the request body for debugging
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .query(`
        SELECT UserID, Username, Role, PasswordHash
        FROM Users
        WHERE Username = @Username
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the entered password with the stored hashed password
    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token with user ID and role
    const token = jwt.sign({ id: user.UserID, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the response with the JWT token
    res.status(200).json({ token, username: user.Username, role: user.Role });

  } catch (err) {
    console.error('Login error:', err);  // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

module.exports = { registerUser, loginUser };
