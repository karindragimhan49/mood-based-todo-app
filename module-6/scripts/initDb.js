const fs   = require('fs');
const path = require('path');
const pool = require('../db/dbconn');

const sqlPath = path.join(__dirname, 'setup-db.sql');

fs.readFile(sqlPath, 'utf8', async (err, sql) => {
  if (err) {
    console.error('Failed to read setup-db.sql:', err.message);
    process.exit(1);
  }

  try {
    await pool.query(sql);
    console.log('Database initialised successfully.');
    process.exit(0);
  } catch (queryErr) {
    console.error('Error initialising database:', queryErr.message);
    process.exit(1);
  }
});
