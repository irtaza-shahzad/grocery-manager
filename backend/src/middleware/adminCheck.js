// backend/src/middleware/adminCheck.js
const { sql } = require('../config/db');

const adminCheck = async (req, res, next) => {
  // Get userId from either query params or request body
  const userId = req.query.userId || req.body.userId;
  
  if (!userId) {
    return res.status(400).json({ 
      error: 'User ID required as query parameter: ?userId=1' 
    });
  }

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .query('SELECT Role FROM Users WHERE UserID = @UserID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.recordset[0].Role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Admin privileges required',
        currentRole: result.recordset[0].Role
      });
    }

    // Attach admin user ID to request for controllers
    req.adminUserId = userId;
    next();
  } catch (err) {
    console.error('Admin check error:', err);
    res.status(500).json({ error: 'Internal server error during admin verification' });
  }
};

module.exports = adminCheck;