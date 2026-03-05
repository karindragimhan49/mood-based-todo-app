const { Pool } = require('pg');
const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT } = require('../config');

const pool = new Pool({
  host:     PG_HOST,
  user:     PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  port:     Number(PG_PORT),
});

pool.query('SELECT NOW()')
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch((err) => {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1);
  });

module.exports = pool;
