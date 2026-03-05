/* ====================================================
   index.js — App Entry Point & UI Orchestrator
   Mood-Based To-Do App — Module 3

   This module:
     • imports pure-logic helpers from the other modules
     • owns all DOM event listeners
     • controls modal open/close
     • shows toast notifications
     • updates the navbar
     • re-renders the task list
   ==================================================== */

import { getUser, saveUser, clearUser, validateLogin, validateProfile } from './loginForm.js';
import { getTasks, saveTasks, createTask, deleteTask, toggleTask, updateTask, buildTaskCard } from './tasksComponent.js';
import { validateTaskForm } from './taskCreationForm.js';
import { getMood, saveMood } from './moodSelecter.js';

// ============================================================
//  SHARED DOM HELPERS
// ============================================================

/**
 * Open a modal by its element id (adds .is-open class).
 * @param {string} id
 */
function openModal(id) {
  document.getElementById(id)?.classList.add('is-open');
}

/**
 * Close a modal by its element id (removes .is-open class).
 * @param {string} id
 */
function closeModal(id) {
  document.getElementById(id)?.classList.remove('is-open');
}

/**
 * Display a toast notification at the bottom-left.
 * Automatically removes itself after ~3 seconds.
 *
 * @param {string}  message
 * @param {boolean} [isError=false]
 */
function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = isError ? 'toast toast--error' : 'toast';
  toast.innerHTML = `
    <span class="toast__icon">${isError ? '⚠️' : '✅'}</span>
    <span class="toast__text">${message}</span>
  `;

  // Prepend so newest toasts appear on top (container uses column-reverse)
  container.prepend(toast);

  // Exit animation → remove from DOM
  setTimeout(() => {
    toast.classList.add('toast--exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3200);
}

/**
 * Mark a form field as invalid and show an error message beneath it.
 * @param {string} inputId   — id of the <input>
 * @param {string} errorId   — id of the error <span>
 * @param {string} message
 */
function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('is-invalid');
  if (error) {
    error.textContent = `⚠ ${message}`;
    error.classList.add('visible');
  }
}

/**
 * Remove the invalid styling and error message from a form field.
 * @param {string} inputId
 * @param {string} errorId
 */
function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.remove('is-invalid');
  if (error) { error.textContent = ''; error.classList.remove('visible'); }
}

/**
 * Clear all field errors inside a form.
 * @param {string} formId — id of the <form>
 */
function clearFormErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.field-input.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  form.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

// ============================================================
//  NAVBAR
// ============================================================

/** Sync the navbar greeting to the current user (or Guest). */
function updateNavbar() {
  const user = getUser();
  const nameEl  = document.getElementById('user-welcome');
  const emailEl = document.getElementById('user-email');
  if (nameEl)  nameEl.textContent  = user ? user.name  : 'Welcome';
  if (emailEl) emailEl.textContent = user ? user.email : 'Guest.';
}

// ============================================================
//  MOOD
// ============================================================

/** Update the mood pill in the navbar to match localStorage. */
function updateMoodPill() {
  const mood = getMood();
  const emojiEl = document.getElementById('mood-emoji');
  const labelEl = document.getElementById('mood-label');
  if (emojiEl) emojiEl.textContent = mood ? mood.emoji : '😐';
  if (labelEl) labelEl.textContent = mood ? mood.mood  : 'Neutral';
}

/** Highlight the currently saved mood in the mood picker modal. */
function syncMoodButtons() {
  const mood = getMood();
  document.querySelectorAll('.mood-option').forEach(btn => {
    btn.classList.toggle('mood-option--active', mood ? btn.dataset.mood === mood.mood : false);
  });
}

// ============================================================
//  TASKS
// ============================================================

/** Whether to include completed tasks in the current render. */
let showingCompleted = false;

/**
 * Read tasks from localStorage and re-render the task grid.
 * Completed tasks are hidden unless showingCompleted is true.
 */
function refreshTasks() {
  const grid     = document.getElementById('task-grid');
  const emptyMsg = document.getElementById('tasks-empty-msg');
  if (!grid) return;

  const allTasks   = getTasks();
  const activeCnt  = allTasks.filter(t => !t.completed).length;
  const visible    = showingCompleted ? allTasks : allTasks.filter(t => !t.completed);

  // Update subtitle pill
  const countLabel = document.getElementById('task-count-label');
  if (countLabel) {
    countLabel.textContent =
      `You have ${activeCnt} task${activeCnt !== 1 ? 's' : ''} planned for today`;
  }

  // Remove stale cards but keep the empty-state message element
  grid.querySelectorAll('.task-card').forEach(c => c.remove());

  if (visible.length === 0) {
    if (emptyMsg) emptyMsg.style.display = '';
  } else {
    if (emptyMsg) emptyMsg.style.display = 'none';
    visible.forEach(task => {
      const card = buildTaskCard(task, handleDeleteTask, handleToggleTask, handleOpenEditTask);
      grid.appendChild(card);
    });
  }
}

