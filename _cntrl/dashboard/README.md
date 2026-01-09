# CNTRL Dashboard ("The Face")

The **CNTRL Dashboard** is the React-based frontend tailored for a focused, "Editorial Luxury" writing experience. It serves as the visual interface for the Storyteller Engine.

## Architecture

*   **Layout (`IdeLayout.jsx`)**: The core orchestrator. Manages the 3-pane state (Nav, Library, Content, Oracle) and handles routing based on `activeMode`.
*   **Library (`Library.jsx`)**: A recursive file explorer that allows switching between "NOVELS", "ARTICLES", and "JOURNALS".
*   **Editor (`Editor.jsx`)**: The primary writing surface.
*   **Oracle (`Oracle.jsx`)**: The AI companion interface.

## Dashboards

The application features contextual dashboards based on the selected library category:

1.  **Home Feed**: A media-rich overview of all recent activity.
2.  **Novel Dashboard**: A dedicated command center for long-form fiction (currently "Coming Soon").
3.  **Articles Dashboard**: A Kanban-style masonry grid for managing short-form articles and essays.

## Design System

The project uses **Tailwind CSS** with a custom "Editorial" configuration:
*   **Fonts**: `Playfair Display` (Headings), `Inter` (UI), `JetBrains Mono` (Code/Meta).
*   **Theme**: "Soft Charcoal" (`#202023`) background with "Editorial Lavender" (`#BFA6F7`) accents.

## Development

Run locally via the root script or directly:

```bash
cd _cntrl/dashboard
npm install
npm run dev
```

## Production

The backend serves the compiled `dist/` folder.

```bash
npm run build
```
