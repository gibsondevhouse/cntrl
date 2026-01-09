# CNTRL: The Storyteller Engine - Project Context

## Project Overview
CNTRL is a "Storyteller Engine" designed as a self-contained, portable, and distraction-free "Author's Workbench". It operates as a local web application with a CLI component, running directly from a portable drive (simulated here in `/Volumes/cntrl`).

### Architecture
The system follows a "Mind, Face, Hand" architecture:
*   **The Mind (Backend)**: A Node.js/Express server (`_cntrl/server.js`) that acts as the "Muse". It handles:
    *   File system operations (strictly scoped to the `novel/` directory).
    *   AI integration via Google Gemini API.
    *   Socket.IO for real-time communication with the frontend.
    *   A CLI REPL for system management.
*   **The Face (Frontend)**: A React Single Page Application (`_cntrl/dashboard`) built with Vite and Tailwind CSS. It provides the "Fantastical" user interface.
*   **The Cortex**: A data storage layer (`_cntrl/cortex`) for AI context and memory.

## Directory Structure
*   `_cntrl/`: Core application logic (Hidden/Internal).
    *   `server.js`: Main backend entry point.
    *   `dashboard/`: React frontend source.
    *   `cortex/`: AI memory and context storage.
*   `novel/`: User content storage. This is the **only** directory the application interacts with for reading/writing user data.
*   `code/`: (Empty) Potentially reserved for user scripts or future expansion.
*   `launch_cntrl.sh`: Main startup script.

## Building and Running

### Prerequisites
*   Node.js (v20+ recommended based on usage of `node --watch` and recent dependencies).
*   A valid Google Gemini API Key in `_cntrl/.env` (variable: `GEMINI_API_KEY`).

### Startup
To start the entire system (Backend + CLI + Serving Frontend):
```bash
./launch_cntrl.sh
```
This script now orchestrates:
1.  **Backend**: Starts `node server.js` in the background (Port 3001).
2.  **CLI**: Launches the Ink-based TUI (`npm run cli`) in the foreground.

**Manual Startup:**
```bash
# Terminal 1 (Server)
cd _cntrl
npm start

# Terminal 2 (CLI)
cd _cntrl
npm run cli
```

### Development
**Backend (`_cntrl`):**
```bash
cd _cntrl
npm install
npm run dev # Runs with node --watch
```

**Frontend (`_cntrl/dashboard`):**
```bash
cd _cntrl/dashboard
npm install
npm run dev   # Starts Vite dev server
npm run build # Builds to dist/ folder (served by backend)
```

## Conventions & Standards

*   **Module System**: The project uses **ES Modules** (`"type": "module"` in both `package.json` files). Use `import`/`export`.
*   **Path Security**: File system access in `server.js` is strictly validated to prevent directory traversal outside of the `novel` directory.
*   **Styling**:
    *   **Frontend**: Tailwind CSS with a focus on "Editorial Luxury" (Dark mode, Serif fonts, Lavender/Gold accents).
    *   **CLI**: Custom ANSI escape codes for styling (Gold/Magenta).
*   **AI Integration**:
    *   Uses Google Gemini 1.5 Flash.
    *   Context is constructed via RAG (Retrieval-Augmented Generation) from the `novel` directory content (specifically `manifest.json`).
*   **Frontend-Backend Comms**:
    *   **Socket.IO**: For real-time AI streaming ("The Hand").
    *   **REST API**: For file operations (`/api/files/...`) and system status.
