/**
 * index.js — App Namespace & Core Utilities
 * ------------------------------------------
 * Load order: 1st
 * Exposes the global `App` object used by all other modules.
 */
'use strict';

const App = (() => {

  /* ─────────────────────────────────────────────────
     STORAGE KEYS
  ───────────────────────────────────────────────── */
  const KEYS = {
    USER:  'moodtask_user',
    TASKS: 'moodtask_tasks',
    MOOD:  'moodtask_mood',
  };

  /* ─────────────────────────────────────────────────
     LOCALSTORAGE HELPERS
  ───────────────────────────────────────────────── */
  function storageGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error('Storage write failed', e); }
  }
  function storageRemove(key) {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  }

  /* User */
  const getUser    = () => storageGet(KEYS.USER);
  const setUser    = (u) => storageSet(KEYS.USER, u);
  const removeUser = ()  => storageRemove(KEYS.USER);

  /* Tasks */
  const getTasks = ()    => storageGet(KEYS.TASKS) || [];
  const setTasks = (arr) => storageSet(KEYS.TASKS, arr);

  /* Mood */
  const getMood = ()    => storageGet(KEYS.MOOD) || 'Neutral';
  const setMood = (m)   => storageSet(KEYS.MOOD, m);

  /* ─────────────────────────────────────────────────
     UTILITIES
  ───────────────────────────────────────────────── */
  function generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  /** YYYY-MM-DD → "Mar 5, 2026"  (timezone-safe) */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  /** ISO timestamp → "12:43 PM" */
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  /* ─────────────────────────────────────────────────
     TOAST NOTIFICATIONS
  ───────────────────────────────────────────────── */
  function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast${type === 'error' ? ' toast--error' : ''}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    container.appendChild(toast);

    const dismiss = () => {
      toast.classList.add('toast--out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    const timer = setTimeout(dismiss, duration);
    toast.addEventListener('click', () => { clearTimeout(timer); dismiss(); });
  }

  /* ─────────────────────────────────────────────────
     MODAL CONTROLS
  ───────────────────────────────────────────────── */
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element
    const focusable = el.querySelector('input, button, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusable) requestAnimationFrame(() => focusable.focus());
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('hidden', '');
    // Only release scroll lock if no other modals are open
    const anyOpen = document.querySelectorAll('.modal-overlay:not([hidden])').length > 0;
    if (!anyOpen) document.body.style.overflow = '';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.setAttribute('hidden', ''));
    document.body.style.overflow = '';
  }

  function setupModalBackdropClose(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      if (e.target === el) closeModal(id);
    });
  }

  /* ─────────────────────────────────────────────────
     VALIDATION HELPERS
  ───────────────────────────────────────────────── */
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isEmpty      = (v) => !v || !v.trim();

  function setFieldError(inputId, errId, message) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (input) input.classList.add('input--error');
    if (err)   err.textContent = message;
  }

  function clearFieldErrors(...pairs) {
    pairs.forEach(([inputId, errId]) => {
      const input = document.getElementById(inputId);
      const err   = document.getElementById(errId);
      if (input) input.classList.remove('input--error');
      if (err)   err.textContent = '';
    });
  }

  /* ─────────────────────────────────────────────────
     GLOBAL CLOSE BUTTON DELEGATION
     Anything with data-modal="<id>" closes that modal.
  ───────────────────────────────────────────────── */
  function setupCloseButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-modal]');
      if (btn) closeModal(btn.dataset.modal);
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const open = document.querySelector('.modal-overlay:not([hidden])');
        if (open) closeModal(open.id);
      }
    });
  }

  /* ─────────────────────────────────────────────────
     NAVBAR SYNC
  ───────────────────────────────────────────────── */
  function syncNavbar() {
    const user       = getUser();
    const usernameEl = document.getElementById('navUsername');
    const avatarEl   = document.getElementById('navAvatar');
    const roleEl     = document.getElementById('navRole');

    if (usernameEl) usernameEl.textContent = user ? user.username : 'Sign In';
    if (avatarEl)   avatarEl.textContent   = user ? user.username.charAt(0).toUpperCase() : '?';
    if (roleEl)     roleEl.textContent     = user ? user.email : '';
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    setupCloseButtons();
    setupModalBackdropClose('loginModal');
    setupModalBackdropClose('editProfileModal');
    setupModalBackdropClose('taskModal');
    setupModalBackdropClose('moodModal');
    setupModalBackdropClose('weatherModal');
    syncNavbar();
  }

  /* ── Public API ─────────────────────────────────── */
  return {
    /* Storage */
    getUser, setUser, removeUser,
    getTasks, setTasks,
    getMood, setMood,
    /* Utilities */
    generateId, formatDate, formatTime,
    /* UI */
    showToast, openModal, closeModal, closeAllModals,
    /* Validation */
    isValidEmail, isEmpty, setFieldError, clearFieldErrors,
    /* Navbar */
    syncNavbar,
    /* Boot */
    init,
  };
})();

/* ─────────────────────────────────────────────────
   BOOT — run after all scripts are loaded
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  if (typeof LoginForm          !== 'undefined') LoginForm.init();
  if (typeof TasksComponent     !== 'undefined') TasksComponent.init();
  if (typeof TaskCreationForm   !== 'undefined') TaskCreationForm.init();
  if (typeof SuggestedTasks     !== 'undefined') SuggestedTasks.init();
  if (typeof MoodSelector       !== 'undefined') MoodSelector.init();
  if (typeof WeatherModule      !== 'undefined') WeatherModule.init();
});
