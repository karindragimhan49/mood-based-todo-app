/* ====================================================
   index.js — App Entry Point & UI Orchestrator
   Mood-Based To-Do App — Module 4

   New in Module 4 vs Module 3:
     • Weather API fetch via navigator.geolocation → /api/weather
     • Weather modal wired (open / close / escape / backdrop)
     • Navbar weather icon updates with live condition
     • Completed tasks render in their OWN section (#completed-section)
       instead of being mixed into the active grid
     • "Show Completed" button toggles #completed-section visibility
     • Mood confirm + weather fetch both call updateSuggestions()
   ==================================================== */

import { getUser, saveUser, clearUser, validateLogin, validateProfile } from './loginForm.js';
import { getTasks, saveTasks, createTask, deleteTask, toggleTask, updateTask, buildTaskCard } from './tasksComponent.js';
import { validateTaskForm } from './taskCreationForm.js';
import { getMood, saveMood } from './moodSelecter.js';
import { updateSuggestions } from './suggestedTaskComponent.js';

// ── Module-level weather state ─────────────────────────────────
let weatherCondition = 'Cloudy'; // updated once the API responds

// ============================================================
//  SHARED DOM HELPERS
// ============================================================

function openModal(id) {
  document.getElementById(id)?.classList.add('is-open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('is-open');
}

function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = isError ? 'toast toast--error' : 'toast';
  toast.innerHTML = `
    <span class="toast__icon">${isError ? '⚠️' : '✅'}</span>
    <span class="toast__text">${message}</span>
  `;
  container.prepend(toast);

  setTimeout(() => {
    toast.classList.add('toast--exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3200);
}

function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('is-invalid');
  if (error) {
    error.textContent = `⚠ ${message}`;
    error.classList.add('visible');
  }
}

function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.remove('is-invalid');
  if (error) { error.textContent = ''; error.classList.remove('visible'); }
}

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

function updateMoodPill() {
  const mood = getMood();
  const emojiEl = document.getElementById('mood-emoji');
  const labelEl = document.getElementById('mood-label');
  if (emojiEl) emojiEl.textContent = mood ? mood.emoji : '😐';
  if (labelEl) labelEl.textContent = mood ? mood.mood  : 'Neutral';
}

function syncMoodButtons() {
  const mood = getMood();
  document.querySelectorAll('.mood-option').forEach(btn => {
    btn.classList.toggle('mood-option--active', mood ? btn.dataset.mood === mood.mood : false);
  });
}

// ============================================================
//  WEATHER
// ============================================================

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showWeatherError(msg) {
  const el = document.getElementById('weather-error');
  if (el) { el.textContent = msg; el.style.display = ''; }
}

/** Replace the cloud SVG in the navbar button with the live icon. */
function updateNavbarWeatherIcon(conditionText, iconUrl) {
  const btn = document.getElementById('weather-btn');
  if (!btn) return;
  btn.innerHTML = `<img src="${iconUrl}" alt="${conditionText}" width="22" height="22"
    style="border-radius:4px;vertical-align:middle;" title="${conditionText}" />`;
}

/**
 * Fetch live weather from our Express proxy → /api/weather.
 * Updates the weather modal, navbar icon, and suggestions.
 */
async function fetchWeather() {
  if (!navigator.geolocation) {
    showWeatherError('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const res  = await fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`);
        const data = await res.json();

        if (data.error) { showWeatherError(data.error); return; }

        const c   = data.current;
        const loc = data.location;
        weatherCondition = c.condition.text;

        // Populate weather modal
        const iconImg = document.getElementById('weather-icon-img');
        if (iconImg) { iconImg.src = 'https:' + c.condition.icon; iconImg.alt = c.condition.text; }
        setText('weather-temp',      `${c.temp_c}°C`);
        setText('weather-condition', c.condition.text);
        setText('weather-humidity',  `${c.humidity}%`);
        setText('weather-location',  `${loc.name}, ${loc.country}`);
        const errEl = document.getElementById('weather-error');
        if (errEl) errEl.style.display = 'none';

        // Update navbar button icon
        updateNavbarWeatherIcon(c.condition.text, 'https:' + c.condition.icon);

        // Refresh suggestions with live weather
        const mood = getMood();
        updateSuggestions(mood?.mood ?? 'Neutral', weatherCondition);

      } catch (err) {
        console.error('[fetchWeather]', err);
        showWeatherError('Could not load weather data.');
      }
    },
    () => {
      setText('weather-condition', 'Location unavailable');
      showWeatherError('Location permission denied.');
    }
  );
}

