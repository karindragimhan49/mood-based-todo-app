const mongoose = require('mongoose');
const connectDB = require('../db/dbconn');
const User = require('../models/User');
const Blog = require('../models/Blog');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('Collections cleared');

    // Create dummy users
    const users = await User.insertMany([
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
    ]);
    console.log('Users seeded:', users.map((u) => u.name));

    // Create dummy blogs linked to those users
    const blogs = await Blog.insertMany([
      {
        title: 'Getting Started with Node.js',
        content: 'Node.js is a powerful JavaScript runtime built on Chrome V8 engine...',
        user: users[0]._id,
      },
      {
        title: 'Understanding REST APIs',
        content: 'A REST API is an architectural style for distributed hypermedia systems...',
        user: users[1]._id,
      },
    ]);
    console.log('Blogs seeded:', blogs.map((b) => b.title));

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
  }
};

seedDatabase();
