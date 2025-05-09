
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

/**
 * POST /api/users/register
 * Body: { username, password, email, role }
 * Expect plaintext password, hash it here.
 */
const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const pool = await getPool();
    await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .input('PasswordHash', sql.NVarChar(255), hashedPassword) // use hashed password
      .input('Email', sql.NVarChar(100), email)
      .input('Role', sql.NVarChar(20), role)
      .execute('RegisterUser'); c

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    if (err.number === 50000) {
      return res.status(409).json({ error: err.message });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * POST /api/users/login
 * Body: { username, password }
 * Expect plaintext password, compare with hashed one in DB.
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body; //  Changed passwordHash → password

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .query(`
        SELECT UserID, Username, Role, PasswordHash
        FROM Users
        WHERE Username = @Username
      `); // only check username first (we compare password in JS)

    if (!result.recordset.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];

    const match = await bcrypt.compare(password, user.PasswordHash); // Compare hashes

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate token
    const token = jwt.sign(
      { userID: user.UserID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    // return token
    res.json({
      userID: user.UserID,
      username: user.Username,
      role: user.Role,
      token,
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { registerUser, loginUser };
