# CNTRL Core API Documentation

## REST API (Base: `/api`)

### System
*   **GET `/status`**: Returns system health, drive root, and current persona.
*   **GET `/manifest`**: Serves the `MANIFEST.md` from the project root.

### Filesystem
*   **GET `/files/list?path=...`**: Lists files in the specified relative path.
*   **POST `/files/read`**: Reads a file. 
    *   Body: `{ "target": "relative/path/to/file.md" }`
*   **POST `/files/write`**: Writes/Updates a file.
    *   Body: `{ "target": "relative/path/to/file.md", "content": "..." }`

---

## Socket.IO Events

### Outbound (Client -> Server)
*   **`command`**: Primary AI inference. Expects `{ text: "..." }`.
*   **`oracle_roll`**: Creative generation. Expects `{ query: "..." }`.
*   **`list_novels`**: Requests a list of project directories.
*   **`open_novel`**: Sets active context. Expects `{ name: "..." }`.
*   **`lore_add`**: Writes a lore entry. `{ key: "...", content: "..." }`.
*   **`lore_get`**: Reads a lore entry. `{ key: "..." }`.
*   **`lore_list`**: Lists all lore entries.
*   **`get_stats`**: Requests word/chapter counts.
*   **`update_persona`**: Changes AI tone. `{ tone: "..." }`.
*   **`save_chat`**: Persists current session to disk. `{ messages: [...] }`.

### Inbound (Server -> Client)
*   **`message`**: General system or agent message.
*   **`agent_token`**: Incremental AI stream chunk.
*   **`agent_state`**: AI status updates (`THINKING`, `WRITING`, `IDLE`).
*   **`FILE_CHANGED`**: Real-time filesystem notification (`ADD`, `CHANGE`, `UNLINK`).
*   **`novels_list`**: Response to `list_novels`.
