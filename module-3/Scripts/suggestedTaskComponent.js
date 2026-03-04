/**
 * suggestedTaskComponent.js — Suggested Tasks Panel
 * --------------------------------------------------
 * Renders a static set of mood/weather-based task
 * suggestions into the right column.
 *
 * The suggestions are driven by dummy data; a future
 * version could hit a real API here.
 *
 * Load order: 5th
 */

'use strict';

const SuggestedTasks = (() => {

  /* ─────────────────────────────────────────────────
     DUMMY SUGGESTION DATA
     Each entry contains:
       mood  – which moods it appears for (empty → always show)
       icon  – type of icon circle: 'mood' | 'weather' | 'activity'
       emoji – emoji OR SVG string for the icon circle
       name  – task name
       duration – minutes
       basedOn  – human-readable label
       keyword  – the highlighted word/phrase
  ───────────────────────────────────────────────── */
  const SUGGESTIONS = [
    {
      moods:    ['Happy', 'Energized', 'Focused'],
      icon:     'mood',
      emoji:    '😊',
      name:     'Read a Book',
      duration: 45,
      basedOn:  'Based on',
      keyword:  'Mood',
    },
    {
      moods:    [],   // always visible
      icon:     'weather',
      emoji:    '☁️',
      name:     'Meditation',
      duration: 15,
      basedOn:  'Based on',
      keyword:  'Weather - Mostly Cloudy',
    },
    {
      moods:    ['Happy', 'Energized'],
      icon:     'activity',
      emoji:    '🏃',
      name:     'Morning Jog',
      duration: 30,
      basedOn:  'Based on',
      keyword:  'Activity Level',
    },
    {
      moods:    ['Sad', 'Tired'],
      icon:     'mood',
      emoji:    '🛁',
      name:     'Relaxing Bath',
      duration: 20,
      basedOn:  'Based on',
      keyword:  'Mood',
    },
    {
      moods:    ['Neutral', 'Focused'],
      icon:     'activity',
      emoji:    '✍️',
      name:     'Journal Entry',
      duration: 10,
      basedOn:  'Based on',
      keyword:  'Daily Habit',
    },
    {
      moods:    ['Tired', 'Sad'],
      icon:     'weather',
      emoji:    '🌧️',
      name:     'Listen to Music',
      duration: 25,
      basedOn:  'Based on',
      keyword:  'Weather - Rainy',
    },
  ];

  /* ─────────────────────────────────────────────────
     BUILD ITEM HTML
  ───────────────────────────────────────────────── */

  function buildItem(s) {
    // Build icon inner content
    const iconContent = s.emoji
      ? `<span>${s.emoji}</span>`
      : s.icon === 'weather'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
             <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
           </svg>`
        : '';

    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;

    // Generate a dummy time (current time)
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return `
      <div class="suggestion-item">
        <div class="suggestion-item__body">
          <div class="suggestion-item__icon suggestion-item__icon--${s.icon}">
            ${iconContent}
          </div>
          <div class="suggestion-item__info">
            <h3 class="suggestion-item__name">${s.name}</h3>
            <p  class="suggestion-item__duration">${s.duration} mins</p>
            <p  class="suggestion-item__time">${timeStr}</p>
          </div>
          <div class="suggestion-item__meta">
            <span class="suggestion-item__based">${s.basedOn}</span>
            <span class="suggestion-item__keyword">${s.keyword}</span>
            <span class="suggestion-item__check" aria-label="Add suggestion">${checkSvg}</span>
          </div>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────── */

  /**
   * Re-render the suggested task list, filtering by current mood.
   */
  function renderSuggestions() {
    const container = document.getElementById('suggestedList');
    if (!container) return;

    const currentMood = App.getMood();

    // Show items that match the current mood OR have no mood restriction
    const filtered = SUGGESTIONS.filter(s =>
      s.moods.length === 0 || s.moods.includes(currentMood)
    );

    if (filtered.length === 0) {
      container.innerHTML = `<p style="font-size:var(--font-size-sm);color:var(--color-text-muted);text-align:center;padding:var(--space-6) 0;">
        No suggestions for your current mood.
      </p>`;
      return;
    }

    container.innerHTML = filtered.slice(0, 3).map(buildItem).join('');

    // "Accept" suggestion → add to tasks
    container.addEventListener('click', handleAcceptSuggestion, { once: true });
  }

  /* ─────────────────────────────────────────────────
     ACCEPT SUGGESTION (add to task list)
  ───────────────────────────────────────────────── */

  function handleAcceptSuggestion(e) {
    const checkEl = e.target.closest('.suggestion-item__check');
    if (!checkEl) {
      // Re-attach listener since we used once:true
      const container = document.getElementById('suggestedList');
      if (container) container.addEventListener('click', handleAcceptSuggestion, { once: true });
      return;
    }

    // Find the parent suggestion item and extract name/duration
    const item = checkEl.closest('.suggestion-item');
    if (!item) return;

    const nameEl     = item.querySelector('.suggestion-item__name');
    const durationEl = item.querySelector('.suggestion-item__duration');
    if (!nameEl) return;

    const title    = nameEl.textContent.trim();
    const duration = durationEl ? durationEl.textContent.replace(' mins', '').trim() : '15';

    // Create task
    const tasks = App.getTasks();
    const newTask = {
      id:          App.generateId(),
      title,
      description: 'Added from suggestions.',
      duration,
      dueDate:     '',
      completed:   false,
      createdAt:   new Date().toISOString(),
    };
    tasks.push(newTask);
    App.setTasks(tasks);

    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
    App.showToast(`"${title}" added to your tasks! ✅`);

    // Re-render so the suggestion panel refreshes listeners
    renderSuggestions();
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */

  function init() {
    renderSuggestions();
    console.log('[SuggestedTasks] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, renderSuggestions };
})();
