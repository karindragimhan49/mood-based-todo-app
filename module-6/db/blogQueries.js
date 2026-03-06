const pool = require('./dbconn');

// Shared SQL fragment: SELECT blogs + nested user object (mimics Mongoose .populate('user'))
const SELECT_BLOG_WITH_USER = `
  SELECT
    b.id,
    b.title,
    b.content,
    b.user_id,
    b.created_at,
    json_build_object(
      'id',         u.id,
      'name',       u.name,
      'email',      u.email,
      'created_at', u.created_at
    ) AS user
  FROM blogs b
  LEFT JOIN users u ON b.user_id = u.id
`;

/**
 * Create a new blog post.
 * @param {Object} blogData - { title, content, user_id }
 * @returns {Object} The newly created blog row (without nested user).
 */
const createBlog = async ({ title, content, user_id }) => {
  const sql = `
    INSERT INTO blogs (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(sql, [title, content, user_id]);
  return result.rows[0];
};

/**
 * Retrieve all blogs with the associated user object (populate equivalent).
 * @returns {Array} Array of blog rows with nested user objects.
 */
const getAllBlogs = async () => {
  const sql = `${SELECT_BLOG_WITH_USER} ORDER BY b.created_at DESC;`;
  const result = await pool.query(sql);
  return result.rows;
};

/**
 * Retrieve a single blog by ID with its associated user (populate equivalent).
 * @param {number|string} id
 * @returns {Object|undefined} Blog row with nested user or undefined if not found.
 */
const getBlogById = async (id) => {
  const sql = `${SELECT_BLOG_WITH_USER} WHERE b.id = $1;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

/**
 * Update a blog's title and/or content.
 * @param {number|string} id
 * @param {Object} blogData - { title, content }
 * @returns {Object|undefined} Updated blog row or undefined if not found.
 */
const updateBlog = async (id, { title, content }) => {
  const sql = `
    UPDATE blogs
    SET title   = COALESCE($1, title),
        content = COALESCE($2, content)
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(sql, [title, content, id]);
  return result.rows[0];
};

/**
 * Delete a blog by ID.
 * @param {number|string} id
 * @returns {Object|undefined} Deleted blog row or undefined if not found.
 */
const deleteBlog = async (id) => {
  const sql = `DELETE FROM blogs WHERE id = $1 RETURNING *;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
