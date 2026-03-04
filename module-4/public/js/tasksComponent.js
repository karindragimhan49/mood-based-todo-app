/**
 * tasksComponent.js — Task Grid (Backlog + Completed)
 * ----------------------------------------------------
 * Renders active tasks and the separate completed section.
 * All data lives in localStorage via App helpers.
 * Load order: 3rd
 */
'use strict';

const TasksComponent = (() => {

  let _showCompleted = false;

  /* ─────────────────────────────────────────────────
     ESCAPE HTML (XSS protection)
  ───────────────────────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /* ─────────────────────────────────────────────────
     BUILD TASK CARD HTML
  ───────────────────────────────────────────────── */
  function buildTaskCard(task, isCompleted = false) {
    const title    = escapeHtml(task.title   || '');
    const desc     = escapeHtml(task.description || '');
    const duration = escapeHtml(String(task.duration || ''));
    const due      = task.dueDate ? App.formatDate(task.dueDate) : '';
    const id       = escapeHtml(task.id);

    const checkInner = isCompleted
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="20 6 9 17 4 12"/>
         </svg>`
      : '';

    const durationBadge = duration
      ? `<span class="task-card__meta-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10"/>
             <polyline points="12 6 12 12 16 14"/>
           </svg>
           ${duration} min
         </span>`
      : '';

    const dueBadge = due
      ? `<span class="task-card__meta-item task-card__due">${due}</span>`
      : '';

    const completedBadge = isCompleted
      ? `<span class="task-card__badge task-card__badge--done">Completed</span>`
      : '';

    return `
      <div class="task-card${isCompleted ? ' task-card--completed' : ''}"
           data-id="${id}" role="listitem">
        <button class="task-card__check${isCompleted ? ' task-card__check--done' : ''}"
                data-action="toggle" data-id="${id}"
                aria-label="${isCompleted ? 'Move back to backlog' : 'Mark complete'}">
          ${checkInner}
        </button>
        <div class="task-card__body" data-action="edit" data-id="${id}">
          <h3 class="task-card__title${isCompleted ? ' task-card__title--strike' : ''}">${title}</h3>
          ${desc ? `<p class="task-card__desc${isCompleted ? ' task-card__desc--muted' : ''}">${desc}</p>` : ''}
          <div class="task-card__meta">
            ${durationBadge}
            ${dueBadge}
            ${completedBadge}
          </div>
        </div>
        <button class="task-card__delete" data-action="delete" data-id="${id}"
                aria-label="Delete task">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`;
  }

  /* ─────────────────────────────────────────────────
     RENDER TASKS
  ───────────────────────────────────────────────── */
  function renderTasks() {
    const allTasks  = App.getTasks();
    const backlog   = allTasks.filter(t => !t.completed);
    const completed = allTasks.filter(t => t.completed);

    renderBacklog(backlog);
    renderCompleted(completed);
    syncCountLabels(backlog.length, completed.length);
    syncCompletedSection();
  }

  function renderBacklog(tasks) {
    const grid       = document.getElementById('taskGrid');
    const emptyState = document.getElementById('emptyState');
    if (!grid) return;

    if (tasks.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.removeAttribute('hidden');
    } else {
      if (emptyState) emptyState.setAttribute('hidden', '');
      grid.innerHTML = tasks.map(t => buildTaskCard(t, false)).join('');
    }

    attachGridListeners('taskGrid');
  }

  function renderCompleted(tasks) {
    const grid       = document.getElementById('completedGrid');
    const emptyState = document.getElementById('completedEmptyState');
    if (!grid) return;

    if (tasks.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.removeAttribute('hidden');
    } else {
      if (emptyState) emptyState.setAttribute('hidden', '');
      grid.innerHTML = tasks.map(t => buildTaskCard(t, true)).join('');
    }

    attachGridListeners('completedGrid');
  }

  /* ─────────────────────────────────────────────────
     ATTACH EVENT LISTENERS (clone trick)
  ───────────────────────────────────────────────── */
  function attachGridListeners(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const clone = grid.cloneNode(true);
    grid.parentNode.replaceChild(clone, grid);
    clone.addEventListener('click', handleGridClick);
  }

  /* ─────────────────────────────────────────────────
     GRID CLICK HANDLER
  ───────────────────────────────────────────────── */
  function handleGridClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id     = btn.dataset.id;

    if (action === 'toggle') { toggleComplete(id); return; }
    if (action === 'delete') { deleteTask(id);     return; }
    if (action === 'edit')   {
      if (typeof TaskCreationForm !== 'undefined') TaskCreationForm.openEditModal(id);
      return;
    }
  }

  /* ─────────────────────────────────────────────────
     CRUD OPERATIONS
  ───────────────────────────────────────────────── */
  function toggleComplete(id) {
    const tasks   = App.getTasks();
    const index   = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    const wasCompleted = tasks[index].completed;
    tasks[index].completed = !wasCompleted;
    tasks[index].updatedAt = new Date().toISOString();
    App.setTasks(tasks);
    renderTasks();

    const title = tasks[index].title;
    if (!wasCompleted) {
      App.showToast(`"${title}" completed! ✅`);
    } else {
      App.showToast(`"${title}" moved back to backlog.`);
    }
  }

  function deleteTask(id) {
    const tasks = App.getTasks();
    const task  = tasks.find(t => t.id === id);
    if (!task) return;

    App.setTasks(tasks.filter(t => t.id !== id));
    renderTasks();
    App.showToast(`"${task.title}" deleted.`, 'error');
  }

  function handleCompleteAll() {
    const tasks   = App.getTasks();
    const hasAny  = tasks.some(t => !t.completed);
    const updated = tasks.map(t => ({ ...t, completed: hasAny, updatedAt: new Date().toISOString() }));
    App.setTasks(updated);
    renderTasks();
    App.showToast(hasAny ? 'All tasks marked complete! ✅' : 'All tasks moved back to backlog.');
  }

  function handleClearCompleted() {
    const tasks = App.getTasks().filter(t => !t.completed);
    App.setTasks(tasks);
    renderTasks();
    App.showToast('Completed tasks cleared.', 'error');
  }

  /* ─────────────────────────────────────────────────
     SHOW / HIDE COMPLETED SECTION
  ───────────────────────────────────────────────── */
  function syncCompletedSection() {
    const section = document.getElementById('completedSection');
    const toggleBtn = document.getElementById('showCompletedBtn');
    if (!section) return;

    if (_showCompleted) {
      section.removeAttribute('hidden');
      if (toggleBtn) toggleBtn.textContent = 'Hide Completed';
    } else {
      section.setAttribute('hidden', '');
      if (toggleBtn) toggleBtn.textContent = 'Show Completed';
    }
  }

  function handleToggleCompleted() {
    _showCompleted = !_showCompleted;
    syncCompletedSection();
  }

  /* ─────────────────────────────────────────────────
     SYNC UI LABELS
  ───────────────────────────────────────────────── */
  function syncCountLabels(activeCount, completedCount) {
    const countEl     = document.getElementById('taskCountLabel');
    const completedEl = document.getElementById('completedCountLabel');
    if (countEl)     countEl.textContent     = `${activeCount} task${activeCount !== 1 ? 's' : ''}`;
    if (completedEl) completedEl.textContent = `${completedCount} done`;
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    document.getElementById('addTaskBtn')
      ?.addEventListener('click', () => {
        if (typeof TaskCreationForm !== 'undefined') TaskCreationForm.openAddModal();
      });

    document.getElementById('completeAllBtn')
      ?.addEventListener('click', handleCompleteAll);

    document.getElementById('showCompletedBtn')
      ?.addEventListener('click', handleToggleCompleted);

    document.getElementById('clearCompletedBtn')
      ?.addEventListener('click', handleClearCompleted);

    renderTasks();
    console.log('[TasksComponent] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, renderTasks, toggleComplete, deleteTask, escapeHtml };
})();
