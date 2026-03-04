/**
 * loginForm.js — Authentication Module
 * --------------------------------------
 * Login / create account, edit profile, logout.
 * Load order: 2nd
 */
'use strict';

const LoginForm = (() => {

  /* ─────────────────────────────────────────────────
     OPEN MODALS
  ───────────────────────────────────────────────── */
  function openLoginModal() {
    resetLoginForm();
    App.openModal('loginModal');
  }

  function openEditProfileModal() {
    const user = App.getUser();
    if (!user) return openLoginModal();

    // Pre-fill
    const un = document.getElementById('editUsername');
    const em = document.getElementById('editEmail');
    if (un) un.value = user.username || '';
    if (em) em.value = user.email    || '';

    App.clearFieldErrors(
      ['editUsername', 'editUsernameErr'],
      ['editEmail',    'editEmailErr'],
    );
    App.openModal('editProfileModal');
  }

  /* ─────────────────────────────────────────────────
     PROFILE BUTTON CLICK
  ───────────────────────────────────────────────── */
  function handleProfileClick() {
    if (App.getUser()) {
      openEditProfileModal();
    } else {
      openLoginModal();
    }
  }

  /* ─────────────────────────────────────────────────
     LOGIN / CREATE ACCOUNT
  ───────────────────────────────────────────────── */
  function handleLogin(e) {
    if (e) e.preventDefault();

    const emailEl = document.getElementById('loginEmail');
    const passEl  = document.getElementById('loginPassword');
    if (!emailEl || !passEl) return;

    const email    = emailEl.value.trim();
    const password = passEl.value;

    // Reset errors
    App.clearFieldErrors(
      ['loginEmail',    'loginEmailErr'],
      ['loginPassword', 'loginPasswordErr'],
    );

    let valid = true;

    if (!App.isValidEmail(email)) {
      App.setFieldError('loginEmail', 'loginEmailErr', 'Please enter a valid email address.');
      valid = false;
    }
    if (App.isEmpty(password)) {
      App.setFieldError('loginPassword', 'loginPasswordErr', 'Password is required.');
      valid = false;
    } else if (password.length < 4) {
      App.setFieldError('loginPassword', 'loginPasswordErr', 'Password must be at least 4 characters.');
      valid = false;
    }

    if (!valid) return;

    // Derive username from email prefix
    const username = email.split('@')[0].replace(/[^a-z0-9_.-]/gi, '');

    const user = {
      username,
      email,
      passwordHash: btoa(password),
      createdAt:    new Date().toISOString(),
    };

    App.setUser(user);
    App.syncNavbar();
    App.closeModal('loginModal');
    App.showToast(`Welcome, ${username}! 👋`);
    resetLoginForm();

    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
  }

  /* ─────────────────────────────────────────────────
     EDIT PROFILE SAVE
  ───────────────────────────────────────────────── */
  function handleEditProfileSave(e) {
    if (e) e.preventDefault();

    const unEl = document.getElementById('editUsername');
    const emEl = document.getElementById('editEmail');
    if (!unEl || !emEl) return;

    const username = unEl.value.trim();
    const email    = emEl.value.trim();

    App.clearFieldErrors(
      ['editUsername', 'editUsernameErr'],
      ['editEmail',    'editEmailErr'],
    );

    let valid = true;
    if (App.isEmpty(username)) {
      App.setFieldError('editUsername', 'editUsernameErr', 'Username is required.');
      valid = false;
    }
    if (!App.isValidEmail(email)) {
      App.setFieldError('editEmail', 'editEmailErr', 'Enter a valid email address.');
      valid = false;
    }
    if (!valid) return;

    const existing = App.getUser() || {};
    App.setUser({ ...existing, username, email, updatedAt: new Date().toISOString() });
    App.syncNavbar();
    App.closeModal('editProfileModal');
    App.showToast('Profile updated! ✅');
  }

  /* ─────────────────────────────────────────────────
     LOGOUT
  ───────────────────────────────────────────────── */
  function handleLogout() {
    App.removeUser();
    App.syncNavbar();
    App.closeModal('editProfileModal');
    App.showToast('Logged out. See you soon! 👋');
    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
  }

  /* ─────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────── */
  function resetLoginForm() {
    const form = document.getElementById('loginFormEl');
    if (form) form.reset();
    App.clearFieldErrors(
      ['loginEmail',    'loginEmailErr'],
      ['loginPassword', 'loginPasswordErr'],
    );
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    /* Profile button */
    document.getElementById('profileBtn')
      ?.addEventListener('click', handleProfileClick);

    /* Login form */
    document.getElementById('loginFormEl')
      ?.addEventListener('submit', handleLogin);

    document.getElementById('loginCancelBtn')
      ?.addEventListener('click', () => App.closeModal('loginModal'));

    /* Edit profile form */
    document.getElementById('editProfileFormEl')
      ?.addEventListener('submit', handleEditProfileSave);

    document.getElementById('editProfileCancelBtn')
      ?.addEventListener('click', () => App.closeModal('editProfileModal'));

    document.getElementById('logoutBtn')
      ?.addEventListener('click', handleLogout);

    /* Enter key on login inputs */
    ['loginEmail', 'loginPassword'].forEach(id => {
      document.getElementById(id)
        ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleLogin(e); });
    });

    console.log('[LoginForm] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, openLoginModal, openEditProfileModal };
})();
