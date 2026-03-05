const express = require('express');
const router  = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../db/blogQueries');

// POST /api/blogs — create a blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, user_id } = req.body;
    if (!title || !content || !user_id) {
      return res.status(400).json({ success: false, message: 'title, content and user_id are required.' });
    }
    const blog = await createBlog(title, content, user_id);
    return res.status(201).json({ success: true, data: blog });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ success: false, message: 'Referenced user does not exist.' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogs — get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    return res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogs/:id — get a single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/blogs/:id — update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'title and content are required.' });
    }
    const blog = await updateBlog(req.params.id, title, content);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/blogs/:id — delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const blog = await deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
