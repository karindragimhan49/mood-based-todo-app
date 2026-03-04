'use strict';

require('dotenv').config();
const express    = require('express');
const { engine } = require('express-handlebars');
const path       = require('path');
const axios      = require('axios');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─────────────────────────────────────────────────────────────
   HANDLEBARS ENGINE
───────────────────────────────────────────────────────────────*/
app.engine(
  'handlebars',
  engine({
    layoutsDir:  path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    helpers: {
      /* e.g. {{eq a b}} for conditionals in templates */
      eq: (a, b) => a === b,
      ne: (a, b) => a !== b,
      or: (a, b) => a || b,
      and:(a, b) => a && b,
      json: (ctx) => JSON.stringify(ctx),
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

/* ─────────────────────────────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────────────────────────────────*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* ─────────────────────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────────────────────────*/

/* Home — render the main dashboard */
app.get('/', (req, res) => {
  res.render('home', {
    title:       'Mood-Based To-Do App',
    description: 'Your personal mood-driven task manager.',
  });
});

/* ── Weather API proxy ───────────────────────────────────────
   GET /api/weather?lat=<lat>&lon=<lon>
   Backend calls OpenWeatherMap so the API key stays private.
────────────────────────────────────────────────────────────*/
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required.' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'WEATHER_API_KEY not configured on server.' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather` +
                `?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const { data } = await axios.get(url);

    /* Shape the response for the frontend */
    const weather = {
      city:        data.name,
      country:     data.sys.country,
      temp:        Math.round(data.main.temp),
      feelsLike:   Math.round(data.main.feels_like),
      humidity:    data.main.humidity,
      description: data.weather[0].description,
      condition:   data.weather[0].main,          // "Rain", "Clear", "Clouds" …
      icon:        data.weather[0].icon,
      iconUrl:     `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      windSpeed:   data.wind.speed,
    };

    return res.json({ success: true, weather });
  } catch (err) {
    const status  = err.response?.status  || 500;
    const message = err.response?.data?.message || err.message;
    return res.status(status).json({ error: message });
  }
});

/* 404 handler */
app.use((req, res) => {
  res.status(404).render('home', {
    title: '404 — Not Found',
  });
});

/* ─────────────────────────────────────────────────────────────
   START
───────────────────────────────────────────────────────────────*/
app.listen(PORT, () => {
  console.log(`\n  🌿  Mood-Based To-Do — Module 4`);
  console.log(`  ➜  Local: http://localhost:${PORT}\n`);
});
