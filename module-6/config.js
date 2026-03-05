require('dotenv').config();

const PORT        = process.env.PORT        || 3000;
const PG_HOST     = process.env.PG_HOST     || 'localhost';
const PG_USER     = process.env.PG_USER     || 'postgres';
const PG_PASSWORD = process.env.PG_PASSWORD || '';
const PG_DATABASE = process.env.PG_DATABASE || '';
const PG_PORT     = process.env.PG_PORT     || 5432;

if (!PG_DATABASE) {
  console.error('ERROR: PG_DATABASE is not defined. Please check your .env file.');
  process.exit(1);
}

module.exports = { PORT, PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT };
