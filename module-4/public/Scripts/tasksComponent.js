/* ====================================================
   tasksComponent.js — Task CRUD & DOM Card Builder
   Mood-Based To-Do App — Module 3
   ==================================================== */

const TASKS_KEY = 'moodtodo_tasks';

// ── LocalStorage Helpers ───────────────────────────────────────

/**
 * Read all tasks from localStorage.
 * @returns {Array}
 */
export function getTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Overwrite the entire tasks array in localStorage.
 * @param {Array} tasks
 */
export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// ── ID Generation ──────────────────────────────────────────────

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

// ── CRUD Operations ────────────────────────────────────────────

/**
 * Create a new task and persist it to localStorage.
 * @param {string} title
 * @param {number} duration  — minutes
 * @param {string} time      — "HH:MM" 24-hour
 * @returns {Object} the new task
 */
export function createTask(title, duration, time) {
  const tasks = getTasks();
  const task = {
    id: generateId(),
    title: title.trim(),
    duration: Number(duration),
    time,
    completed: false,
    createdAt: Date.now(),
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

/**
 * Permanently remove a task by id.
 * @param {string} id
 */
export function deleteTask(id) {
  saveTasks(getTasks().filter(t => t.id !== id));
}

/**
 * Flip the completed boolean of a task.
 * @param {string} id
 */
export function toggleTask(id) {
  saveTasks(
    getTasks().map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  );
}

/**
 * Update a task's editable fields.
 * @param {string} id
 * @param {string} title
 * @param {number} duration
 * @param {string} time
 */
export function updateTask(id, title, duration, time) {
  saveTasks(
    getTasks().map(t =>
      t.id === id ? { ...t, title: title.trim(), duration: Number(duration), time } : t
    )
  );
}

// ── DOM Builder ────────────────────────────────────────────────

/**
 * Build and return a task card <div> element, wired with event handlers.
 *
 * @param {Object}   task
 * @param {Function} onDelete  — (taskId) => void
 * @param {Function} onToggle  — (taskId) => void
 * @param {Function} onEdit    — (task)   => void
 * @returns {HTMLDivElement}
 */
export function buildTaskCard(task, onDelete, onToggle, onEdit) {
  const card = document.createElement('div');
  card.className = `task-card${task.completed ? ' task-card--done' : ''}`;
  card.dataset.id = task.id;

  const checkClass = task.completed
    ? 'task-card__check task-card__check--done'
    : 'task-card__check';
  const checkLabel = task.completed ? 'Mark incomplete' : 'Mark complete';

  card.innerHTML = `
    <div class="task-card__top">
      <span class="task-card__title">${escapeHtml(task.title)}</span>
      <div class="task-card__controls">

        <!-- Delete — hidden by CSS, revealed on .task-card:hover -->
        <button class="task-card__delete" aria-label="Delete task" title="Delete task">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>

        <!-- Complete toggle -->
        <button class="${checkClass}" aria-label="${checkLabel}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>

      </div>
    </div>
    <p class="task-card__duration">${task.duration} min${task.duration !== 1 ? 's' : ''}</p>
    <p class="task-card__time">${formatTime(task.time)}</p>
  `;

  // Delete: stopPropagation so card click (→ edit) is NOT triggered
  card.querySelector('.task-card__delete').addEventListener('click', (e) => {
    e.stopPropagation();
    onDelete(task.id);
  });

  // Toggle complete: also stopPropagation
  card.querySelector('.task-card__check').addEventListener('click', (e) => {
    e.stopPropagation();
    onToggle(task.id);
  });

  // Clicking anywhere else on the card opens the edit modal
  card.addEventListener('click', () => onEdit(task));

  return card;
}

// ── Utilities ──────────────────────────────────────────────────

/**
 * Convert "HH:MM" (24-hour) to "H:MM AM/PM".
 * @param {string} timeStr
 * @returns {string}
 */
export function formatTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return '--:-- --';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Escape HTML to prevent XSS when inserting into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
