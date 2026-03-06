const pool = require('./dbconn');

/**
 * Create a new user.
 * @param {Object} userData - { name, email }
 * @returns {Object} The newly created user row.
 */
const createUser = async ({ name, email }) => {
  const sql = `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(sql, [name, email]);
  return result.rows[0];
};

/**
 * Retrieve all users.
 * @returns {Array} Array of user rows.
 */
const getAllUsers = async () => {
  const sql = `SELECT * FROM users ORDER BY created_at DESC;`;
  const result = await pool.query(sql);
  return result.rows;
};

/**
 * Retrieve a single user by ID.
 * @param {number|string} id
 * @returns {Object|undefined} User row or undefined if not found.
 */
const getUserById = async (id) => {
  const sql = `SELECT * FROM users WHERE id = $1;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

/**
 * Update a user's name and/or email.
 * @param {number|string} id
 * @param {Object} userData - { name, email }
 * @returns {Object|undefined} Updated user row or undefined if not found.
 */
const updateUser = async (id, { name, email }) => {
  const sql = `
    UPDATE users
    SET name = COALESCE($1, name),
        email = COALESCE($2, email)
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(sql, [name, email, id]);
  return result.rows[0];
};

/**
 * Delete a user by ID (cascades to their blogs).
 * @param {number|string} id
 * @returns {Object|undefined} Deleted user row or undefined if not found.
 */
const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id = $1 RETURNING *;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
