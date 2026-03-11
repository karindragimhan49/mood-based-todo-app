const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const pool = require('./db/dbconn');
const { PORT, NODE_ENV } = require('./config');
const userRouter = require('./routes/userRouter');
const blogsRouter = require('./routes/blogsRouter');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);

// Root health-check (only used in development / API-only mode)
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// ── Production: serve React build ───────────────────────────────────────────
if (NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(clientBuildPath));

  // Catch-all: return the React app for any non-API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// ── Start server after confirming DB connectivity ───────────────────────────
const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connection verified.');
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀  Module 8 Server  ➜  http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  }
};

startServer();
