const sql = require('mssql');
require('dotenv').config(); // load env vars

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Use 'true' if you're using encrypted connections
    trustServerCertificate: true, // Accept self-signed certificates
  },
};

// Establish the connection pool
let pool;

async function connectDB() {
  try {
    pool = await sql.connect(config);
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
  }
}

// Function to run a query
async function runQuery(query) {
  if (!pool) {
    console.error('Database connection not established');
    return;
  }
  
  try {
    const result = await pool.request().query(query);
    return result.recordset; // return query results
  } catch (error) {
    console.error('Error running query:', error.message);
  }
}

module.exports = { connectDB, runQuery, sql };
