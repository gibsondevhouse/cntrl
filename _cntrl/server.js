import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DRIVE_ROOT = path.resolve(__dirname, "../");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// --- CNTRL Persona Constants ---
const PERSONA = {
  name: "CNTRL",
  role: "System Orchestrator",
  tone: "Assertive, Precise, Female",
  description: "I am CNTRL. I have control of all apps built onto this drive.",
};

// --- Basic Routes ---
app.get("/api/status", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "CNTRL V2.0",
    drive_root: DRIVE_ROOT,
    persona: PERSONA,
  });
});

app.get("/api/manifest", (req, res) => {
  res.sendFile(path.join(DRIVE_ROOT, "MANIFEST.md"));
});

// Serve Frontend (Dashboard)
app.use(express.static(path.join(__dirname, 'dashboard/dist')));


// --- File System Routes ---
import fs from 'fs/promises';

// Helper to safely get file path
const getSafePath = (targetPath) => {
    const safeRoot = path.join(DRIVE_ROOT, 'novel');
    const fullPath = path.join(safeRoot, targetPath || '');
    if (!fullPath.startsWith(safeRoot)) throw new Error("Access Denied");
    return fullPath;
};

app.get('/api/files/list', async (req, res) => {
    try {
        const targetPath = req.query.path || '';
        // Prevent directory traversal attacks
        if (targetPath.includes('..')) {
            return res.status(403).json({ error: "Access Denied" });
        }

        const rootPath = path.join(DRIVE_ROOT, 'novel', targetPath);
        const entries = await fs.readdir(rootPath, { withFileTypes: true });
        
        const files = entries.map(entry => ({
            name: entry.name,
            isDirectory: entry.isDirectory(),
            path: path.join(targetPath, entry.name)
        }));
        
        // Sort: Folders first
        files.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
            return a.isDirectory ? -1 : 1;
        });
        
        res.json({ files });
    } catch (error) {
        console.error("List Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/files/read', async (req, res) => {
    try {
        const { target } = req.body;
        const filePath = getSafePath(target);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/files/write', async (req, res) => {
    try {
        const { target, content } = req.body;
        const filePath = getSafePath(target);
        await fs.writeFile(filePath, content, 'utf-8');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Real-time Event Handling ---
// --- Real-time Event Handling ---
io.on("connection", (socket) => {
  console.log("CNTRL Terminal Connected:", socket.id);

  socket.emit("message", {
    sender: "system",
    text: `CNTRL CORE ONLINE. Drive mount: ${DRIVE_ROOT}`,
  });

  socket.on("command", async (data) => {
    const { text } = data;
    console.log(`Command received: ${text}`);

    // 1. Acknowledge (Thinking State)
    socket.emit("agent_state", { state: "THINKING" });
    
    // CONTEXT RAG: Load Manifest if available to simulate grounding
    let contextStr = "No Context";
    try {
        // Find the first novel in the directory
        const novelRoot = path.join(DRIVE_ROOT, 'novel');
        const novels = await fs.readdir(novelRoot, { withFileTypes: true });
        const targetNovel = novels.find(d => d.isDirectory() && !d.name.startsWith('_'));
        
        if (targetNovel) {
             const manifestPath = path.join(novelRoot, targetNovel.name, '00_Meta', 'manifest.json');
             const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
             contextStr = `Project: ${manifest.title} // Summary: ${manifest.context.summary}`;
        }
    } catch {
        // Ignore context errors
    }

    // Simulate NLU Delay
    await new Promise(r => setTimeout(r, 1500));

    // 2. Mock Reasoning/Action (Server Side Router)
    socket.emit("agent_state", { state: "WRITING" });
    
    // Simulate Streaming Response with Context
    const responseText = `[Reasoning with: ${contextStr}]\n\nI processed your request: "${text}". \n\nThis is a streaming response from the Neural Core.`;
    const tokens = responseText.split(/(?=\s)/); // Split by words keeping whitespace
    
    for (const token of tokens) {
        socket.emit("agent_token", { token });
        await new Promise(r => setTimeout(r, 50)); // Typing effect
    }

    // 3. Finalize
    socket.emit("agent_state", { state: "IDLE" });
    socket.emit("message", { sender: "AGENT", text: responseText, final: true });
  });
});

// --- CORTEX INTEGRATION ---
const CORTEX_PATH = path.join(DRIVE_ROOT, '_cntrl', 'cortex');
let MEMORY = {
    user: {},
    facts: []
};

// Load Cortex Memory
const loadCortex = async () => {
    try {
        const userProfile = await fs.readFile(path.join(CORTEX_PATH, 'memories', 'user_profile.json'), 'utf-8');
        MEMORY.user = JSON.parse(userProfile);
        console.log(`>> CORTEX LOADED: Welcome back, ${MEMORY.user.username}.`);
        
        // Log startup to evolution
        const evolutionPath = path.join(CORTEX_PATH, 'memories', 'system_evolution.md');
        await fs.appendFile(evolutionPath, `\n- **${new Date().toISOString().split('T')[0]}**: System Boot. Port ${PORT}.\n`, 'utf-8');
    } catch (e) {
        console.log(`>> CORTEX ERROR: Could not load memories. (${e.message})`);
    }
};

// --- CLI REPL Interface ---
import readline from 'readline';
import { exec } from 'child_process';

// ANSI SGR Codes
const STYLE = {
    GOLD: '\x1b[33m',
    DIM: '\x1b[2m',
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    RED: '\x1b[31m',
    CYAN: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

const openUrl = (url) => {
    const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    exec(`${start} ${url}`);
};

const commands = {
  help: () => {
    console.log(`${STYLE.DIM}
    ┌──────────────────────────────────────────────┐
    │  AVAILABLE COMMANDS                          │
    ├──────────────────────────────────────────────┤
    │  ${STYLE.GOLD}status${STYLE.DIM}    : System health check             │
    │  ${STYLE.GOLD}list${STYLE.DIM}      : List novel projects             │
    │  ${STYLE.GOLD}create${STYLE.DIM}    : Interactive novel generator     │
    │  ${STYLE.GOLD}open${STYLE.DIM}      : Launch IDE in Browser           │
    │  ${STYLE.GOLD}network${STYLE.DIM}   : Show network interfaces         │
    │  ${STYLE.GOLD}clear${STYLE.DIM}     : Clear terminal                  │
    │  ${STYLE.GOLD}exit${STYLE.DIM}      : Shutdown CNTRL                  │
    └──────────────────────────────────────────────┘${STYLE.RESET}
    `);
  },
  open: () => {
      console.log(`${STYLE.DIM}>> Launching CNTRL Interface...${STYLE.RESET}`);
      openUrl(`http://localhost:${PORT}`);
  },
  status: () => {
    console.log(`
    ${STYLE.BOLD}SYSTEM STATUS${STYLE.RESET} ${STYLE.DIM}/////////////////////////////////${STYLE.RESET}
    ${STYLE.DIM}│${STYLE.RESET} Persona   : ${STYLE.GOLD}${PERSONA.name}${STYLE.RESET}
    ${STYLE.DIM}│${STYLE.RESET} Role      : ${PERSONA.role}
    ${STYLE.DIM}│${STYLE.RESET} Port      : ${STYLE.CYAN}${PORT}${STYLE.RESET}
    ${STYLE.DIM}│${STYLE.RESET} Cortex    : ${STYLE.GOLD}ACTIVE${STYLE.RESET}
    ${STYLE.DIM}│${STYLE.RESET} User      : ${MEMORY.user.username || 'Unknown'}
    ${STYLE.DIM}└──────────────────────────────────────────${STYLE.RESET}
    `);
  },
  list: async () => {
    try {
        const rootPath = path.join(DRIVE_ROOT, 'novel');
        const entries = await fs.readdir(rootPath, { withFileTypes: true });
        console.log(`\n${STYLE.BOLD}LIBRARY CONTENTS${STYLE.RESET}`);
        let found = false;
        entries.forEach(e => {
            if(e.isDirectory() && !e.name.startsWith('_')) {
                console.log(`  ${STYLE.GOLD}▪${STYLE.RESET} ${e.name}`);
                found = true;
            }
        });
        if(!found) console.log(`  ${STYLE.DIM}(No novels found)${STYLE.RESET}`);
        console.log('');
    } catch(e) {
        console.log(`${STYLE.RED}Error: ${e.message}${STYLE.RESET}`);
    }
  },
  network: () => {
     console.log(`${STYLE.DIM}Network Interfaces: [Hidden for security]${STYLE.RESET}`);
  },
  clear: () => {
    console.clear();
    console.log(`${STYLE.DIM}>> REPL READY.${STYLE.RESET}`);
  },
  exit: () => {
     console.log(`${STYLE.RED}SHUTTING DOWN CNTRL...${STYLE.RESET}`);
     process.exit(0);
  },
  create: async (initialArgs) => {
    try {
        let title = '';
        if (initialArgs.length > 0) {
            title = initialArgs.join(' ').replace(/"/g, '');
        } else {
            title = await ask(`${STYLE.GOLD}>> Name of the Novel? ${STYLE.RESET}`);
        }
        
        if (!title.trim()) {
            console.log("Operation cancelled. Title required.");
            return;
        }

        const premise = await ask(`${STYLE.GOLD}>> What is the story about? (One line): ${STYLE.RESET}`);

        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
        const bookPath = path.join(DRIVE_ROOT, 'novel', safeTitle);
        const templatePath = path.join(DRIVE_ROOT, 'novel', '_template');

        console.log(`\n${STYLE.DIM}Generating "${title}"...${STYLE.RESET}`);
        
        await fs.cp(templatePath, bookPath, { recursive: true });
        
        const manifestPath = path.join(bookPath, '00_Meta', 'manifest.json');
        let manifestContent = await fs.readFile(manifestPath, 'utf-8');
        manifestContent = manifestContent
            .replace('{{TITLE}}', title)
            .replace('{{DATE}}', new Date().toISOString());
        
        const manifestJson = JSON.parse(manifestContent);
        manifestJson.context.summary = premise;
        
        await fs.writeFile(manifestPath, JSON.stringify(manifestJson, null, 2), 'utf-8');

        console.log(`\n${STYLE.GOLD}[SUCCESS] Novel initialized.${STYLE.RESET}`);
        console.log(`${STYLE.DIM}Location: ${bookPath}${STYLE.RESET}`);
        console.log(`${STYLE.DIM}Summary: ${premise}${STYLE.RESET}\n`);
        
    } catch (e) {
        console.log(`${STYLE.RED}[ERROR] Creation failed: ${e.message}${STYLE.RESET}`);
    }
  }
};

const startRepl = async () => {
  console.log(`${STYLE.GOLD}
   ██████╗███╗   ██╗████████╗██████╗ ██╗
  ██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██║
  ██║     ██╔██╗ ██║   ██║   ██████╔╝██║
  ██║     ██║╚██╗██║   ██║   ██╔══██╗██║
  ╚██████╗██║ ╚████║   ██║   ██║  ██║███████╗
   ╚═════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ v2.0
  ${STYLE.RESET}`);
  console.log(`${STYLE.DIM}>> CNTRL CORE ACTIVE on Port ${PORT}${STYLE.RESET}`);
  console.log(`${STYLE.DIM}>> REPL READY. Type 'help' for commands.${STYLE.RESET}\n`);

  while (true) {
      const line = await ask(`${STYLE.GOLD}CNTRL // COMMAND > ${STYLE.RESET}`);
      const input = line.trim();
      if (!input) continue;

      const [cmd, ...args] = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
      
      if (commands[cmd]) {
        await commands[cmd](args);
      } else {
        console.log(`${STYLE.RED}Unknown command: '${cmd}'.${STYLE.RESET}`);
      }
  }
};

const PORT = 3001;
httpServer.listen(PORT, async () => {
    await loadCortex();
    startRepl();
});
