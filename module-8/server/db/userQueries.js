const pool = require('./dbconn');

const createUser = async ({ name, email }) => {
  const sql = `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;`;
  const result = await pool.query(sql, [name, email]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const sql = `SELECT * FROM users ORDER BY created_at DESC;`;
  const result = await pool.query(sql);
  return result.rows;
};

const getUserById = async (id) => {
  const sql = `SELECT * FROM users WHERE id = $1;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

const updateUser = async (id, { name, email }) => {
  const sql = `
    UPDATE users
    SET name  = COALESCE($1, name),
        email = COALESCE($2, email)
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(sql, [name, email, id]);
  return result.rows[0];
};

const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id = $1 RETURNING *;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
