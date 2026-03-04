'use strict';

const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

/**
 * Connect to MongoDB Atlas (or local MongoDB).
 * The server in index.js awaits this function before listening.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Mongoose 8 no longer needs useNewUrlParser / useUnifiedTopology
    });
    console.log(`[DB] ✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[DB] ❌  Connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
