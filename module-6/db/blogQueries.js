const pool = require('./dbconn');

const BLOG_SELECT = `
  SELECT blogs.*, users.name AS author_name
  FROM   blogs
  JOIN   users ON blogs.user_id = users.id
`;

/**
 * Create a new blog post.
 * @param {string} title
 * @param {string} content
 * @param {number} user_id
 * @returns {Promise<Object>} created blog row (with author_name)
 */
async function createBlog(title, content, user_id) {
  const insertSql = `
    INSERT INTO blogs (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  const inserted = await pool.query(insertSql, [title, content, user_id]);
  const newId    = inserted.rows[0].id;

  const fetchSql = `${BLOG_SELECT} WHERE blogs.id = $1;`;
  const result   = await pool.query(fetchSql, [newId]);
  return result.rows[0];
}

/**
 * Get all blog posts (joined with author).
 * @returns {Promise<Array>}
 */
async function getAllBlogs() {
  const sql    = `${BLOG_SELECT} ORDER BY blogs.created_at DESC;`;
  const result = await pool.query(sql);
  return result.rows;
}

/**
 * Get a single blog post by id (joined with author).
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function getBlogById(id) {
  const sql    = `${BLOG_SELECT} WHERE blogs.id = $1;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
}

/**
 * Update a blog post's title and content.
 * @param {number} id
 * @param {string} title
 * @param {string} content
 * @returns {Promise<Object|null>}
 */
async function updateBlog(id, title, content) {
  const updateSql = `
    UPDATE blogs
    SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3;
  `;
  const updated = await pool.query(updateSql, [title, content, id]);
  if (updated.rowCount === 0) return null;

  const fetchSql = `${BLOG_SELECT} WHERE blogs.id = $1;`;
  const result   = await pool.query(fetchSql, [id]);
  return result.rows[0] || null;
}

/**
 * Delete a blog post by id.
 * @param {number} id
 * @returns {Promise<Object|null>} deleted row
 */
async function deleteBlog(id) {
  const sql    = 'DELETE FROM blogs WHERE id = $1 RETURNING *;';
  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
}

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
