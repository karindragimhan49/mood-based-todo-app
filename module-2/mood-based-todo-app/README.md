# Mood-Based To-Do App

A modern, dark-themed static dashboard that suggests and organises your daily tasks based on your **current mood** and **local weather**. Built with pure HTML5 and CSS3 — no JavaScript, no frameworks, no dependencies beyond a Google Font.

---

## Screenshot

> Place your screenshots inside `Assets/` and link them here.

```
Assets/
└── screenshot-dashboard.png
```

<!-- Uncomment and update the path once you add a screenshot:
![Dashboard Preview](Assets/screenshot-dashboard.png)
-->

---

## Folder Structure

```
module-2/mood-based-todo-app/
│
├── index.html                       ← Main dashboard (home page)
├── README.md                        ← This file
│
├── Styles/
│   ├── index.css                    ← CSS variables, reset, navbar, grid layout
│   ├── login.css                    ← Login page layout (background, brand, footer)
│   ├── loginForm.css                ← Login card, inputs, submit button
│   ├── tasksComponent.css           ← Today's tasks card & task-card grid
│   ├── suggestedTaskComponent.css   ← Suggested tasks panel & suggestion items
│   ├── taskCreationForm.css         ← New-task creation form card
│   └── moodSelecter.css             ← Mood picker pill group
│
├── Components/
│   ├── loginForm.html               ← Standalone login page component
│   ├── taskComponent.html           ← Single reusable task card (edit/complete/delete)
│   ├── suggestedTaskComponent.html  ← Reusable suggested-task cards
│   ├── taskCreationForm.html        ← New task form component
│   └── moodSelecterForm.html        ← Mood selection form component
│
└── Assets/
    └── (icons / screenshots go here)
```

---

## Pages & Components

| File | Description |
|------|-------------|
| `index.html` | Main dashboard — navbar, today's tasks, suggested tasks |
| `Components/loginForm.html` | Full login screen with email, password, forgot-password link |
| `Components/taskComponent.html` | Task card with Edit / Complete / Delete action buttons |
| `Components/suggestedTaskComponent.html` | Mood- and weather-based suggestion cards |
| `Components/taskCreationForm.html` | Form: title, description, duration, due-date |
| `Components/moodSelecterForm.html` | Pill-style mood selector (Happy / Neutral / Sad / …) |

---

## Design System

All colours and spacing come from **CSS custom properties** defined in `Styles/index.css`:

```css
:root {
  --color-bg-base:       #0e1117;   /* page background */
  --color-bg-surface:    #161c27;   /* card surface     */
  --color-bg-inner-card: #1f2837;   /* inner card / input background */
  --color-accent:        #a3ff12;   /* neon green accent */
  --color-text-primary:  #ffffff;
  --color-text-secondary:#8b95a6;
  --radius-lg:           20px;
  --shadow-card: 0 4px 24px rgba(0,0,0,.35), 0 1px 4px rgba(0,0,0,.25);
  /* ... full list in index.css */
}
```

### Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent` | `#a3ff12` | Buttons, highlights, titles, active states |
| `--color-bg-base` | `#0e1117` | Page background gradient |
| `--color-bg-surface` | `#161c27` | Card backgrounds |
| `--color-bg-inner-card` | `#1f2837` | Inputs, nested cards |
| `--color-text-primary` | `#ffffff` | Headings, primary text |
| `--color-text-secondary` | `#8b95a6` | Subtitles, labels |

---

## Responsive Design

The layout uses **CSS Grid** for the two-column dashboard and **Flexbox** for all internal component alignment.

### Breakpoints

| Breakpoint | Width | Behaviour |
|------------|-------|-----------|
| Desktop | ≥ 1200 px | Two-column grid (65 % / 35 %), 2-column task cards |
| Tablet | 768 px – 1199 px | Single-column stacked layout, 2-column task cards |
| Mobile | < 768 px | Full-width single column, 1-column task cards, buttons wrap |

### Key responsive rules (all in each stylesheet)

```css
/* Tablet */
@media (max-width: 1199px) { … }

/* Mobile */
@media (max-width: 767px)  { … }

/* Very small */
@media (max-width: 400px)  { … }
```

---

## Typography

**Font:** [Inter](https://fonts.google.com/specimen/Inter) — loaded via Google Fonts.  
**Scale:** follows an 8 px grid (`--font-size-xs` 11 px → `--font-size-2xl` 24 px).

---

## Spacing System

All spacing tokens follow an **8 px grid**:

```
--space-1: 4px   --space-5: 20px
--space-2: 8px   --space-6: 24px
--space-3: 12px  --space-8: 32px
--space-4: 16px  --space-10: 40px
```

---

## Technology Used

- **HTML5** — semantic markup, ARIA labels for accessibility
- **CSS3** — custom properties, grid, flexbox, media queries, transitions, gradients
- **Google Fonts** — Inter (300–800 weight)
- **No JavaScript** — purely static, no build step required

---

## Getting Started

1. Clone / download the repository.
2. Open `module-2/mood-based-todo-app/index.html` in any modern browser.
3. No build step, no npm install — it just works. ✅

To view individual components, open any file inside `Components/` directly in a browser.

---

## Browser Support

Tested in all evergreen browsers (Chrome, Firefox, Edge, Safari). CSS custom properties and grid are fully supported in all modern browsers.
