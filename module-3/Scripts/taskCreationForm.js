/**
 * taskCreationForm.js — Add & Edit Task Modal
 * --------------------------------------------------
 * Handles:
 *  - Opening Add Task modal (from "+ Add Task" button)
 *  - Opening Edit Task modal (from task card click)
 *  - Validating inputs
 *  - Creating new tasks in localStorage
 *  - Updating existing tasks in localStorage
 *  - Re-rendering the task list after mutation
 *
 * Load order: 4th  (after tasksComponent.js)
 */

'use strict';

const TaskCreationForm = (() => {

  /* ── DOM refs ───────────────────────────────────── */
  let elModal, elModalClose, elModalCancel,
      elModalTitle, elModalSubtitle, elModalSave,
      elEditId,
      elTitle, elTitleErr,
      elDescription,
      elDuration, elDurationErr,
      elDueDate;

  /* ─────────────────────────────────────────────────
     OPEN ADD MODAL
  ───────────────────────────────────────────────── */

  function openAddModal() {
    resetForm();
    elEditId.value         = '';                    // no edit ID → create mode
    elModalTitle.textContent    = 'Create New Task';
    elModalSubtitle.textContent = 'Fill in the details below.';
    elModalSave.textContent     = 'Create Task';
    App.openModal('taskModal');
    elTitle.focus();
  }

  /* ─────────────────────────────────────────────────
     OPEN EDIT MODAL
  ───────────────────────────────────────────────── */

  function openEditModal(taskId) {
    const tasks = App.getTasks();
    const task  = tasks.find(t => t.id === taskId);
    if (!task) return;

    resetForm();
    elEditId.value              = taskId;
    elTitle.value               = task.title       || '';
    elDescription.value         = task.description || '';
    elDuration.value            = task.duration    || '';
    elDueDate.value             = task.dueDate     || '';
    elModalTitle.textContent    = 'Edit Task';
    elModalSubtitle.textContent = 'Update the details below.';
    elModalSave.textContent     = 'Save Changes';
    App.openModal('taskModal');
    elTitle.focus();
  }

  /* ─────────────────────────────────────────────────
     SAVE (CREATE OR UPDATE)
  ───────────────────────────────────────────────── */

  function handleSave() {
    const title       = elTitle.value.trim();
    const description = elDescription.value.trim();
    const duration    = elDuration.value.trim();
    const dueDate     = elDueDate.value;
    const editId      = elEditId.value;

    // Clear previous errors
    App.clearFieldErrors(elModal);
    let valid = true;

    // Validate title
    if (App.isEmpty(title)) {
      App.setFieldError('taskTitle', 'taskTitleError', 'Task title is required.');
      valid = false;
    } else if (title.length > 80) {
      App.setFieldError('taskTitle', 'taskTitleError', 'Title must be 80 characters or fewer.');
      valid = false;
    }

    // Validate duration
    if (App.isEmpty(duration)) {
      App.setFieldError('taskDuration', 'taskDurationError', 'Duration is required.');
      valid = false;
    } else if (isNaN(duration) || Number(duration) < 1) {
      App.setFieldError('taskDuration', 'taskDurationError', 'Enter a valid positive number.');
      valid = false;
    }

    if (!valid) return;

    const tasks = App.getTasks();

    if (editId) {
      // ── UPDATE existing task ──
      const idx = tasks.findIndex(t => t.id === editId);
      if (idx === -1) {
        App.showToast('Task not found.', 'error');
        return;
      }
      tasks[idx] = {
        ...tasks[idx],
        title,
        description,
        duration,
        dueDate,
        updatedAt: new Date().toISOString(),
      };
      App.setTasks(tasks);
      App.closeModal('taskModal');
      TasksComponent.renderTasks();
      App.showToast(`"${title}" updated successfully.`);
    } else {
      // ── CREATE new task ──
      const newTask = {
        id:          App.generateId(),
        title,
        description,
        duration,
        dueDate,
        completed:   false,
        createdAt:   new Date().toISOString(),
      };
      tasks.push(newTask);
      App.setTasks(tasks);
      App.closeModal('taskModal');
      TasksComponent.renderTasks();
      App.showToast(`"${title}" added to your list! ✅`);
    }
  }

  /* ─────────────────────────────────────────────────
     RESET FORM
  ───────────────────────────────────────────────── */

  function resetForm() {
    elTitle.value       = '';
    elDescription.value = '';
    elDuration.value    = '';
    elDueDate.value     = '';
    elEditId.value      = '';
    App.clearFieldErrors(elModal);
  }

  /* ─────────────────────────────────────────────────
     ENTER KEY SUPPORT
  ───────────────────────────────────────────────── */

  function handleKeydown(e) {
    if (e.key === 'Enter' && e.target !== elDescription) {
      handleSave();
    }
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */

  function init() {
    elModal          = document.getElementById('taskModal');
    elModalClose     = document.getElementById('taskModalClose');
    elModalCancel    = document.getElementById('taskModalCancel');
    elModalTitle     = document.getElementById('taskModalTitle');
    elModalSubtitle  = document.getElementById('taskModalSubtitle');
    elModalSave      = document.getElementById('taskModalSave');
    elEditId         = document.getElementById('taskEditId');
    elTitle          = document.getElementById('taskTitle');
    elTitleErr       = document.getElementById('taskTitleError');
    elDescription    = document.getElementById('taskDescription');
    elDuration       = document.getElementById('taskDuration');
    elDurationErr    = document.getElementById('taskDurationError');
    elDueDate        = document.getElementById('taskDueDate');

    // Wire the "Add Task" nav button
    const addBtn = document.getElementById('addTaskBtn');
    if (addBtn) addBtn.addEventListener('click', openAddModal);

    // Modal controls
    if (elModalClose)  elModalClose.addEventListener('click',  () => App.closeModal('taskModal'));
    if (elModalCancel) elModalCancel.addEventListener('click', () => App.closeModal('taskModal'));
    if (elModalSave)   elModalSave.addEventListener('click', handleSave);

    // Enter key in inputs
    [elTitle, elDuration, elDueDate].forEach(el => {
      if (el) el.addEventListener('keydown', handleKeydown);
    });

    console.log('[TaskCreationForm] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, openAddModal, openEditModal };
})();
