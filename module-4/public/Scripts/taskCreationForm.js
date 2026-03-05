/* ====================================================
   taskCreationForm.js — Task Form Validation
   Mood-Based To-Do App — Module 3
   ==================================================== */

/**
 * Validate the task creation / edit form.
 *
 * @param {string} title     — task name
 * @param {string|number} duration — minutes (must be a positive integer)
 * @param {string} time      — "HH:MM" time string
 * @returns {Object} errors  — empty object means the form is valid
 */
export function validateTaskForm(title, duration, time) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Task name is required.';
  } else if (title.trim().length > 100) {
    errors.title = 'Task name must be under 100 characters.';
  }

  const dur = Number(duration);
  if (duration === '' || duration === null || duration === undefined) {
    errors.duration = 'Duration is required.';
  } else if (isNaN(dur) || dur < 1) {
    errors.duration = 'Duration must be at least 1 minute.';
  }

  if (!time) {
    errors.time = 'Time is required.';
  }

  return errors;
}
