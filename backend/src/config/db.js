const sql = require('mssql');
require('dotenv').config();


const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Database Connected Successfully');
    }
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
  }
}


function getPool() {
  if (!pool) {
    throw new Error('Database not connected yet');
  }
  return pool;
}

module.exports = { connectDB, getPool, sql };
