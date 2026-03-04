/**
 * moodSelecter.js — Mood Selector Modal
 * ----------------------------------------
 * Opens mood modal, handles selection, persists to
 * localStorage, syncs navbar pill, refreshes suggestions.
 * Load order: 6th
 */
'use strict';

const MoodSelector = (() => {

  const MOODS = [
    { value: 'Happy',     emoji: '😊' },
    { value: 'Sad',       emoji: '😔' },
    { value: 'Energized', emoji: '⚡' },
    { value: 'Tired',     emoji: '😴' },
    { value: 'Focused',   emoji: '🎯' },
    { value: 'Neutral',   emoji: '😐' },
  ];

  let _selected = null;
  let _emoji    = null;

  /* ── Open ───────────────────────────────────────── */
  function openMoodModal() {
    _syncModalSelection(App.getMood());
    App.openModal('moodModal');
  }

  /* ── Sync selection inside modal ────────────────── */
  function _syncModalSelection(moodValue) {
    document.querySelectorAll('#moodOptions .mood-option').forEach(opt => {
      const match = opt.dataset.mood === moodValue;
      opt.classList.toggle('mood-option--active', match);
      opt.setAttribute('aria-pressed', match ? 'true' : 'false');
    });
    _selected = moodValue || null;
    _emoji    = moodValue ? _getEmoji(moodValue) : null;
  }

  /* ── Option click ───────────────────────────────── */
  function _handleOptionClick(e) {
    const opt = e.target.closest('.mood-option');
    if (!opt) return;

    const mood  = opt.dataset.mood;
    const emoji = opt.dataset.emoji || _getEmoji(mood);

    // Deselect if same
    if (_selected === mood) {
      _selected = null;
      _emoji    = null;
      opt.classList.remove('mood-option--active');
      opt.setAttribute('aria-pressed', 'false');
      return;
    }

    _selected = mood;
    _emoji    = emoji;

    document.querySelectorAll('#moodOptions .mood-option').forEach(el => {
      el.classList.remove('mood-option--active');
      el.setAttribute('aria-pressed', 'false');
    });
    opt.classList.add('mood-option--active');
    opt.setAttribute('aria-pressed', 'true');
  }

  /* ── Confirm ────────────────────────────────────── */
  function _handleConfirm() {
    if (!_selected) {
      App.showToast('Please pick a mood first.', 'error');
      return;
    }
    App.setMood(_selected);
    updateNavbarMood(_selected, _emoji);
    App.closeModal('moodModal');
    App.showToast(`Mood set to ${_selected}! ${_emoji}`);
    if (typeof SuggestedTasks !== 'undefined') {
      SuggestedTasks.renderSuggestions(window._lastWeatherCondition);
    }
  }

  /* ── Update navbar pill ─────────────────────────── */
  function updateNavbarMood(mood, emoji) {
    const emojiEl = document.getElementById('moodEmoji');
    const textEl  = document.getElementById('moodText');
    if (emojiEl) emojiEl.textContent = emoji || _getEmoji(mood) || '😐';
    if (textEl)  textEl.textContent  = mood  || 'Set Mood';
  }

  /* ── Emoji helper ───────────────────────────────── */
  function _getEmoji(moodValue) {
    return (MOODS.find(m => m.value === moodValue) || {}).emoji || '😐';
  }

  /* ── Init ───────────────────────────────────────── */
  function init() {
    document.getElementById('moodBtn')
      ?.addEventListener('click', openMoodModal);

    document.getElementById('moodOptions')
      ?.addEventListener('click', _handleOptionClick);

    document.getElementById('moodConfirmBtn')
      ?.addEventListener('click', _handleConfirm);

    // Sync navbar from persisted mood on load
    const saved = App.getMood();
    if (saved) updateNavbarMood(saved, _getEmoji(saved));

    console.log('[MoodSelector] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, openMoodModal, updateNavbarMood };
})();
