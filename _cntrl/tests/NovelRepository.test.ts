import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_ROOT_PATH = path.resolve(__dirname, 'test_novel_root');

// Mock Config
vi.mock('../src/config/index.js', () => {
    // We have to re-compute or hardcode here because of hoisting
    const path = require('path'); // CommonJS fallback inside mock factory if needed, or assume node env
    // Actually, in Vitest environment, we can just return the object if we don't depend on outer scope
    return {
        NOVEL_DIR: path.resolve(process.cwd(), 'tests/test_novel_root'),
        PROJECT_ROOT: path.resolve(process.cwd()),
    };
});

// Import Repository AFTER mocking
import NovelRepository from '../src/repositories/NovelRepository.js';

describe('NovelRepository', () => {
    
    // We use the same path as defined in the mock above
    const TEST_ROOT = path.resolve(process.cwd(), 'tests/test_novel_root');

    beforeEach(async () => {
        // Clean start
        await fs.rm(TEST_ROOT, { recursive: true, force: true }).catch(() => {});
        await fs.mkdir(TEST_ROOT, { recursive: true });
        
        // Create a dummy file
        await fs.writeFile(path.join(TEST_ROOT, 'test.md'), 'Hello World');
        // Create a dummy project
        await fs.mkdir(path.join(TEST_ROOT, 'MyProject'), { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(TEST_ROOT, { recursive: true, force: true }).catch(() => {});
    });

    it('should list files in the root directory', async () => {
        const files = await NovelRepository.listFiles('');
        const names = files.map(f => f.name);
        expect(names).toContain('test.md');
        expect(names).toContain('MyProject');
    });

    it('should prevent path traversal', async () => {
        await expect(NovelRepository.listFiles('../')).rejects.toThrow('Access Denied');
    });

    it('should write files and create directories', async () => {
        await NovelRepository.writeFile('NewFolder/note.md', '# Note');
        const content = await NovelRepository.readFile('NewFolder/note.md');
        expect(content).toBe('# Note');
    });

    it('should set active novel only if it exists', async () => {
        await expect(NovelRepository.setActiveNovel('NonExistent')).rejects.toThrow();
        
        await NovelRepository.setActiveNovel('MyProject');
        expect(NovelRepository.getActiveNovelName()).toBe('MyProject');
    });

});