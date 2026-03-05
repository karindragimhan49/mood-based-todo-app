/* ====================================================
   suggestedTaskComponent.js — Suggestion Logic
   Mood-Based To-Do App — Module 4

   Exports:
     getSuggestionsForMood(mood)       → Array
     getSuggestionsForWeather(cond)    → Array
     updateSuggestions(mood, weather)  → void  (DOM update)
   ==================================================== */

// ── Mood-based suggestions ─────────────────────────────────────

/**
 * Return the suggestion list for the given mood.
 * @param {string} mood
 * @returns {Array<{ title, duration, time, keyword }>}
 */
export function getSuggestionsForMood(mood) {
  const map = {
    Happy:    [{ title: 'Go for a jog',       duration: 30, time: '07:00' },
               { title: 'Call a friend',       duration: 20, time: '18:00' }],
    Calm:     [{ title: 'Read a Book',          duration: 45, time: '20:00' },
               { title: 'Journaling',           duration: 15, time: '21:00' }],
    Neutral:  [{ title: 'Read a Book',          duration: 45, time: '17:30' },
               { title: 'Light stretching',     duration: 15, time: '19:00' }],
    Sad:      [{ title: 'Listen to music',      duration: 30, time: '16:00' },
               { title: 'Take a short walk',    duration: 20, time: '17:00' }],
    Stressed: [{ title: 'Meditation',           duration: 15, time: '08:00' },
               { title: 'Deep breathing',       duration: 10, time: '12:00' }],
    Energized:[{ title: 'Workout',              duration: 45, time: '06:30' },
               { title: 'Tackle a hard task',   duration: 60, time: '09:00' }],
  };
  return map[mood] ?? map['Neutral'];
}

// ── Weather-based suggestions ──────────────────────────────────

/**
 * Return the suggestion for the given weather condition string.
 * WeatherAPI condition text examples: "Sunny", "Clear", "Cloudy",
 * "Partly cloudy", "Rain", "Light rain", "Thunderstorm", "Snow", etc.
 *
 * @param {string} condition  — raw condition text from WeatherAPI
 * @returns {{ title, duration, time }}
 */
export function getSuggestionsForWeather(condition) {
  const cond = (condition || '').toLowerCase();

  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) {
    return { title: 'Read a Book',         duration: 45, time: '17:30' };
  }
  if (cond.includes('thunder') || cond.includes('storm')) {
    return { title: 'Watch a documentary', duration: 60, time: '19:00' };
  }
  if (cond.includes('snow') || cond.includes('sleet') || cond.includes('blizzard')) {
    return { title: 'Indoor yoga',          duration: 30, time: '10:00' };
  }
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) {
    return { title: 'Meditation',           duration: 15, time: '08:00' };
  }
  if (cond.includes('sunny') || cond.includes('clear')) {
    return { title: 'Go for a walk',        duration: 30, time: '07:30' };
  }
  if (cond.includes('cloud') || cond.includes('overcast')) {
    return { title: 'Meditation',           duration: 15, time: '18:00' };
  }
  if (cond.includes('wind')) {
    return { title: 'Indoor stretching',    duration: 20, time: '09:00' };
  }
  // Fallback
  return { title: 'Meditation',             duration: 15, time: '18:00' };
}

// ── Helpers ────────────────────────────────────────────────────

/**
 * Convert "HH:MM" (24-hour) → "H:MM AM/PM"
 * @param {string} timeStr
 * @returns {string}
 */
function formatTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return '--:-- --';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

// ── DOM updater ────────────────────────────────────────────────

/**
 * Update the two suggestion cards in #suggestions-list with
 * fresh data based on the current mood and weather condition.
 *
 * Targets IDs rendered by suggestedCard.hbs:
 *   suggestion-mood-name   / suggestion-mood-duration   / suggestion-mood-time
 *   suggestion-weather-name/ suggestion-weather-duration/ suggestion-weather-time
 * And the two .suggestion-item__check buttons' data-attributes.
 *
 * @param {string} mood       — e.g. "Happy"
 * @param {string} condition  — e.g. "Sunny" (raw WeatherAPI text)
 */
export function updateSuggestions(mood, condition) {
  const moodSugg    = getSuggestionsForMood(mood)[0];
  const weatherSugg = getSuggestionsForWeather(condition);

  // ── Mood card ────────────────────────
  _setText('suggestion-mood-name',     moodSugg.title);
  _setText('suggestion-mood-duration', `${moodSugg.duration} mins`);
  _setText('suggestion-mood-time',     formatTime(moodSugg.time));

  // ── Weather card ─────────────────────
  _setText('suggestion-weather-name',     weatherSugg.title);
  _setText('suggestion-weather-duration', `${weatherSugg.duration} mins`);
  _setText('suggestion-weather-time',     formatTime(weatherSugg.time));

  // ── Update check-button data attributes ──────────────
  const checkBtns = document.querySelectorAll('.suggestion-item__check');

  if (checkBtns[0]) {
    checkBtns[0].dataset.title    = moodSugg.title;
    checkBtns[0].dataset.duration = String(moodSugg.duration);
    checkBtns[0].dataset.time     = moodSugg.time;
  }
  if (checkBtns[1]) {
    checkBtns[1].dataset.title    = weatherSugg.title;
    checkBtns[1].dataset.duration = String(weatherSugg.duration);
    checkBtns[1].dataset.time     = weatherSugg.time;
  }
}

function _setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
