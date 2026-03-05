/* ====================================================
   loginForm.js — Auth State & User Validation
   Mood-Based To-Do App — Module 3
   ==================================================== */

const USER_KEY = 'moodtodo_user';

// ── LocalStorage Helpers ───────────────────────────────────────

/**
 * Read the current user object from localStorage.
 * @returns {{ name: string, email: string } | null}
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persist a user object to localStorage.
 * @param {{ name: string, email: string }} user
 */
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Remove the user from localStorage (logout).
 */
export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

// ── Validation ─────────────────────────────────────────────────

/**
 * Validate login form fields.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Object} errors — empty object means valid
 */
export function validateLogin(name, email, password) {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  return errors;
}

/**
 * Validate edit-profile form fields.
 * @param {string} name
 * @param {string} email
 * @returns {Object} errors — empty object means valid
 */
export function validateProfile(name, email) {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}
