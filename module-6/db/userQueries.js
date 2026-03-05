const pool = require('./dbconn');

/**
 * Create a new user.
 * @param {string} name
 * @param {string} email
 * @returns {Promise<Object>} created user row
 */
async function createUser(name, email) {
  const sql = `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(sql, [name, email]);
  return result.rows[0];
}

/**
 * Get all users.
 * @returns {Promise<Array>}
 */
async function getAllUsers() {
  const sql = 'SELECT * FROM users ORDER BY created_at DESC;';
  const result = await pool.query(sql);
  return result.rows;
}

/**
 * Get a single user by id.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function getUserById(id) {
  const sql = 'SELECT * FROM users WHERE id = $1;';
  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
}

/**
 * Update a user's name and/or email.
 * @param {number} id
 * @param {string} name
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
async function updateUser(id, name, email) {
  const sql = `
    UPDATE users
    SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(sql, [name, email, id]);
  return result.rows[0] || null;
}

/**
 * Delete a user by id.
 * @param {number} id
 * @returns {Promise<Object|null>} deleted row
 */
async function deleteUser(id) {
  const sql = 'DELETE FROM users WHERE id = $1 RETURNING *;';
  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