// ============================================================
//  TASKS  —  active grid + completed grid
// ============================================================

let showingCompleted = false;

/** Render only active (non-completed) tasks into #task-grid. */
function refreshTasks() {
  const grid     = document.getElementById('task-grid');
  const emptyMsg = document.getElementById('tasks-empty-msg');
  if (!grid) return;

  const activeTasks = getTasks().filter(t => !t.completed);

  const countLabel = document.getElementById('task-count-label');
  if (countLabel) {
    const n = activeTasks.length;
    countLabel.textContent = `You have ${n} task${n !== 1 ? 's' : ''} planned for today`;
  }

  grid.querySelectorAll('.task-card').forEach(c => c.remove());

  if (activeTasks.length === 0) {
    if (emptyMsg) emptyMsg.style.display = '';
  } else {
    if (emptyMsg) emptyMsg.style.display = 'none';
    activeTasks.forEach(task => {
      grid.appendChild(buildTaskCard(task, handleDeleteTask, handleToggleTask, handleOpenEditTask));
    });
  }
}

/** Render completed tasks into #completed-grid (only when section is visible). */
function refreshCompletedTasks() {
  const section  = document.getElementById('completed-section');
  const grid     = document.getElementById('completed-grid');
  const emptyMsg = document.getElementById('completed-empty-msg');
  if (!grid || !section) return;

  section.style.display = showingCompleted ? '' : 'none';
  if (!showingCompleted) return;

  const completedTasks = getTasks().filter(t => t.completed);
  grid.querySelectorAll('.task-card').forEach(c => c.remove());

  if (completedTasks.length === 0) {
    if (emptyMsg) emptyMsg.style.display = '';
  } else {
    if (emptyMsg) emptyMsg.style.display = 'none';
    completedTasks.forEach(task => {
      grid.appendChild(buildTaskCard(task, handleDeleteTask, handleToggleTask, handleOpenEditTask));
    });
  }
}

/** Refresh both grids. Always call this after any task state change. */
function refreshAll() {
  refreshTasks();
  refreshCompletedTasks();
}

function handleDeleteTask(id) {
  deleteTask(id);
  refreshAll();
  showToast('Task deleted.');
}

function handleToggleTask(id) {
  toggleTask(id);
  refreshAll(); // card instantly moves between grids
}

function handleOpenEditTask(task) {
  document.getElementById('edit-task-id').value       = task.id;
  document.getElementById('edit-task-name').value     = task.title;
  document.getElementById('edit-task-duration').value = task.duration;
  document.getElementById('edit-task-time').value     = task.time;
  clearFormErrors('edit-task-form');
  openModal('edit-task-modal');
}

