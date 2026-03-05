const pool = require('../db/dbconn');

async function seed() {
  try {
    console.log('Clearing existing data...');
    await pool.query('DELETE FROM blogs;');
    await pool.query('DELETE FROM users;');

    console.log('Seeding users...');
    const user1 = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;',
      ['Alice Johnson', 'alice@example.com']
    );
    const user2 = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;',
      ['Bob Smith', 'bob@example.com']
    );

    const aliceId = user1.rows[0].id;
    const bobId   = user2.rows[0].id;

    console.log('Seeding blogs...');
    await pool.query(
      'INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3);',
      [
        'Getting Started with Node.js',
        'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine. It enables server-side scripting with JavaScript.',
        aliceId,
      ]
    );
    await pool.query(
      'INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3);',
      [
        'Why PostgreSQL?',
        'PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development.',
        bobId,
      ]
    );
    await pool.query(
      'INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3);',
      [
        'RESTful API Design Best Practices',
        'Designing a clean REST API requires careful thought about resource naming, HTTP verbs, and consistent response shapes.',
        aliceId,
      ]
    );

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
