const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function initDB(retries = 5) {
  while (retries) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
      });

      await pool.query("SELECT 1");

      await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

      await pool.query(`CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR(255) UNIQUE NOT NULL,
        url VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`);

      console.log("Database initialized");
      return;

    } catch (err) {
      console.error("DB connection failed. Retrying...");
      retries--;
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  throw new Error("Could not connect to database");
}

function getPool() { 
  return pool; 
}

module.exports = { initDB, getPool };
