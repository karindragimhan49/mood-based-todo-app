# Mood-Based To-Do App — Module 2 Assessment

A fully static, responsive **Mood-Based To-Do Application** built with pure HTML and CSS as part of the Metana Full-Stack Bootcamp Module 2 Assessment.

---

## Project Description

This project lays the foundation for a mood-aware task management app. It features a dark-themed UI with a vivid lime-green accent (`#aaff2e`), and consists of a home page plus a set of reusable static components. Tasks can be categorised as user-created or *suggested* (based on mood or weather context). The interface is fully responsive across desktop, tablet, and mobile screen sizes.

---

## Folder Structure

```
mood-based-todo-app/
├── Assets/                         # Images, icons, and other static assets
├── Components/
│   ├── taskComponent.html          # Reusable task card component
│   ├── suggestedTaskComponent.html # Suggested task card (mood/weather based)
│   ├── taskCreationForm.html       # Modal form for creating a new task
│   ├── moodSelecterForm.html       # Mood selector (slider + button group)
│   └── loginForm.html              # Login / authentication form
├── Styles/
│   ├── index.css                   # Home page styles + shared design tokens
│   ├── login.css                   # Login page container styles
│   ├── tasksComponent.css          # Task card styles
│   ├── suggestedTaskComponent.css  # Suggested task card styles
│   ├── taskCreationForm.css        # Task creation modal styles
│   ├── moodSelecter.css            # Mood selector styles
│   └── loginForm.css               # Login form styles
├── index.html                      # Home page
├── README.md                       # Project documentation
└── LICENSE
```

---

## Pages & Components

### Home Page (`index.html`)
- **Navbar** — App logo, welcome greeting, mood indicator pill, weather icon, and profile/login icon.
- **Tasks Panel** — "Ready for Today?" heading, task count, Add Task / Complete All / Show Completed buttons, responsive task card grid.
- **Suggested Tasks Sidebar** — Mood-based and weather-based suggested task cards.
- **Modals** — Add Task form, Mood Selector, and Login form are all accessible from the navbar and header buttons.

### Task Component (`Components/taskComponent.html`)
Reusable card displaying task name, duration, scheduled time, and action buttons (Complete / Edit / Delete).

### Suggested Task Component (`Components/suggestedTaskComponent.html`)
Card variant for AI/mood/weather-suggested tasks, showing the suggestion source (Mood or Weather tag).

### Task Creation Form (`Components/taskCreationForm.html`)
Modal form with fields for: Task Title, Task Description, Duration (minutes), Due Date, and Time.

### Mood Selector (`Components/moodSelecterForm.html`)
Interactive component with emoji icons, a range slider, and a three-button group (Sad / Neutral / Happy) for selecting the current mood.

### Login Form (`Components/loginForm.html`)
Clean auth modal with fields for Name, Email, and Password.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5 (semantic elements)           |
| Styling    | CSS3 (Custom Properties, Flexbox, Grid) |
| Icons      | Font Awesome 6 (CDN)                |
| JavaScript | Vanilla JS (modal toggles only)     |

---

## Design System

| Token            | Value       | Usage                        |
|------------------|-------------|------------------------------|
| `--bg-primary`   | `#13151f`   | Page background              |
| `--bg-secondary` | `#1e2130`   | Cards, panels, navbar        |
| `--bg-tertiary`  | `#252a3d`   | Input fields, inner cards    |
| `--accent`       | `#aaff2e`   | Primary lime-green accent    |
| `--accent-yellow`| `#f5c518`   | Mood-suggested task titles   |
| `--text-primary` | `#ffffff`   | Headings, body text          |
| `--text-secondary`| `#9ea3b8`  | Subtitles, placeholders      |
| `--border`       | `#2a2f45`   | Card and input borders       |

---

## Responsive Design

- CSS **Grid** for the two-column home layout (collapses to single column below 1100 px).
- CSS **Flexbox** for navbar, button groups, form rows, and card internals.
- Media queries ensure all text, inputs, and interactive elements remain usable on mobile (≥ 320 px).

---

## How to Run

No build step required — simply open `index.html` in any modern browser:

```bash
# Using VS Code Live Server
# Right-click index.html → "Open with Live Server"

# Or open directly
start index.html   # Windows
open index.html    # macOS
```

---

## Screenshots

> Add screenshots or a live demo link here after deployment.

---

## License

MIT — see [LICENSE](LICENSE) file for details.
