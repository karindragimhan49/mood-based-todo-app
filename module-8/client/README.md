# Module 8 — React Portfolio Frontend

A full-stack portfolio application built with **React** (client) and **Express + PostgreSQL** (server).

---

## Folder Structure

```
module-8/
├── client/          ← React app (this folder)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/
│       │   └── blogs.js          ← Axios helpers for /api/blogs
│       ├── components/
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── Layout.jsx
│       │   └── Navigation.jsx
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── Blogs.jsx
│       │   ├── Contact.jsx
│       │   ├── Home.jsx
│       │   ├── NotFound.jsx
│       │   ├── Projects.jsx
│       │   └── SingleBlog.jsx
│       ├── App.js
│       ├── index.js
│       └── setupProxy.js         ← Forwards /api/* → http://localhost:3000
└── server/          ← Express + PostgreSQL API
    ├── db/
    ├── routes/
    ├── scripts/
    └── index.js
```

---

## Routes

| Path            | Component        |
|-----------------|------------------|
| `/`             | Home             |
| `/blogs`        | Blogs            |
| `/blogs/:id`    | SingleBlog       |
| `/about`        | About            |
| `/contact`      | Contact          |
| `/projects`     | Projects         |
| `/admin-dash`   | AdminDashboard   |
| `*`             | NotFound (404)   |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally
- A `.env` file in `server/` based on `server/example.env`

### Development (both client & server simultaneously)

```bash
# From module-8/client
npm install
npm run dev
```

The `dev` script uses **concurrently** to start:
- **Backend** on `http://localhost:3000`
- **Frontend** on `http://localhost:3001`

All `/api/*` requests from the frontend are proxied to the backend via `setupProxy.js`.

### Install server dependencies separately

```bash
cd server && npm install
```

### Database setup

```bash
cd server
npm run db:init   # creates tables
npm run db:seed   # inserts sample data
```

---

## Production Build

From the **server** directory:

```bash
# 1. Build the React app
npm run build:frontend

# 2. Serve everything on port 3000
npm run prod
```

In production mode Express serves the React `build/` as static files and handles client-side routing via a catch-all route.

---

## Component Overview

### Components

| Component      | Description |
|----------------|-------------|
| `Header`       | Sticky top bar with logo, `Navigation`, and Contact CTA |
| `Navigation`   | Active-link aware nav using `react-router-dom` |
| `Footer`       | Copyright, social links, and quick contact form |
| `Layout`       | Wraps every page with `Header` and `Footer` |

### Pages

| Page             | Backend Integration |
|------------------|---------------------|
| `Home`           | Fetches latest 2 blogs via `getAllBlogs()` |
| `Blogs`          | Fetches all blogs, category filter (client-side) |
| `SingleBlog`     | Fetches one blog by ID via `getBlogById(id)` |
| `About`          | Static — tech stack and bio |
| `Contact`        | Controlled form (ready to POST to API) |
| `Projects`       | Static — project showcase cards |
| `AdminDashboard` | Dummy data table; full CRUD in Module 9 |
| `NotFound`       | 404 fallback for unknown routes |

### API layer (`src/api/blogs.js`)

All Axios calls are centralised here and exported as named functions:

```js
getAllBlogs()          // GET  /api/blogs
getBlogById(id)        // GET  /api/blogs/:id
createBlog(data)       // POST /api/blogs
updateBlog(id, data)   // PUT  /api/blogs/:id
deleteBlog(id)         // DELETE /api/blogs/:id
```
