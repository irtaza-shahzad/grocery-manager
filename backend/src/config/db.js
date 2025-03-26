const sql = require('mssql');
const config = require('./dotenv').db;

async function connectDB() {

  try {
    await sql.connect(config);
    console.log('Database Connected Successfully');
  }
  catch (error) {
    console.error('Database Connection Failed:', error.message);
  }
}

module.exports = { connectDB, sql };
