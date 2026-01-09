import 'express-async-errors';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";

// Config & Utils
import { CONFIG, PROJECT_ROOT, PERSONA } from './src/config/index.js';
import { loadCortex } from './src/utils/cortexLoader.js';
import { logger } from './src/utils/logger.js';

// Routes
import apiRoutes from './src/routes/index.js';

// Middleware
import { errorHandler } from './src/middleware/errorHandler.js';

// Controllers
import { handleConnection } from './src/controllers/SocketController.js';

// Services
import { initWatcher } from './src/services/WatcherService.js';

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

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Serve Frontend ---
// Note: Adjusted path to point to dashboard/dist relative to this file
app.use(express.static(path.join(process.cwd(), 'dashboard/dist')));

// --- Error Handler ---
app.use(errorHandler);

// --- Socket.IO ---
io.on("connection", handleConnection);

// --- Start Server ---
httpServer.listen(CONFIG.PORT, async () => {
    logger.info(`[SYSTEM] CNTRL CORE ONLINE. Port ${CONFIG.PORT}`);
    await loadCortex();
    initWatcher(io);
});