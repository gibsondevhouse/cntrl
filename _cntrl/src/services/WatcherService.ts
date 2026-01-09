import chokidar from 'chokidar';
import { Server } from 'socket.io';
import path from 'path';
import { NOVEL_DIR } from '../config/index.js';
import { logger } from '../utils/logger.js';

export const initWatcher = (io: Server) => {
    logger.info(`[WATCHER] Initializing file watcher on: ${NOVEL_DIR}`);

    const watcher = chokidar.watch(NOVEL_DIR, {
        ignored: [
            /(^|[\]{2}[\/])\..*/, // Ignore dotfiles
            '**/node_modules/**',
            '**/_template/**'
        ],
        persistent: true,
        ignoreInitial: true,
        depth: 5
    });

    watcher
        .on('add', (filePath) => {
            const relativePath = path.relative(NOVEL_DIR, filePath);
            logger.info(`[WATCHER] File Added: ${relativePath}`);
            io.emit('FILE_CHANGED', { type: 'ADD', path: relativePath });
        })
        .on('change', (filePath) => {
            const relativePath = path.relative(NOVEL_DIR, filePath);
            logger.info(`[WATCHER] File Changed: ${relativePath}`);
            io.emit('FILE_CHANGED', { type: 'CHANGE', path: relativePath });
        })
        .on('unlink', (filePath) => {
            const relativePath = path.relative(NOVEL_DIR, filePath);
            logger.info(`[WATCHER] File Removed: ${relativePath}`);
            io.emit('FILE_CHANGED', { type: 'UNLINK', path: relativePath });
        });
        
    return watcher;
};
