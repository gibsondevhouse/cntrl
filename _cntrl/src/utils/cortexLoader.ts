import fs from 'fs/promises';
import path from 'path';
import { CORTEX_PATH, CONFIG } from '../config/index.js';
import { logger } from './logger.js';

interface UserProfile {
    username: string;
    [key: string]: unknown;
}

export const loadCortex = async (): Promise<void> => {
    try {
        const userProfile = await fs.readFile(path.join(CORTEX_PATH, 'memories', 'user_profile.json'), 'utf-8');
        const user: UserProfile = JSON.parse(userProfile);
        logger.info(`>> CORTEX LOADED: Welcome back, ${user.username}.`);
        
        // Log startup
        const evolutionPath = path.join(CORTEX_PATH, 'memories', 'system_evolution.md');
        await fs.appendFile(evolutionPath, `\n- **${new Date().toISOString().split('T')[0]}**: System Boot. Port ${CONFIG.PORT}.\n`, 'utf-8');
    } catch (e) {
        logger.error(`>> CORTEX ERROR: Could not load memories. (${(e as Error).message})`);
    }
};
