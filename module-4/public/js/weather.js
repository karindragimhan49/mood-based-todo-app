/**
 * weather.js — Weather API Integration
 * ----------------------------------------
 * 1. On init: requests browser geolocation.
 * 2. Sends lat/lon to backend GET /api/weather.
 * 3. Displays result in #weatherModal.
 * 4. Shares condition with SuggestedTasks.
 * Load order: 7th (last)
 */
'use strict';

const WeatherModule = (() => {

  /* Cached weather condition shared with SuggestedTasks */
  window._lastWeatherCondition = '';

  /* ─────────────────────────────────────────────────
     FETCH WEATHER FROM BACKEND
  ───────────────────────────────────────────────── */
  async function fetchWeather(lat, lon) {
    showWeatherState('loading');
    App.openModal('weatherModal');

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load weather.');
      }

      populateWeatherUI(data.weather);
      cacheCondition(data.weather.condition);

    } catch (err) {
      console.error('[Weather]', err);
      const msgEl = document.getElementById('weatherErrorMsg');
      if (msgEl) msgEl.textContent = err.message || 'Could not load weather.';
      showWeatherState('error');
    }
  }

  /* ─────────────────────────────────────────────────
     POPULATE MODAL UI
  ───────────────────────────────────────────────── */
  function populateWeatherUI(w) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('weatherModalTitle', w.city);
    set('weatherCountry',    w.country);
    set('weatherTemp',       w.temp);
    set('weatherDesc',       w.description);
    set('weatherFeels',      `${w.feelsLike}°C`);
    set('weatherHumidity',   `${w.humidity}%`);
    set('weatherWind',       `${w.windSpeed} m/s`);

    const iconEl = document.getElementById('weatherIcon');
    if (iconEl) {
      iconEl.src = w.iconUrl;
      iconEl.alt = w.description;
    }

    showWeatherState('data');
    App.showToast(`📍 ${w.city} — ${w.temp}°C, ${w.description}`);
  }

  /* ─────────────────────────────────────────────────
     CACHE CONDITION & REFRESH SUGGESTIONS
  ───────────────────────────────────────────────── */
  function cacheCondition(condition) {
    window._lastWeatherCondition = condition || '';
    if (typeof SuggestedTasks !== 'undefined') {
      SuggestedTasks.renderSuggestions(window._lastWeatherCondition);
    }
  }

  /* ─────────────────────────────────────────────────
     SHOW STATE: 'loading' | 'error' | 'data'
  ───────────────────────────────────────────────── */
  function showWeatherState(state) {
    const loading = document.getElementById('weatherLoading');
    const error   = document.getElementById('weatherError');
    const data    = document.getElementById('weatherData');

    if (loading) loading.style.display = state === 'loading' ? 'flex' : 'none';
    if (error)   error.hidden          = state !== 'error';
    if (data)    data.hidden           = state !== 'data';
  }

  /* ─────────────────────────────────────────────────
     REQUEST GEOLOCATION → FETCH
  ───────────────────────────────────────────────── */
  function requestAndFetch() {
    if (!navigator.geolocation) {
      App.showToast('Geolocation not supported by your browser.', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
      (err) => {
        console.warn('[Weather] Geolocation denied:', err.message);
        // Fallback: London coordinates
        App.showToast('Location access denied — using fallback city.', 'error');
        fetchWeather(51.5074, -0.1278);
      },
      { timeout: 10000, maximumAge: 300000 }   // cache position 5 min
    );
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  function init() {
    /* Weather button in navbar opens modal & fetches */
    document.getElementById('weatherBtn')
      ?.addEventListener('click', requestAndFetch);

    /* Retry button inside modal */
    document.getElementById('weatherRetryBtn')
      ?.addEventListener('click', requestAndFetch);

    console.log('[WeatherModule] Initialised.');
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, fetchWeather: requestAndFetch };
})();
