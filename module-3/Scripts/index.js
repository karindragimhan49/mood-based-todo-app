/**
 * index.js — App Core
 * --------------------------------------------------
 * Establishes the global `App` namespace, exposes
 * localStorage helpers, the toast system, and wires
 * up the DOM-ready initialisation sequence.
 *
 * Load order:  1st  (all other scripts depend on this)
 */

'use strict';

/* ─────────────────────────────────────────────────────
   GLOBAL NAMESPACE
   All modules attach their public API here.
───────────────────────────────────────────────────── */
const App = (() => {

  /* ── localStorage Keys ──────────────────────────── */
  const KEYS = {
    USER:  'moodtask_user',
    TASKS: 'moodtask_tasks',
    MOOD:  'moodtask_mood',
  };

  /* ── localStorage Helpers ───────────────────────── */

  /** Read & parse a JSON value.  Returns `null` on miss / parse error. */
  function storageGet(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /** Serialise and write a value. */
  function storageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[App] localStorage write failed:', e);
    }
  }

  /** Remove a key. */
  function storageRemove(key) {
    localStorage.removeItem(key);
  }

  /* ── User helpers ───────────────────────────────── */
  const getUser   = ()       => storageGet(KEYS.USER);
  const setUser   = (u)      => storageSet(KEYS.USER, u);
  const removeUser= ()       => storageRemove(KEYS.USER);

  /* ── Task helpers ───────────────────────────────── */
  const getTasks  = ()       => storageGet(KEYS.TASKS) || [];
  const setTasks  = (tasks)  => storageSet(KEYS.TASKS, tasks);

  /* ── Mood helpers ───────────────────────────────── */
  const getMood   = ()       => storageGet(KEYS.MOOD) || 'Neutral';
  const setMood   = (mood)   => storageSet(KEYS.MOOD, mood);

  /* ── ID generator ───────────────────────────────── */
  function generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  /* ── Date Formatter ─────────────────────────────── */
  /**
   * Format a date string / Date to "H:MM AM/PM"
   * Falls back gracefully if date is invalid.
   */
  function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  /**
   * Format date string to "MMM D, YYYY"
   */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    // dateStr from <input type="date"> is "YYYY-MM-DD"
    // Parse as local date to avoid timezone shift
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ─────────────────────────────────────────────────
     TOAST NOTIFICATION SYSTEM
  ───────────────────────────────────────────────── */

  /**
   * Show a bottom-left toast.
   * @param {string}  message   - Text to display
   * @param {'success'|'error'} type  - Visual style
   * @param {number}  duration  - Auto-dismiss ms (default 3000)
   */
  function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast${type === 'error' ? ' toast--error' : ''}`;

    // Icon
    const iconSvg = type === 'error'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
           <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
         </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="20 6 9 17 4 12"/>
         </svg>`;

    toast.innerHTML = `<span class="toast__icon">${iconSvg}</span>${message}`;
    container.appendChild(toast);

    // Auto dismiss
    const dismiss = () => {
      toast.classList.add('toast--hide');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    const timer = setTimeout(dismiss, duration);

    // Allow manual dismiss on click
    toast.addEventListener('click', () => {
      clearTimeout(timer);
      dismiss();
    });
  }

  /* ─────────────────────────────────────────────────
     NAVBAR UI HELPERS
  ───────────────────────────────────────────────── */

  /** Update navbar name / role from stored user */
  function syncNavbar() {
    const user = getUser();
    const nameEl = document.getElementById('navUsername');
    const roleEl = document.getElementById('navRole');
    if (!nameEl || !roleEl) return;

    if (user) {
      nameEl.textContent = user.username || 'User';
      roleEl.textContent = user.email   || '';
    } else {
      nameEl.textContent = 'Welcome';
      roleEl.textContent = 'Guest.';
    }
  }

  /* ─────────────────────────────────────────────────
     MODAL HELPERS
  ───────────────────────────────────────────────── */

  /** Open a modal (remove hidden, prevent body scroll) */
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  /** Close a modal and restore scroll */
  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.setAttribute('hidden', '');
    // Restore scroll only if no other modals are open
    const open = document.querySelector('.modal-overlay:not([hidden])');
    if (!open) document.body.style.overflow = '';
  }

  /** Close modal when clicking the overlay backdrop */
  function setupModalBackdropClose(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.addEventListener('click', (e) => {
      if (e.target === el) closeModal(modalId);
    });
  }

  /** Bind ESC key to close all open modals */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m => {
      closeModal(m.id);
    });
  });

  /* ─────────────────────────────────────────────────
     VALIDATION HELPERS
  ───────────────────────────────────────────────── */
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isEmpty      = (v) => !v || !v.trim();

  /** Set/clear an error message and input styling */
  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.toggle('input-error', Boolean(message));
    if (error) error.textContent = message || '';
  }

  /** Clear all field errors in a container */
  function clearFieldErrors(containerEl) {
    containerEl.querySelectorAll('.field-error').forEach(e => (e.textContent = ''));
    containerEl.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  }

  /* ─────────────────────────────────────────────────
     APP INITIALISATION
  ───────────────────────────────────────────────── */
  function init() {
    // Sync UI from stored state immediately
    syncNavbar();

    // Wire backdrop closes for every modal
    ['loginModal', 'editProfileModal', 'taskModal', 'moodModal'].forEach(id => {
      setupModalBackdropClose(id);
    });

    console.log('[App] Core initialised.');
  }

  /* ─────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────── */
  return {
    // Keys
    KEYS,
    // Storage
    getUser, setUser, removeUser,
    getTasks, setTasks,
    getMood,  setMood,
    storageGet, storageSet, storageRemove,
    // Utilities
    generateId, formatTime, formatDate,
    // Toast
    showToast,
    // Navbar
    syncNavbar,
    // Modal
    openModal, closeModal,
    // Validation
    isValidEmail, isEmpty, setFieldError, clearFieldErrors,
    // Init
    init,
  };
})();

/* ─────────────────────────────────────────────────────
   BOOT — wait for all scripts before calling module inits
───────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Core init (navbar sync, modal backdrops, ESC handler)
  App.init();

  // Module inits (defined in their respective files)
  if (typeof LoginForm           !== 'undefined') LoginForm.init();
  if (typeof TasksComponent      !== 'undefined') TasksComponent.init();
  if (typeof TaskCreationForm    !== 'undefined') TaskCreationForm.init();
  if (typeof SuggestedTasks      !== 'undefined') SuggestedTasks.init();
  if (typeof MoodSelector        !== 'undefined') MoodSelector.init();
});
