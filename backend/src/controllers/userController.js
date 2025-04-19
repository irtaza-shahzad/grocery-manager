const { sql } = require('../config/db');

/**
 * POST /api/users/register
 * Body: { username, passwordHash, email, role }
 */
const registerUser = async (req, res) => {
  const { username, passwordHash, email, role } = req.body;
  try {
    const pool = await sql.connect();    
    await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .input('PasswordHash', sql.NVarChar(255), passwordHash)
      .input('Email', sql.NVarChar(100), email)
      .input('Role', sql.NVarChar(20), role)
      .execute('RegisterUser');        // calls stored proc :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // if proc RAISERRORs on duplicate, SQL error code 50000 is raised
    if (err.number === 50000) {
      return res.status(409).json({ error: err.message });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * POST /api/users/login
 * Body: { username, passwordHash }
 */
const loginUser = async (req, res) => {
  const { username, passwordHash } = req.body;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('Username', sql.NVarChar(50), username)
      .input('PasswordHash', sql.NVarChar(255), passwordHash)
      .query(
        `SELECT UserID, Username, Role
         FROM Users
         WHERE Username = @Username 
           AND PasswordHash = @PasswordHash;`
      );  // login verification :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}

    if (!result.recordset.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];
    res.json({ userID: user.UserID, username: user.Username, role: user.Role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { registerUser, loginUser };
