/**
 * tasksComponent.js — Task Rendering & CRUD Display
 * --------------------------------------------------
 * Handles:
 *  - Rendering the task grid dynamically
 *  - Toggle complete / incomplete
 *  - Delete task (with confirmation toast)
 *  - "Complete All" button
 *  - "Show / Hide Completed" toggle
 *  - Task count label sync
 *
 * Load order: 3rd  (after index.js, loginForm.js)
 */

'use strict';

const TasksComponent = (() => {

  /* ── State ──────────────────────────────────────── */
  let showCompleted = true;  // controlled by the toggle button

  /* ── DOM refs ───────────────────────────────────── */
  let elGrid, elEmptyState, elCountLabel, elCompleteAll, elShowCompleted, elAddTask;

  /* ─────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────── */

  /**
   * Full re-render of the task grid from localStorage.
   * Called after any mutation (add / edit / delete / toggle).
   */
  function renderTasks() {
    const tasks = App.getTasks();

    // Filter based on toggle
    const visible = showCompleted
      ? tasks
      : tasks.filter(t => !t.completed);

    // Sync count label (always reflects ALL tasks)
    const total  = tasks.length;
    const pending= tasks.filter(t => !t.completed).length;
    if (elCountLabel) {
      elCountLabel.textContent =
        total === 0
          ? 'No tasks planned for today'
          : `You have ${pending} task${pending !== 1 ? 's' : ''} planned for today`;
    }

    // Sync toggle button label
    if (elShowCompleted) {
      const completed = tasks.filter(t => t.completed).length;
      elShowCompleted.textContent = showCompleted ? 'Hide Completed' : `Show Completed (${completed})`;
      elShowCompleted.classList.toggle('is-active', !showCompleted);
    }

    // Empty state
    if (elEmptyState) elEmptyState.hidden = visible.length > 0;
    if (elGrid)       elGrid.hidden       = visible.length === 0;

    if (!elGrid) return;

    elGrid.innerHTML = visible.map(task => buildTaskCard(task)).join('');

    // Attach per-card listeners using event delegation on the grid
    attachGridListeners();
  }

  /* ─────────────────────────────────────────────────
     BUILD TASK CARD HTML
  ───────────────────────────────────────────────── */

  function buildTaskCard(task) {
    const completedClass = task.completed ? 'task-card--completed' : '';
    const description    = task.description
      ? `<p class="task-card__desc">${escapeHtml(task.description)}</p>`
      : '';
    const dueDate        = task.dueDate
      ? `<p class="task-card__due">
           <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
             <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
             <line x1="3" y1="10" x2="21" y2="10"/>
           </svg>
           ${App.formatDate(task.dueDate)}
         </p>`
      : '';

    const timeLabel = task.dueDate ? App.formatTime(task.dueDate + 'T12:00') : '';
    const durationLabel = task.duration ? `${task.duration} mins` : '';

    // Check icon
    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;

    // Delete icon
    const deleteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;

    return `
      <div class="task-card ${completedClass}"
           data-id="${task.id}"
           role="button"
           tabindex="0"
           aria-label="${escapeHtml(task.title)}${task.completed ? ' (completed)' : ''}">

        <!-- Delete button (hover-reveal) -->
        <button class="task-card__delete"
                data-action="delete"
                data-id="${task.id}"
                aria-label="Delete task"
                title="Delete task">
          ${deleteSvg}
        </button>

        <div class="task-card__top">
          <span class="task-card__title">${escapeHtml(task.title)}</span>
          <button class="task-card__check"
                  data-action="toggle"
                  data-id="${task.id}"
                  aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}"
                  title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
            ${checkSvg}
          </button>
        </div>

        ${description}
        ${durationLabel ? `<p class="task-card__duration">${durationLabel}</p>` : ''}
        ${timeLabel     ? `<p class="task-card__time">${timeLabel}</p>`         : ''}
        ${dueDate}
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────
     EVENT DELEGATION
  ───────────────────────────────────────────────── */

  function attachGridListeners() {
    if (!elGrid) return;

    // Remove previous listener to avoid stacking (clone trick)
    const newGrid = elGrid.cloneNode(true);
    elGrid.parentNode.replaceChild(newGrid, elGrid);
    elGrid = newGrid;

    elGrid.addEventListener('click', handleGridClick);
    elGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleGridClick(e);
      }
    });
  }

  function handleGridClick(e) {
    const actionEl = e.target.closest('[data-action]');

    if (actionEl) {
      e.stopPropagation();
      const { action, id } = actionEl.dataset;
      if (action === 'toggle') { toggleComplete(id); return; }
      if (action === 'delete') { deleteTask(id);     return; }
    }

    // Click on card body → open edit modal
    const card = e.target.closest('.task-card[data-id]');
    if (card) {
      const id = card.dataset.id;
      if (typeof TaskCreationForm !== 'undefined') {
        TaskCreationForm.openEditModal(id);
      }
    }
  }

  /* ─────────────────────────────────────────────────
     TOGGLE COMPLETE
  ───────────────────────────────────────────────── */

  function toggleComplete(id) {
    const tasks   = App.getTasks();
    const idx     = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;

    tasks[idx].completed = !tasks[idx].completed;
    App.setTasks(tasks);
    renderTasks();

    const verb = tasks[idx].completed ? 'marked complete' : 'marked incomplete';
    App.showToast(`"${tasks[idx].title}" ${verb}.`);
  }

  /* ─────────────────────────────────────────────────
     DELETE TASK
  ───────────────────────────────────────────────── */

  function deleteTask(id) {
    const tasks = App.getTasks();
    const task  = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = tasks.filter(t => t.id !== id);
    App.setTasks(updated);
    renderTasks();
    App.showToast(`"${task.title}" deleted.`);
  }

  /* ─────────────────────────────────────────────────
     COMPLETE ALL
  ───────────────────────────────────────────────── */

  function handleCompleteAll() {
    const tasks = App.getTasks();
    if (tasks.length === 0) {
      App.showToast('No tasks to complete.', 'error');
      return;
    }
    const allDone = tasks.every(t => t.completed);
    const updated = tasks.map(t => ({ ...t, completed: !allDone }));
    App.setTasks(updated);
    renderTasks();
    App.showToast(allDone ? 'All tasks marked incomplete.' : 'All tasks completed! 🎉');
  }

  /* ─────────────────────────────────────────────────
     SHOW / HIDE COMPLETED TOGGLE
  ───────────────────────────────────────────────── */

  function handleToggleCompleted() {
    showCompleted = !showCompleted;
    renderTasks();
  }

  /* ─────────────────────────────────────────────────
     UTILITY
  ───────────────────────────────────────────────── */

  /** Prevent XSS when inserting user content */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */

  function init() {
    elGrid          = document.getElementById('taskGrid');
    elEmptyState    = document.getElementById('emptyState');
    elCountLabel    = document.getElementById('taskCountLabel');
    elCompleteAll   = document.getElementById('completeAllBtn');
    elShowCompleted = document.getElementById('showCompletedBtn');
    elAddTask       = document.getElementById('addTaskBtn');

    if (elCompleteAll)   elCompleteAll.addEventListener('click', handleCompleteAll);
    if (elShowCompleted) elShowCompleted.addEventListener('click', handleToggleCompleted);

    // Initial render
    renderTasks();

    console.log('[TasksComponent] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, renderTasks, deleteTask, toggleComplete, escapeHtml };
})();
