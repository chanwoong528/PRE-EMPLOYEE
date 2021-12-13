const { Pool } = require('pg');
require('dotenv').config({ path: "../env/db.env" });

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
});

pool.on('connect', () => {
  console.log('DB connected');
});

pool.on('error', (err, client) => {
  console.log("db.js: An error occurred.");
});

module.exports = () => { return pool };