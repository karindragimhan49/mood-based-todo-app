'use strict';

const express    = require('express');
const router     = express.Router();
const userQ      = require('../db/userQueries');

/* ─────────────────────────────────────────────────
   POST /api/users — Create user
───────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const user = await userQ.createUser(req.body);
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/users — Get all users
───────────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  try {
    const users = await userQ.getAllUsers();
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/users/:id — Get single user
───────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const user = await userQ.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   PUT /api/users/:id — Update user
───────────────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  try {
    const user = await userQ.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────
   DELETE /api/users/:id — Delete user
───────────────────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const user = await userQ.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully.', data: user });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

module.exports = router;
