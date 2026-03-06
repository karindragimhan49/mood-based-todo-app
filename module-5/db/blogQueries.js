const Blog = require('../models/Blog');

const createBlog = async (blogData) => {
  const blog = new Blog(blogData);
  return await blog.save();
};

const getAllBlogs = async () => {
  return await Blog.find().populate('user');
};

const getBlogById = async (id) => {
  return await Blog.findById(id).populate('user');
};

const updateBlog = async (id, blogData) => {
  return await Blog.findByIdAndUpdate(id, blogData, { new: true, runValidators: true });
};

const deleteBlog = async (id) => {
  return await Blog.findByIdAndDelete(id);
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
