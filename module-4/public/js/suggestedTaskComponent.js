/**
 * suggestedTaskComponent.js — Suggested Tasks Panel
 * ---------------------------------------------------
 * Generates suggestions based on current mood AND
 * the latest fetched weather condition.
 * Load order: 5th
 */
'use strict';

const SuggestedTasks = (() => {

  /* ─────────────────────────────────────────────────
     SUGGESTION BANK
     Each entry:
       moods     – mood values that match  ([] = all moods)
       weather   – OWM condition keywords  ([] = all weather)
       icon      – 'mood' | 'weather' | 'activity'
       emoji     – icon emoji
       name      – task title
       duration  – minutes
       keyword   – label shown on card
  ───────────────────────────────────────────────── */
  const BANK = [
    // ── Sunny / Clear ───────────────────────────────
    { moods: ['Happy','Energized'], weather: ['Clear','Sunny'],         icon: 'activity', emoji: '🏃', name: 'Morning Jog',          duration: 30, keyword: 'Sunny Weather' },
    { moods: [],                    weather: ['Clear'],                  icon: 'activity', emoji: '🚴', name: 'Bike Ride',             duration: 45, keyword: 'Clear Skies' },
    { moods: ['Happy'],             weather: ['Clear','Sunny'],         icon: 'activity', emoji: '🌳', name: 'Walk in the Park',      duration: 25, keyword: 'Sunny Weather' },
    // ── Rainy / Cloudy ──────────────────────────────
    { moods: [],                    weather: ['Rain','Drizzle','Mist'],  icon: 'weather',  emoji: '📚', name: 'Read a Book',           duration: 45, keyword: 'Rainy Day' },
    { moods: [],                    weather: ['Rain','Thunderstorm'],    icon: 'mood',     emoji: '🎮', name: 'Play a Casual Game',    duration: 30, keyword: 'Stay Indoors' },
    { moods: [],                    weather: ['Clouds','Fog'],           icon: 'weather',  emoji: '🎧', name: 'Listen to a Podcast',   duration: 30, keyword: 'Cloudy Day' },
    // ── Mood: Sad / Tired ───────────────────────────
    { moods: ['Sad','Tired'],        weather: [],                        icon: 'mood',     emoji: '🧘', name: 'Meditation Session',    duration: 15, keyword: 'Mood Boost' },
    { moods: ['Sad'],                weather: [],                        icon: 'mood',     emoji: '✍️', name: 'Gratitude Journal',     duration: 10, keyword: 'Self-Care' },
    { moods: ['Tired'],              weather: [],                        icon: 'mood',     emoji: '🛁', name: 'Relaxing Bath',         duration: 20, keyword: 'Rest & Recover' },
    // ── Mood: Focused ───────────────────────────────
    { moods: ['Focused','Neutral'],  weather: [],                        icon: 'activity', emoji: '📝', name: 'Deep Work Session',     duration: 60, keyword: 'Flow State' },
    { moods: ['Focused'],            weather: [],                        icon: 'activity', emoji: '🎯', name: 'Review Your Goals',     duration: 20, keyword: 'Productivity' },
    // ── Always-on fallbacks ─────────────────────────
    { moods: [],                     weather: [],                        icon: 'activity', emoji: '💧', name: 'Drink 8 Glasses Water', duration: 0,  keyword: 'Daily Habit' },
    { moods: [],                     weather: [],                        icon: 'mood',     emoji: '🌬️', name: 'Breathing Exercise',    duration: 5,  keyword: 'Mindfulness' },
  ];

  /* ─────────────────────────────────────────────────
     BUILD ITEM HTML
  ───────────────────────────────────────────────── */
  function buildItem(s) {
    const durationText = s.duration > 0 ? `${s.duration} mins` : 'Any time';
    return `
      <div class="suggestion-item">
        <div class="suggestion-item__body">
          <div class="suggestion-item__icon suggestion-item__icon--${s.icon}">
            <span>${s.emoji}</span>
          </div>
          <div class="suggestion-item__info">
            <h3 class="suggestion-item__name">${s.name}</h3>
            <p  class="suggestion-item__duration">${durationText}</p>
          </div>
          <div class="suggestion-item__meta">
            <span class="suggestion-item__based">Based on</span>
            <span class="suggestion-item__keyword">${s.keyword}</span>
            <button class="suggestion-item__check"
                    data-action="accept-suggestion"
                    data-title="${s.name}"
                    data-duration="${s.duration}"
                    aria-label="Add ${s.name} to tasks">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
  }

  /* ─────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────── */
  /**
   * @param {string} [weatherCondition] - OWM condition string e.g. "Rain"
   */
  function renderSuggestions(weatherCondition) {
    const container = document.getElementById('suggestedList');
    if (!container) return;

    const mood    = App.getMood();
    const weather = weatherCondition || window._lastWeatherCondition || '';

    // Score each suggestion
    const scored = BANK.map(s => {
      let score = 0;
      if (s.moods.length   === 0 || s.moods.some(m => mood.toLowerCase().includes(m.toLowerCase()))) score++;
      if (s.weather.length === 0 || s.weather.some(w => weather.toLowerCase().includes(w.toLowerCase()))) score++;
      return { ...s, score };
    });

    // Sort by score desc, keep top 4
    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    container.innerHTML = top.map(buildItem).join('');

    // Update badge
    const badge = document.getElementById('suggestionsBadge');
    if (badge) {
      const parts = [];
      if (mood)    parts.push(mood + ' mood');
      if (weather) parts.push(weather + ' weather');
      badge.textContent = parts.length
        ? `Based on ${parts.join(' & ')}`
        : 'Based on your mood & weather';
    }

    // Attach accept listener
    const old   = container;
    const clone = old.cloneNode(true);
    old.parentNode.replaceChild(clone, old);
    clone.addEventListener('click', handleAcceptClick);
  }

  /* ─────────────────────────────────────────────────
     ACCEPT SUGGESTION
  ───────────────────────────────────────────────── */
  function handleAcceptClick(e) {
    const btn = e.target.closest('[data-action="accept-suggestion"]');
    if (!btn) return;

    const title    = btn.dataset.title    || 'Suggested Task';
    const duration = btn.dataset.duration || '15';

    const tasks = App.getTasks();
    // Prevent duplicate
    if (tasks.some(t => t.title === title && !t.completed)) {
      App.showToast(`"${title}" is already in your tasks.`, 'error');
      return;
    }

    tasks.push({
      id:          App.generateId(),
      title,
      description: 'Added from suggestions.',
      duration,
      dueDate:     '',
      completed:   false,
      createdAt:   new Date().toISOString(),
    });
    App.setTasks(tasks);
    if (typeof TasksComponent !== 'undefined') TasksComponent.renderTasks();
    App.showToast(`"${title}" added to your tasks! 📋`);
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
