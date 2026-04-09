const { Pool } = require('pg');
const { DATABASE_URL } = require('./env');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error', err);
});

const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
