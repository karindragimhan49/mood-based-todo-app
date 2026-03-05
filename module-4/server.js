/* ====================================================
   server.js — Express + Handlebars Backend
   Mood-Based To-Do App — Module 4
   ==================================================== */

'use strict';

const path    = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── View Engine ────────────────────────────────────────────────

app.engine('hbs', engine({
  extname:        '.hbs',
  defaultLayout:  'main',
  layoutsDir:     path.join(__dirname, 'views', 'layouts'),
  partialsDir:    path.join(__dirname, 'views', 'partials'),
  helpers: {
    // Equality check: {{#if (eq a b)}} … {{/if}}
    eq: (a, b) => a === b,
  },
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ───────────────────────────────────────────────

// Serve CSS and JS from public/
app.use(express.static(path.join(__dirname, 'public')));

// ── Middleware ─────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ─────────────────────────────────────────────────────

/**
 * GET /
 * Renders the main dashboard (home.hbs inside layouts/main.hbs).
 */
app.get('/', (req, res) => {
  res.render('home', { title: 'Mood-Based To-Do App' });
});

/**
 * GET /api/weather?lat=&lon=
 * Securely proxies a request to WeatherAPI so the API key
 * is never exposed to the browser.
 *
 * Returns the raw current-weather JSON from the provider.
 */
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required.' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Weather API key is not configured on the server.' });
  }

  try {
    // WeatherAPI accepts "lat,lon" as the q parameter
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

    // Native fetch is available in Node 18+.
    // If you are on Node 16, install node-fetch v2 and require it instead.
    const response = await fetch(url);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || 'Weather API error.' });
    }

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error('[/api/weather]', err.message);
    return res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

// ── Listen ─────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Server running → http://localhost:${PORT}`);
});
