const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../db/blogQueries');

const router = express.Router();

// GET /api/blogs — retrieve all blogs (with populated user)
router.get('/', async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/blogs — create a new blog post
router.post('/', async (req, res) => {
  try {
    const newBlog = await createBlog(req.body);
    res.status(201).json(newBlog);
  } catch (err) {
    // FK violation: referenced user_id does not exist (PostgreSQL error code 23503)
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Referenced user does not exist' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/blogs/:id — retrieve a single blog (with populated user)
router.get('/:id', async (req, res) => {
  try {
    const blog = await getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/blogs/:id — update a blog's title and/or content
router.put('/:id', async (req, res) => {
  try {
    const updatedBlog = await updateBlog(req.params.id, req.body);
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/blogs/:id — delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await deleteBlog(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully', blog: deletedBlog });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
