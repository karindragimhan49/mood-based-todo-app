const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const pool       = require('./db/dbconn');
const { PORT }   = require('./config');
const userRouter = require('./routes/userRouter');
const blogsRouter = require('./routes/blogsRouter');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Start server only after confirming DB connectivity
pool.query('SELECT NOW()')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to PostgreSQL:', err.message);
    process.exit(1);
  });
