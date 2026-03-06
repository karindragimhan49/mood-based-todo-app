const pool = require('../db/dbconn');

const seedDb = async () => {
  try {
    console.log('Seeding database...');

    // ── Insert 2 dummy users ────────────────────────────────────────────────
    const user1Result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;`,
      ['Alice Johnson', 'alice@example.com']
    );

    const user2Result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;`,
      ['Bob Smith', 'bob@example.com']
    );

    const aliceId = user1Result.rows[0].id;
    const bobId = user2Result.rows[0].id;

    console.log(`  ✔ Users seeded (ids: ${aliceId}, ${bobId})`);

    // ── Insert 2 dummy blog posts using the retrieved IDs ──────────────────
    await pool.query(
      `INSERT INTO blogs (title, content, user_id)
       VALUES ($1, $2, $3);`,
      [
        'My First Blog Post',
        'This is the content of Alice\'s first blog post. Welcome to the mood-based todo app!',
        aliceId,
      ]
    );

    await pool.query(
      `INSERT INTO blogs (title, content, user_id)
       VALUES ($1, $2, $3);`,
      [
        'Productivity Tips',
        'Bob here! Today I want to share some productivity tips that have helped me manage my tasks.',
        bobId,
      ]
    );

    console.log('  ✔ Blogs seeded');
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
};

seedDb();
