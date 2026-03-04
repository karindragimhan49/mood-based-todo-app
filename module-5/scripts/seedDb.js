'use strict';

/**
 * scripts/seedDb.js
 * ─────────────────
 * Clears all existing Users and Blogs, then inserts
 * 2 sample users and 3 sample blogs linked to them.
 *
 * Usage:  npm run db:seed
 */

const connectDB = require('../db/dbconn');
const User      = require('../models/User');
const Blog      = require('../models/Blog');

/* ─────────────────────────────────────────────────
   SEED DATA
───────────────────────────────────────────────── */
const seedUsers = [
  { name: 'Alice Johnson', email: 'alice@example.com' },
  { name: 'Bob Smith',     email: 'bob@example.com'   },
];

function buildSeedBlogs(users) {
  const [alice, bob] = users;
  return [
    {
      title:   'Getting Started with Node.js',
      content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine. ' +
               'It allows you to run JavaScript on the server side and build scalable network applications.',
      user:    alice._id,
    },
    {
      title:   'Understanding Mongoose & MongoDB',
      content: 'Mongoose provides a straightforward, schema-based solution to model your application data. ' +
               'It includes built-in type casting, validation, query building, and business logic hooks.',
      user:    alice._id,
    },
    {
      title:   'REST API Best Practices',
      content: 'When building REST APIs, it is important to use proper HTTP status codes, ' +
               'meaningful error messages, and a consistent response structure throughout your application.',
      user:    bob._id,
    },
  ];
}

/* ─────────────────────────────────────────────────
   SEED FUNCTION
───────────────────────────────────────────────── */
async function seed() {
  try {
    await connectDB();

    // --- Clear existing data ---
    console.log('\n[Seed] 🧹  Clearing existing data…');
    await Blog.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] ✅  Collections cleared.');

    // --- Insert users ---
    console.log('[Seed] 👤  Creating users…');
    const users = await User.insertMany(seedUsers);
    users.forEach(u => console.log(`        • ${u.name} (${u.email})`));

    // --- Insert blogs ---
    console.log('[Seed] 📝  Creating blogs…');
    const blogs = await Blog.insertMany(buildSeedBlogs(users));
    blogs.forEach(b => console.log(`        • "${b.title}"`));

    console.log('\n[Seed] 🎉  Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] ❌  Error seeding database:', err.message);
    process.exit(1);
  }
}

seed();