/** Handle a delete request from a task card's trash button. */
function handleDeleteTask(id) {
  deleteTask(id);
  refreshTasks();
  showToast('Task deleted.');
}

/** Handle a toggle request from a task card's check button. */
function handleToggleTask(id) {
  toggleTask(id);
  refreshTasks();
}

/** Open the Edit Task modal pre-filled with the given task's data. */
function handleOpenEditTask(task) {
  document.getElementById('edit-task-id').value       = task.id;
  document.getElementById('edit-task-name').value     = task.title;
  document.getElementById('edit-task-duration').value = task.duration;
  document.getElementById('edit-task-time').value     = task.time;
  clearFormErrors('edit-task-form');
  openModal('edit-task-modal');
}

// ============================================================
//  BOOT — runs after the DOM is ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Initial sync ────────────────────────────────────────
  updateNavbar();
  updateMoodPill();
  refreshTasks();

  // ── Close any modal when the user clicks the dark backdrop ──
  ['login-modal', 'profile-modal', 'add-task-modal', 'edit-task-modal', 'mood-modal']
    .forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        if (e.target.id === id) closeModal(id);
      });
    });

  // ── Keyboard: Escape closes the topmost open modal ─────
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const modalIds = ['mood-modal', 'edit-task-modal', 'add-task-modal', 'profile-modal', 'login-modal'];
    for (const id of modalIds) {
      if (document.getElementById(id)?.classList.contains('is-open')) {
        closeModal(id);
        break;
      }
    }
  });

  // ════════════════════════════════════════════════════════
  //  PROFILE / AUTH BUTTONS
  // ════════════════════════════════════════════════════════

  // Profile icon: open Login if no user, otherwise open Profile Settings
  document.getElementById('profile-btn')?.addEventListener('click', () => {
    const user = getUser();
    if (user) {
      document.getElementById('profile-name').value  = user.name;
      document.getElementById('profile-email').value = user.email;
      clearFormErrors('profile-form');
      openModal('profile-modal');
    } else {
      document.getElementById('login-form').reset();
      clearFormErrors('login-form');
      openModal('login-modal');
    }
  });

  // Close buttons
  document.getElementById('close-login-modal')?.addEventListener('click',    () => closeModal('login-modal'));
  document.getElementById('close-profile-modal')?.addEventListener('click',  () => closeModal('profile-modal'));
  document.getElementById('close-add-task-modal')?.addEventListener('click', () => closeModal('add-task-modal'));
  document.getElementById('close-edit-task-modal')?.addEventListener('click',() => closeModal('edit-task-modal'));
  document.getElementById('close-mood-modal')?.addEventListener('click',     () => closeModal('mood-modal'));

  // ════════════════════════════════════════════════════════
  //  LOGIN FORM
  // ════════════════════════════════════════════════════════

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors('login-form');

    const name     = document.getElementById('login-name').value.trim();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const errors = validateLogin(name, email, password);

    if (Object.keys(errors).length > 0) {
      if (errors.name)     showFieldError('login-name',     'login-name-error',     errors.name);
      if (errors.email)    showFieldError('login-email',    'login-email-error',    errors.email);
      if (errors.password) showFieldError('login-password', 'login-password-error', errors.password);
      return;
    }

    saveUser({ name, email });
    document.getElementById('login-form').reset();
    closeModal('login-modal');
    updateNavbar();
    showToast(`Welcome, ${name}! You're logged in. 👋`);
  });

  // ════════════════════════════════════════════════════════
  //  PROFILE / EDIT USER FORM
  // ════════════════════════════════════════════════════════

  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors('profile-form');

    const name  = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();

    const errors = validateProfile(name, email);

    if (Object.keys(errors).length > 0) {
      if (errors.name)  showFieldError('profile-name',  'profile-name-error',  errors.name);
      if (errors.email) showFieldError('profile-email', 'profile-email-error', errors.email);
      return;
    }

    saveUser({ name, email });
    closeModal('profile-modal');
    updateNavbar();
    showToast('Profile updated successfully!');
  });

  // Logout button inside Profile Settings modal
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearUser();
    closeModal('profile-modal');
    updateNavbar();
    showToast('Logged out. See you next time!');
  });

  // ════════════════════════════════════════════════════════
  //  ADD TASK
  // ════════════════════════════════════════════════════════

  document.getElementById('add-task-btn')?.addEventListener('click', () => {
    document.getElementById('add-task-form').reset();
    clearFormErrors('add-task-form');
    openModal('add-task-modal');
  });

  document.getElementById('add-task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors('add-task-form');

    const title    = document.getElementById('new-task-name').value.trim();
    const duration = document.getElementById('new-task-duration').value;
    const time     = document.getElementById('new-task-time').value;

    const errors = validateTaskForm(title, duration, time);

    if (Object.keys(errors).length > 0) {
      if (errors.title)    showFieldError('new-task-name',     'new-task-name-error',     errors.title);
      if (errors.duration) showFieldError('new-task-duration', 'new-task-duration-error', errors.duration);
      if (errors.time)     showFieldError('new-task-time',     'new-task-time-error',     errors.time);
      return;
    }

    createTask(title, Number(duration), time);
    document.getElementById('add-task-form').reset();
    closeModal('add-task-modal');
    refreshTasks();
    showToast(`"${title}" added to your tasks!`);
  });

  // ════════════════════════════════════════════════════════
  //  EDIT TASK
  // ════════════════════════════════════════════════════════

  document.getElementById('edit-task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors('edit-task-form');

    const id       = document.getElementById('edit-task-id').value;
    const title    = document.getElementById('edit-task-name').value.trim();
    const duration = document.getElementById('edit-task-duration').value;
    const time     = document.getElementById('edit-task-time').value;

    const errors = validateTaskForm(title, duration, time);

    if (Object.keys(errors).length > 0) {
      if (errors.title)    showFieldError('edit-task-name',     'edit-task-name-error',     errors.title);
      if (errors.duration) showFieldError('edit-task-duration', 'edit-task-duration-error', errors.duration);
      if (errors.time)     showFieldError('edit-task-time',     'edit-task-time-error',     errors.time);
      return;
    }

    updateTask(id, title, Number(duration), time);
    closeModal('edit-task-modal');
    refreshTasks();
    showToast('Task updated successfully!');
  });

  // ════════════════════════════════════════════════════════
  //  COMPLETE ALL & SHOW/HIDE COMPLETED
  // ════════════════════════════════════════════════════════

  document.getElementById('complete-all-btn')?.addEventListener('click', () => {
    const tasks   = getTasks();
    const updated = tasks.map(t => ({ ...t, completed: true }));
    saveTasks(updated);
    refreshTasks();
    showToast('All tasks marked as complete! 🎉');
  });

  const showCompletedBtn = document.getElementById('show-completed-btn');
  showCompletedBtn?.addEventListener('click', () => {
    showingCompleted = !showingCompleted;
    showCompletedBtn.textContent = showingCompleted ? 'Hide Completed' : 'Show Completed';
    refreshTasks();
  });

  // ════════════════════════════════════════════════════════
  //  MOOD SELECTOR
  // ════════════════════════════════════════════════════════

  document.getElementById('mood-btn')?.addEventListener('click', () => {
    syncMoodButtons();
    // Enable confirm only if a mood is already saved
    const confirmBtn = document.getElementById('confirm-mood-btn');
    if (confirmBtn) confirmBtn.disabled = !getMood();
    openModal('mood-modal');
  });

  // Track which mood is selected inside the modal
  let selectedMoodData = getMood();

  document.querySelectorAll('.mood-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-option').forEach(b => b.classList.remove('mood-option--active'));
      btn.classList.add('mood-option--active');
      selectedMoodData = { mood: btn.dataset.mood, emoji: btn.dataset.emoji };
      const confirmBtn = document.getElementById('confirm-mood-btn');
      if (confirmBtn) confirmBtn.disabled = false;
    });
  });

  document.getElementById('confirm-mood-btn')?.addEventListener('click', () => {
    if (!selectedMoodData) return;
    saveMood(selectedMoodData.mood, selectedMoodData.emoji);
    updateMoodPill();
    closeModal('mood-modal');
    // Also update the emoji shown on the mood suggestion item
    const moodIconEl = document.getElementById('suggestion-mood-emoji');
    if (moodIconEl) moodIconEl.textContent = selectedMoodData.emoji;
    showToast(`Mood set to ${selectedMoodData.mood} ${selectedMoodData.emoji}`);
  });

  // ════════════════════════════════════════════════════════
  //  SUGGESTED TASK ACCEPT BUTTONS
  // ════════════════════════════════════════════════════════

  // Each suggestion card's check button has data-title, data-duration, data-time
  document.querySelectorAll('.suggestion-item__check').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title    = btn.dataset.title;
      const duration = Number(btn.dataset.duration);
      const time     = btn.dataset.time;

      if (!title) return;

      createTask(title, duration, time);
      refreshTasks();
      showToast(`"${title}" added to your tasks!`);

      // Visual feedback: briefly animate the check button
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    });
  });

}); // end DOMContentLoaded
