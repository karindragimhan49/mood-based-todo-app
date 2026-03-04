'use strict';

const express     = require('express');
const cors        = require('cors');
const morgan      = require('morgan');
const connectDB   = require('./db/dbconn');
const { PORT }    = require('./config');
const userRouter  = require('./routes/userRouter');
const blogsRouter = require('./routes/blogsRouter');

const app = express();

/* ─────────────────────────────────────────────────
   GLOBAL MIDDLEWARE
───────────────────────────────────────────────── */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

/* ─────────────────────────────────────────────────
   API ROUTES
───────────────────────────────────────────────── */
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);

/* ─────────────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────────────── */
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Module 5 API is running.',
    endpoints: {
      users: '/api/users',
      blogs: '/api/blogs',
    },
  });
});

/* ─────────────────────────────────────────────────
   404 HANDLER
───────────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

/* ─────────────────────────────────────────────────
   GLOBAL ERROR HANDLER
───────────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status  = err.status || 500;
  const message = err.message || 'Internal server error.';
  console.error('[Error]', err);
  res.status(status).json({ success: false, error: message });
});

/* ─────────────────────────────────────────────────
   CONNECT DB → START SERVER
───────────────────────────────────────────────── */
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n  🚀  Module 5 API`);
    console.log(`  ➜  http://localhost:${PORT}`);
    console.log(`  ➜  Users : http://localhost:${PORT}/api/users`);
    console.log(`  ➜  Blogs : http://localhost:${PORT}/api/blogs\n`);
  });
})();
