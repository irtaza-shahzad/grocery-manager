require('dotenv').config({ path: '../.env' });

module.exports = {
    port: process.env.port || 5000,
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: true,
            trustServerCertificate: true, // For local testing
        },
    },
};

console.log('DB Server:', process.env.DB_SERVER);
