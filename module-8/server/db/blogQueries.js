const pool = require('./dbconn');

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

const createBlog = async ({ title, content, user_id }) => {
  const sql = `
    INSERT INTO blogs (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(sql, [title, content, user_id]);
  return result.rows[0];
};

const getAllBlogs = async () => {
  const sql = `${SELECT_BLOG_WITH_USER} ORDER BY b.created_at DESC;`;
  const result = await pool.query(sql);
  return result.rows;
};

const getBlogById = async (id) => {
  const sql = `${SELECT_BLOG_WITH_USER} WHERE b.id = $1;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

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

const deleteBlog = async (id) => {
  const sql = `DELETE FROM blogs WHERE id = $1 RETURNING *;`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
