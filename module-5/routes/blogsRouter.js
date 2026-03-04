'use strict';

const express = require('express');
const router  = express.Router();
const blogQ   = require('../db/blogQueries');

/* ─────────────────────────────────────────────────
   POST /api/blogs — Create blog
───────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const blog = await blogQ.createBlog(req.body);
    return res.status(201).json({ success: true, data: blog });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/blogs — Get all blogs
───────────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  try {
    const blogs = await blogQ.getAllBlogs();
    return res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/blogs/:id — Get single blog
───────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const blog = await blogQ.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found.' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   PUT /api/blogs/:id — Update blog
───────────────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  try {
    const blog = await blogQ.updateBlog(req.params.id, req.body);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found.' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   DELETE /api/blogs/:id — Delete blog
───────────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const blog = await blogQ.deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found.' });
    }
    return res.status(200).json({ success: true, message: 'Blog deleted successfully.', data: blog });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

module.exports = router;
