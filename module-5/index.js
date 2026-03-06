const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./db/dbconn');
const { PORT } = require('./config');
const userRouter = require('./routes/userRouter');
const blogsRouter = require('./routes/blogsRouter');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);

// Root health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
