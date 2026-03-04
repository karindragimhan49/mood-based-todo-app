/**
 * loginForm.js — Authentication Module
 * --------------------------------------------------
 * Handles:
 *  - Profile button click → show Login or Edit Profile modal
 *  - Login / account creation
 *  - Edit profile (username, email)
 *  - Logout
 *
 * Load order: 2nd  (after index.js)
 */

'use strict';

const LoginForm = (() => {

  /* ── DOM refs (resolved lazily after DOMContentLoaded) ── */
  let elProfileBtn;
  let elLoginModal, elLoginClose, elLoginEmail, elLoginPassword,
      elLoginEmailErr, elLoginPasswordErr, elLoginSubmit;
  let elEditModal, elEditClose, elEditUsername, elEditEmail,
      elEditUsernameErr, elEditEmailErr, elEditSave, elLogout;

  /* ─────────────────────────────────────────────────
     OPEN HELPERS
  ───────────────────────────────────────────────── */

  function openLoginModal() {
    // Clear previous values & errors
    elLoginEmail.value    = '';
    elLoginPassword.value = '';
    App.clearFieldErrors(elLoginModal);
    App.openModal('loginModal');
    elLoginEmail.focus();
  }

  function openEditProfileModal() {
    const user = App.getUser();
    if (!user) { openLoginModal(); return; }

    elEditUsername.value = user.username || '';
    elEditEmail.value    = user.email    || '';
    App.clearFieldErrors(elEditModal);
    App.openModal('editProfileModal');
    elEditUsername.focus();
  }

  /* ─────────────────────────────────────────────────
     PROFILE BUTTON CLICK
  ───────────────────────────────────────────────── */

  /**
   * If a user is stored → Edit Profile
   * If no user         → Login
   */
  function handleProfileClick() {
    App.getUser() ? openEditProfileModal() : openLoginModal();
  }

  /* ─────────────────────────────────────────────────
     LOGIN / CREATE ACCOUNT
  ───────────────────────────────────────────────── */

  function handleLogin() {
    const email    = elLoginEmail.value.trim();
    const password = elLoginPassword.value;

    // Clear previous errors
    App.clearFieldErrors(elLoginModal);
    let valid = true;

    // Validate email / username
    if (App.isEmpty(email)) {
      App.setFieldError('loginEmail', 'loginEmailError', 'Email or username is required.');
      valid = false;
    }
    // Validate password
    if (App.isEmpty(password)) {
      App.setFieldError('loginPassword', 'loginPasswordError', 'Password is required.');
      valid = false;
    } else if (password.length < 4) {
      App.setFieldError('loginPassword', 'loginPasswordError', 'Password must be at least 4 characters.');
      valid = false;
    }

    if (!valid) return;

    // Derive username from email if it looks like an email, else use as-is
    const isEmail  = App.isValidEmail(email);
    const username = isEmail ? email.split('@')[0] : email;

    // Build & persist the user object
    const user = {
      username,
      email: isEmail ? email : `${email}@moodtask.app`,
      passwordHash: btoa(password), // lightweight obfuscation (not production security)
      createdAt: new Date().toISOString(),
    };

    App.setUser(user);
    App.closeModal('loginModal');
    App.syncNavbar();
    App.showToast(`Welcome, ${username}! You're signed in. 🎉`);

    // Re-render task count label
    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
  }

  /* ─────────────────────────────────────────────────
     EDIT PROFILE
  ───────────────────────────────────────────────── */

  function handleEditProfileSave() {
    const username = elEditUsername.value.trim();
    const email    = elEditEmail.value.trim();

    App.clearFieldErrors(elEditModal);
    let valid = true;

    if (App.isEmpty(username)) {
      App.setFieldError('editUsername', 'editUsernameError', 'Username is required.');
      valid = false;
    }
    if (!App.isEmpty(email) && !App.isValidEmail(email)) {
      App.setFieldError('editEmail', 'editEmailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    const existing = App.getUser() || {};
    const updated  = { ...existing, username, email: email || existing.email, updatedAt: new Date().toISOString() };

    App.setUser(updated);
    App.closeModal('editProfileModal');
    App.syncNavbar();
    App.showToast('Profile updated successfully.');
  }

  /* ─────────────────────────────────────────────────
     LOGOUT
  ───────────────────────────────────────────────── */

  function handleLogout() {
    App.removeUser();
    App.closeModal('editProfileModal');
    App.syncNavbar();
    App.showToast('You\'ve been logged out. See you soon!');
    // Re-render so task count still shows
    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
  }

  /* ─────────────────────────────────────────────────
     ENTER KEY SUPPORT
  ───────────────────────────────────────────────── */

  function handleLoginKeydown(e) {
    if (e.key === 'Enter') handleLogin();
  }

  function handleEditKeydown(e) {
    if (e.key === 'Enter') handleEditProfileSave();
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */

  function init() {
    // Resolve DOM refs
    elProfileBtn      = document.getElementById('profileBtn');

    elLoginModal      = document.getElementById('loginModal');
    elLoginClose      = document.getElementById('loginModalClose');
    elLoginEmail      = document.getElementById('loginEmail');
    elLoginPassword   = document.getElementById('loginPassword');
    elLoginEmailErr   = document.getElementById('loginEmailError');
    elLoginPasswordErr= document.getElementById('loginPasswordError');
    elLoginSubmit     = document.getElementById('loginSubmitBtn');

    elEditModal       = document.getElementById('editProfileModal');
    elEditClose       = document.getElementById('editProfileModalClose');
    elEditUsername    = document.getElementById('editUsername');
    elEditEmail       = document.getElementById('editEmail');
    elEditUsernameErr = document.getElementById('editUsernameError');
    elEditEmailErr    = document.getElementById('editEmailError');
    elEditSave        = document.getElementById('editProfileSaveBtn');
    elLogout          = document.getElementById('logoutBtn');

    // Bind events
    elProfileBtn.addEventListener('click', handleProfileClick);

    elLoginClose .addEventListener('click', () => App.closeModal('loginModal'));
    elLoginSubmit.addEventListener('click', handleLogin);
    elLoginEmail.addEventListener('keydown',    handleLoginKeydown);
    elLoginPassword.addEventListener('keydown', handleLoginKeydown);

    elEditClose.addEventListener('click', () => App.closeModal('editProfileModal'));
    elEditSave .addEventListener('click', handleEditProfileSave);
    elEditUsername.addEventListener('keydown', handleEditKeydown);
    elEditEmail   .addEventListener('keydown', handleEditKeydown);
    elLogout      .addEventListener('click', handleLogout);

    console.log('[LoginForm] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, openLoginModal, openEditProfileModal };
})();
