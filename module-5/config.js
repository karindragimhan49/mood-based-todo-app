'use strict';

require('dotenv').config();

const config = {
  PORT:      process.env.PORT      || 3000,
  MONGO_URI: process.env.MONGO_URI || '',
};

if (!config.MONGO_URI) {
  console.error('[config] ❌  MONGO_URI is not set. Add it to your .env file.');
  process.exit(1);
}

module.exports = config;
