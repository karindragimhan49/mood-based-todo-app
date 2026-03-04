'use strict';

const Blog = require('../models/Blog');

/**
 * Create a new blog post.
 * @param  {Object} data - { title, content, user }
 * @returns {Blog}
 */
async function createBlog(data) {
  try {
    const blog = await Blog.create(data);
    return blog.populate('user', 'name email');
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Retrieve all blogs with user info, newest first.
 * @returns {Blog[]}
 */
async function getAllBlogs() {
  try {
    return await Blog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Retrieve a single blog by ID with user info.
 * @param  {string} id
 * @returns {Blog|null}
 */
async function getBlogById(id) {
  try {
    return await Blog.findById(id).populate('user', 'name email');
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Update a blog by ID.
 * @param  {string} id
 * @param  {Object} data - Fields to update
 * @returns {Blog|null}
 */
async function updateBlog(id, data) {
  try {
    return await Blog.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Delete a blog by ID.
 * @param  {string} id
 * @returns {Blog|null}
 */
async function deleteBlog(id) {
  try {
    return await Blog.findByIdAndDelete(id);
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/* ── Internal: normalise Mongoose errors ─────────── */
function _handleMongooseError(err) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    const error   = new Error(message);
    error.status  = 400;
    return error;
  }
  if (err.name === 'CastError') {
    const error  = new Error(`Invalid ID format: ${err.value}`);
    error.status = 400;
    return error;
  }
  return err;
}

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
