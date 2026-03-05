/* ====================================================
   moodSelecter.js — Mood State (localStorage)
   Mood-Based To-Do App — Module 3
   ==================================================== */

const MOOD_KEY = 'moodtodo_mood';

/**
 * Read the current mood from localStorage.
 * @returns {{ mood: string, emoji: string } | null}
 */
export function getMood() {
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persist the selected mood.
 * @param {string} mood  — e.g. "Happy"
 * @param {string} emoji — e.g. "😄"
 */
export function saveMood(mood, emoji) {
  localStorage.setItem(MOOD_KEY, JSON.stringify({ mood, emoji }));
}
