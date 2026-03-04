'use strict';

const User = require('../models/User');

/**
 * Create a new user.
 * @param  {Object} data  - { name, email }
 * @returns {User}
 */
async function createUser(data) {
  try {
    const user = await User.create(data);
    return user;
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Retrieve all users, sorted by creation date (newest first).
 * @returns {User[]}
 */
async function getAllUsers() {
  try {
    return await User.find().sort({ createdAt: -1 });
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Retrieve a single user by ID.
 * @param  {string} id
 * @returns {User|null}
 */
async function getUserById(id) {
  try {
    return await User.findById(id);
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Update a user by ID.
 * @param  {string} id
 * @param  {Object} data  - Fields to update
 * @returns {User|null}
 */
async function updateUser(id, data) {
  try {
    return await User.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  } catch (err) {
    throw _handleMongooseError(err);
  }
}

/**
 * Delete a user by ID.
 * @param  {string} id
 * @returns {User|null}
 */
async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
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
  if (err.code === 11000) {
    const field   = Object.keys(err.keyValue)[0];
    const error   = new Error(`A user with that ${field} already exists.`);
    error.status  = 409;
    return error;
  }
  if (err.name === 'CastError') {
    const error  = new Error(`Invalid ID format: ${err.value}`);
    error.status = 400;
    return error;
  }
  return err;
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
