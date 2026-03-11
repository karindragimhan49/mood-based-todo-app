import axios from 'axios';

const BASE = '/api/blogs';

/** Fetch all blog posts */
export const getAllBlogs = async () => {
  const { data } = await axios.get(BASE);
  return data;
};

/** Fetch a single blog post by id */
export const getBlogById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

/** Create a new blog post */
export const createBlog = async (blogData) => {
  const { data } = await axios.post(BASE, blogData);
  return data;
};

/** Update an existing blog post */
export const updateBlog = async (id, blogData) => {
  const { data } = await axios.put(`${BASE}/${id}`, blogData);
  return data;
};

/** Delete a blog post */
export const deleteBlog = async (id) => {
  const { data } = await axios.delete(`${BASE}/${id}`);
  return data;
};
