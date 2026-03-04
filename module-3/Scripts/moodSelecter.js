/**
 * moodSelecter.js — Mood Selection Modal
 * ----------------------------------------
 * Handles:
 *   • Opening the mood modal via the navbar Mood pill
 *   • Selecting a mood option (adds .mood-option--active)
 *   • Saving the chosen mood to localStorage
 *   • Syncing the navbar emoji + label
 *   • Refreshing suggested tasks on confirm
 *
 * Load order: 6th (last)
 */

'use strict';

const MoodSelector = (() => {

  /* ─────────────────────────────────────────────────
     MOOD DEFINITIONS
     Keep in sync with data-mood / data-emoji attributes
     in the moodModal inside index.html.
  ───────────────────────────────────────────────── */
  const MOODS = [
    { value: 'Happy',     emoji: '😊' },
    { value: 'Sad',       emoji: '😔' },
    { value: 'Energized', emoji: '⚡' },
    { value: 'Tired',     emoji: '😴' },
    { value: 'Focused',   emoji: '🎯' },
    { value: 'Neutral',   emoji: '😐' },
  ];

  /* Internal state: which mood is currently highlighted in the modal */
  let _selectedMood  = null;   // string | null
  let _selectedEmoji = null;   // string | null

  /* ─────────────────────────────────────────────────
     OPEN MODAL
  ───────────────────────────────────────────────── */

  function openMoodModal() {
    // Pre-select the persisted mood before showing
    syncModalSelection(App.getMood());
    App.openModal('moodModal');
  }

  /* ─────────────────────────────────────────────────
     SYNC MODAL SELECTION
  ───────────────────────────────────────────────── */

  /**
   * Highlights the option matching `moodValue` inside the modal.
   * If moodValue is null / not found, all options are deselected.
   */
  function syncModalSelection(moodValue) {
    const options = document.querySelectorAll('#moodOptions .mood-option');
    options.forEach(opt => {
      const matches = opt.dataset.mood === moodValue;
      opt.classList.toggle('mood-option--active', matches);
      opt.setAttribute('aria-pressed', matches ? 'true' : 'false');
    });

    // Update internal state from DOM (in case emojis live in the HTML)
    if (moodValue) {
      const activeOption = document.querySelector(`#moodOptions .mood-option[data-mood="${moodValue}"]`);
      _selectedMood  = moodValue;
      _selectedEmoji = activeOption ? activeOption.dataset.emoji : getDefaultEmoji(moodValue);
    } else {
      _selectedMood  = null;
      _selectedEmoji = null;
    }
  }

  /* ─────────────────────────────────────────────────
     HANDLE OPTION CLICK
  ───────────────────────────────────────────────── */

  function handleOptionClick(e) {
    const opt = e.target.closest('.mood-option');
    if (!opt) return;

    const mood  = opt.dataset.mood;
    const emoji = opt.dataset.emoji || getDefaultEmoji(mood);

    // Allow de-selecting same mood
    if (_selectedMood === mood) {
      _selectedMood  = null;
      _selectedEmoji = null;
      opt.classList.remove('mood-option--active');
      opt.setAttribute('aria-pressed', 'false');
      return;
    }

    _selectedMood  = mood;
    _selectedEmoji = emoji;

    // Toggle active class
    document.querySelectorAll('#moodOptions .mood-option').forEach(el => {
      el.classList.remove('mood-option--active');
      el.setAttribute('aria-pressed', 'false');
    });
    opt.classList.add('mood-option--active');
    opt.setAttribute('aria-pressed', 'true');
  }

  /* ─────────────────────────────────────────────────
     HANDLE CONFIRM
  ───────────────────────────────────────────────── */

  function handleConfirm() {
    if (!_selectedMood) {
      App.showToast('Please select a mood first.', 'error');
      return;
    }

    // Persist
    App.setMood(_selectedMood);

    // Update navbar pill
    updateNavbarMood(_selectedMood, _selectedEmoji);

    // Close modal
    App.closeModal('moodModal');

    // Inform user
    App.showToast(`Mood updated to ${_selectedMood}! ${_selectedEmoji}`);

    // Refresh suggestions panel
    if (typeof SuggestedTasks !== 'undefined') {
      SuggestedTasks.renderSuggestions();
    }
  }

  /* ─────────────────────────────────────────────────
     UPDATE NAVBAR MOOD PILL
  ───────────────────────────────────────────────── */

  function updateNavbarMood(mood, emoji) {
    const emojiEl = document.getElementById('moodEmoji');
    const textEl  = document.getElementById('moodText');

    if (emojiEl) emojiEl.textContent = emoji || getDefaultEmoji(mood);
    if (textEl)  textEl.textContent  = mood || 'Set Mood';
  }

  /* ─────────────────────────────────────────────────
     HELPER — DEFAULT EMOJI FALLBACK
  ───────────────────────────────────────────────── */

  function getDefaultEmoji(moodValue) {
    const found = MOODS.find(m => m.value === moodValue);
    return found ? found.emoji : '😐';
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */

  function init() {
    /* ── Navbar mood button opens modal ── */
    const moodBtn = document.getElementById('moodBtn');
    if (moodBtn) {
      moodBtn.addEventListener('click', openMoodModal);
    }

    /* ── Option selection ── */
    const moodOptions = document.getElementById('moodOptions');
    if (moodOptions) {
      moodOptions.addEventListener('click', handleOptionClick);
    }

    /* ── Confirm button ── */
    const confirmBtn = document.getElementById('moodConfirmBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', handleConfirm);
    }

    /* ── Close button inside mood modal ── */
    const closeBtn = document.querySelector('#moodModal .modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => App.closeModal('moodModal'));
    }

    /* ── Sync navbar from persisted mood on page load ── */
    const persistedMood = App.getMood();
    if (persistedMood) {
      const emoji = getDefaultEmoji(persistedMood);
      updateNavbarMood(persistedMood, emoji);
    }

    console.log('[MoodSelector] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, openMoodModal, updateNavbarMood };
})();
