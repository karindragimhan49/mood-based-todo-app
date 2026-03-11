const fs = require('fs');
const path = require('path');
const pool = require('../db/dbconn');

const initDb = async () => {
  try {
    const sqlFilePath = path.join(__dirname, 'setup-db.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');
    console.log('Initialising database schema...');
    await pool.query(sql);
    console.log('Database schema created successfully.');
  } catch (err) {
    console.error('Error initialising database:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
};

initDb();
