const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db/dbconn');
const { PORT } = require('./config');
const userRouter = require('./routes/userRouter');
const blogsRouter = require('./routes/blogsRouter');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);

// Root health-check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// ── Start server after confirming DB connectivity ───────────────────────────
const startServer = async () => {
  try {
    // Test the connection by acquiring a client from the pool
    const client = await pool.connect();
    console.log('PostgreSQL connection verified.');
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀  Mood-Based To-Do — Module 6  ➜  http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  }
};

startServer();