// ============================================================
//  BOOT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Initial render ──────────────────────────────────────
  updateNavbar();
  updateMoodPill();
  refreshAll();
  updateSuggestions(getMood()?.mood ?? 'Neutral', weatherCondition);

  // Fetch weather in the background (no blocking)
  fetchWeather();

  // ── Backdrop + Escape for ALL modals ───────────────────
  const ALL_MODALS = [
    'login-modal', 'profile-modal', 'add-task-modal',
    'edit-task-modal', 'mood-modal', 'weather-modal',
  ];

  ALL_MODALS.forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      if (e.target.id === id) closeModal(id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    for (const id of [...ALL_MODALS].reverse()) {
      if (document.getElementById(id)?.classList.contains('is-open')) {
        closeModal(id); break;
      }
    }
  });

  // ════════════════════════════════════════════════════════
  //  WEATHER MODAL
  // ════════════════════════════════════════════════════════

  document.getElementById('weather-btn')?.addEventListener('click', () => openModal('weather-modal'));
  document.getElementById('close-weather-modal')?.addEventListener('click', () => closeModal('weather-modal'));

  // ════════════════════════════════════════════════════════
  //  PROFILE / AUTH
  // ════════════════════════════════════════════════════════

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

  document.getElementById('close-login-modal')?.addEventListener('click',    () => closeModal('login-modal'));
  document.getElementById('close-profile-modal')?.addEventListener('click',  () => closeModal('profile-modal'));
  document.getElementById('close-add-task-modal')?.addEventListener('click', () => closeModal('add-task-modal'));
  document.getElementById('close-edit-task-modal')?.addEventListener('click',() => closeModal('edit-task-modal'));
  document.getElementById('close-mood-modal')?.addEventListener('click',     () => closeModal('mood-modal'));

  // ════════════════════════════════════════════════════════
  //  LOGIN
  // ════════════════════════════════════════════════════════

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors('login-form');

    const name     = document.getElementById('login-name').value.trim();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errors   = validateLogin(name, email, password);

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
  //  PROFILE EDIT
  // ════════════════════════════════════════════════════════

  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors('profile-form');

    const name   = document.getElementById('profile-name').value.trim();
    const email  = document.getElementById('profile-email').value.trim();
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
    const errors   = validateTaskForm(title, duration, time);

    if (Object.keys(errors).length > 0) {
      if (errors.title)    showFieldError('new-task-name',     'new-task-name-error',     errors.title);
      if (errors.duration) showFieldError('new-task-duration', 'new-task-duration-error', errors.duration);
      if (errors.time)     showFieldError('new-task-time',     'new-task-time-error',     errors.time);
      return;
    }

    createTask(title, Number(duration), time);
    document.getElementById('add-task-form').reset();
    closeModal('add-task-modal');
    refreshAll();
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
    const errors   = validateTaskForm(title, duration, time);

    if (Object.keys(errors).length > 0) {
      if (errors.title)    showFieldError('edit-task-name',     'edit-task-name-error',     errors.title);
      if (errors.duration) showFieldError('edit-task-duration', 'edit-task-duration-error', errors.duration);
      if (errors.time)     showFieldError('edit-task-time',     'edit-task-time-error',     errors.time);
      return;
    }

    updateTask(id, title, Number(duration), time);
    closeModal('edit-task-modal');
    refreshAll();
    showToast('Task updated successfully!');
  });

  // ════════════════════════════════════════════════════════
  //  COMPLETE ALL  &  SHOW / HIDE COMPLETED
  // ════════════════════════════════════════════════════════

  document.getElementById('complete-all-btn')?.addEventListener('click', () => {
    saveTasks(getTasks().map(t => ({ ...t, completed: true })));
    // Auto-reveal completed section so the user sees the result
    if (!showingCompleted) {
      showingCompleted = true;
      const btn = document.getElementById('show-completed-btn');
      if (btn) btn.textContent = 'Hide Completed';
    }
    refreshAll();
    showToast('All tasks marked as complete! 🎉');
  });

  document.getElementById('show-completed-btn')?.addEventListener('click', function () {
    showingCompleted = !showingCompleted;
    this.textContent = showingCompleted ? 'Hide Completed' : 'Show Completed';
    refreshAll();
  });

  // ════════════════════════════════════════════════════════
  //  MOOD SELECTOR
  // ════════════════════════════════════════════════════════

  document.getElementById('mood-btn')?.addEventListener('click', () => {
    syncMoodButtons();
    const confirmBtn = document.getElementById('confirm-mood-btn');
    if (confirmBtn) confirmBtn.disabled = !getMood();
    openModal('mood-modal');
  });

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

    const moodIconEl = document.getElementById('suggestion-mood-emoji');
    if (moodIconEl) moodIconEl.textContent = selectedMoodData.emoji;

    // Refresh suggestions with new mood + current weather condition
    updateSuggestions(selectedMoodData.mood, weatherCondition);

    showToast(`Mood set to ${selectedMoodData.mood} ${selectedMoodData.emoji}`);
  });

  // ════════════════════════════════════════════════════════
  //  SUGGESTED TASK ACCEPT (event delegation — works after
  //  updateSuggestions() swaps in new content)
  // ════════════════════════════════════════════════════════

  document.getElementById('suggestions-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.suggestion-item__check');
    if (!btn) return;
    e.stopPropagation();

    const title    = btn.dataset.title;
    const duration = Number(btn.dataset.duration);
    const time     = btn.dataset.time;
    if (!title) return;

    createTask(title, duration, time);
    refreshAll();
    showToast(`"${title}" added to your tasks!`);

    btn.style.transform = 'scale(1.3)';
    setTimeout(() => { btn.style.transform = ''; }, 300);
  });

}); // end DOMContentLoaded
