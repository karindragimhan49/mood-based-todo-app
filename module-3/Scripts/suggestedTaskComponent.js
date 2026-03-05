/* ====================================================
   suggestedTaskComponent.js — Suggested Task Logic
   Mood-Based To-Do App — Module 3

   Suggestion "add" clicks are handled directly in
   index.js via data-attributes on the button elements.
   This file provides mood-to-suggestion mapping for
   future dynamic rendering.
   ==================================================== */

/**
 * Returns task suggestions based on the current mood.
 * @param {string} mood
 * @returns {Array<{ title: string, duration: number, time: string, keyword: string }>}
 */
export function getSuggestionsForMood(mood) {
  const suggestions = {
    Happy:    [{ title: 'Go for a jog',       duration: 30, time: '07:00', keyword: 'Mood' },
               { title: 'Call a friend',       duration: 20, time: '18:00', keyword: 'Mood' }],
    Calm:     [{ title: 'Read a Book',          duration: 45, time: '20:00', keyword: 'Mood' },
               { title: 'Journaling',           duration: 15, time: '21:00', keyword: 'Mood' }],
    Neutral:  [{ title: 'Read a Book',          duration: 45, time: '17:30', keyword: 'Mood' },
               { title: 'Light stretching',     duration: 15, time: '19:00', keyword: 'Mood' }],
    Sad:      [{ title: 'Listen to music',      duration: 30, time: '16:00', keyword: 'Mood' },
               { title: 'Take a short walk',    duration: 20, time: '17:00', keyword: 'Mood' }],
    Stressed: [{ title: 'Meditation',           duration: 15, time: '08:00', keyword: 'Mood' },
               { title: 'Deep breathing',       duration: 10, time: '12:00', keyword: 'Mood' }],
    Energized:[{ title: 'Workout',              duration: 45, time: '06:30', keyword: 'Mood' },
               { title: 'Tackle a hard task',   duration: 60, time: '09:00', keyword: 'Mood' }],
  };
  return suggestions[mood] ?? suggestions['Neutral'];
}
