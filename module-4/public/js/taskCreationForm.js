/**
 * taskCreationForm.js — Add / Edit Task Modal
 * --------------------------------------------
 * Handles creating new tasks and editing existing ones.
 * Load order: 4th
 */
'use strict';

const TaskCreationForm = (() => {

  /* ─────────────────────────────────────────────────
     OPEN ADD MODAL
  ───────────────────────────────────────────────── */
  function openAddModal() {
    resetForm();
    setModalMode('add');
    App.openModal('taskModal');
  }

  /* ─────────────────────────────────────────────────
     OPEN EDIT MODAL
  ───────────────────────────────────────────────── */
  function openEditModal(taskId) {
    const tasks = App.getTasks();
    const task  = tasks.find(t => t.id === taskId);
    if (!task) return;

    resetForm();
    setModalMode('edit');

    // Pre-fill fields
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('taskEditId',      task.id);
    set('taskTitle',       task.title);
    set('taskDescription', task.description);
    set('taskDuration',    task.duration);
    set('taskDueDate',     task.dueDate);

    App.openModal('taskModal');
  }

  /* ─────────────────────────────────────────────────
     MODE HELPERS
  ───────────────────────────────────────────────── */
  function setModalMode(mode) {
    const title   = document.getElementById('taskModalTitle');
    const saveBtn = document.getElementById('taskSaveBtn');
    const isEdit  = mode === 'edit';
    if (title)   title.textContent   = isEdit ? 'Edit Task'   : 'Add New Task';
    if (saveBtn) saveBtn.textContent = isEdit ? 'Save Changes' : 'Add Task';
  }

  /* ─────────────────────────────────────────────────
     SAVE HANDLER
  ───────────────────────────────────────────────── */
  function handleSave(e) {
    if (e) e.preventDefault();

    const editId  = (document.getElementById('taskEditId')?.value      || '').trim();
    const title   = (document.getElementById('taskTitle')?.value       || '').trim();
    const desc    = (document.getElementById('taskDescription')?.value || '').trim();
    const duration= (document.getElementById('taskDuration')?.value    || '').trim();
    const dueDate = (document.getElementById('taskDueDate')?.value     || '').trim();

    // Reset errors
    App.clearFieldErrors(
      ['taskTitle',    'taskTitleErr'],
      ['taskDuration', 'taskDurationErr'],
    );

    let valid = true;

    if (App.isEmpty(title)) {
      App.setFieldError('taskTitle', 'taskTitleErr', 'Task title is required.');
      valid = false;
    } else if (title.length > 80) {
      App.setFieldError('taskTitle', 'taskTitleErr', 'Title must be 80 characters or fewer.');
      valid = false;
    }

    if (App.isEmpty(duration)) {
      App.setFieldError('taskDuration', 'taskDurationErr', 'Duration is required.');
      valid = false;
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      App.setFieldError('taskDuration', 'taskDurationErr', 'Enter a positive number of minutes.');
      valid = false;
    }

    if (!valid) return;

    const tasks = App.getTasks();

    if (editId) {
      // Edit mode
      const index = tasks.findIndex(t => t.id === editId);
      if (index !== -1) {
        tasks[index] = {
          ...tasks[index],
          title, description: desc, duration, dueDate,
          updatedAt: new Date().toISOString(),
        };
        App.setTasks(tasks);
        App.showToast(`"${title}" updated! ✏️`);
      }
    } else {
      // Create mode
      const newTask = {
        id:          App.generateId(),
        title,
        description: desc,
        duration,
        dueDate,
        completed:   false,
        createdAt:   new Date().toISOString(),
      };
      tasks.push(newTask);
      App.setTasks(tasks);
      App.showToast(`"${title}" added! 📋`);
    }

    App.closeModal('taskModal');
    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
  }

  /* ─────────────────────────────────────────────────
     RESET FORM
  ───────────────────────────────────────────────── */
  function resetForm() {
    const form = document.getElementById('taskFormEl');
    if (form) form.reset();
    const editId = document.getElementById('taskEditId');
    if (editId) editId.value = '';
    App.clearFieldErrors(
      ['taskTitle',    'taskTitleErr'],
      ['taskDuration', 'taskDurationErr'],
    );
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    document.getElementById('taskFormEl')
      ?.addEventListener('submit', handleSave);

    // Enter key does not submit textarea
    document.getElementById('taskTitle')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(e); } });

    console.log('[TaskCreationForm] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, openAddModal, openEditModal };
})();
