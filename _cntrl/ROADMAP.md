# CNTRL Engineering Roadmap: The "Mobile Lab" Elevation Plan

This document outlines the phased development plan to elevate CNTRL from a functional prototype to a robust, portable software engineering suite.

**Mission:** Create a self-contained, distraction-free "Author's Workbench" that adheres to strict software engineering standards while maintaining "editorial luxury."

---

## 📅 Phase 1: Foundation & Sanitation (The "Clean Slate") [COMPLETE]
**Goal:** Pay down technical debt, enforce architectural standards, and prepare the codebase for scaling.

### Module 1.1: Backend Architecture (The "Mind")
- [x] **Route Extraction:** Refactor `server.js` to remove inline route definitions. Move them to:
    - `src/routes/files.routes.ts`
    - `src/routes/system.routes.ts`
    - `src/routes/index.ts` (Aggregator)
- [x] **Service Optimization:** Refactor `MuseService.ts` to implement the Singleton pattern properly and instantiate the Gemini client only once.
- [x] **Type Safety:** Ensure all Controller inputs are validated using `zod` schemas before processing.
- [x] **Logging:** Replace `console.log` with a structured logger (e.g., `winston` or a custom lightweight utility) that writes to `_cntrl/logs` for debugging without cluttering the CLI.

### Module 1.2: Frontend Configuration (The "Face")
- [x] **Environment Awareness:** Remove hardcoded `http://localhost:3001` from `App.jsx`.
    - Implement `import.meta.env.VITE_API_URL`.
- [x] **Branding Unification:** Rename all references of "Gibby Core" to "CNTRL Core".
- [x] **Asset Cleanup:** Audit `dashboard/public` and remove unused Vite placeholder assets.

---

## 🚀 Phase 2: Core Engine Hardening [COMPLETE]
**Goal:** Make the file system interactions bulletproof and the API self-documenting.

### Module 2.1: The Repository Layer
- [x] **Project Switching:** Update `NovelRepository` to robustly handle switching between multiple novels without server restarts.
- [x] **Error Handling:** Implement a global Error Handler middleware in Express to catch async errors and return standardized JSON error responses (e.g., `{ "error": "FILE_NOT_FOUND", "message": "..." }`).
- [x] **Testing Harness:** Set up `vitest` for the backend. Write unit tests for:
    - `NovelRepository` (Path traversal protection checks).
    - `MuseService` (Mocked API calls).

### Module 2.2: Data Consistency
- [x] **Manifest Sync:** Ensure `manifest.json` in `00_Meta` is automatically updated whenever a file is created or modified.
- [x] **Watcher:** Implement `chokidar` in the backend to watch the `novel/` directory and emit Socket.IO events (`FILE_CHANGED`) to the frontend when changes happen outside the UI (e.g., via CLI or manual edit).

---

## 🎨 Phase 3: The "Fantastical" Interface
**Goal:** Build the actual functional UI components, replacing placeholders.

### Module 3.1: The Workspace
- [x] **File Explorer:** Build a recursive React component to visualize the file tree returned by `/api/files/list`.
- [x] **Editor:** Implement a Markdown editor (e.g., using `Monaco` or `CodeMirror`) that supports:
    - [x] Auto-saving (via debounce).
    - [ ] "Zen Mode" (Full screen).
- [ ] **Tab System:** Allow opening multiple files (Lore + Chapter).

### Module 3.2: AI Integration ("The Oracle")
- [x] **Chat Interface:** Build a sliding side-panel for "Oracle" interactions.
- [x] **Context Awareness:** When asking the Oracle, automatically inject the "Active File" content into the prompt context.

### Module 3.3: Visual Refinement
- [x] **Theme Evolution:** Pivot from "True Charcoal" to "Soft Charcoal" (#202023) to reduce contrast strain.
- [x] **Contextual Dashboards:**
    - [x] **Novel Dashboard:** Implemented "Coming Soon" / Locked state overlay.
    - [x] **Articles Dashboard:** Implemented Masonry layout for non-fiction drafting.

---

## 🛠 Phase 4: CLI & Integration (The "Power User") [COMPLETE]
**Goal:** Ensure the CLI and Web Interface feel like two hands of the same body.

### Module 4.1: CLI Enhancements
- [x] **Live Status:** The CLI should subscribe to the same Socket.IO events as the frontend to show "Client Connected" or "File Edited" logs in real-time.
- [x] **Headless Mode:** Add a flag `./launch_cntrl.sh --headless` to run only the server without the TUI (useful for background operation).

### Module 4.2: Portability
- [x] **Relative Paths:** Verify `PROJECT_ROOT` calculation logic ensures it works regardless of mount point (`/Volumes/cntrl` or `D:\cntrl`).
- [x] **Startup Checks:** Enhance `launch_cntrl.sh` to check for:
    - Port availability (Handle "Address in use").
    - Internet connectivity (Warn if AI will be unavailable).

---

## 🏁 Phase 5: Final Polish [COMPLETE]
- [x] **Documentation:** Generate API docs (Swagger/OpenAPI) or a simple `API.md`.
- [x] **Production Build:** Create a `release.sh` script that cleans `node_modules`, compacts the database (if added), and zips the project for backup.

---
**Status:** COMPLETE / PRODUCTION READY
**Last Updated:** 2026-01-09
