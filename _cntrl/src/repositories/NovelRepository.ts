import fs from 'fs/promises';
import path from 'path';
import { NOVEL_DIR } from '../config/index.js';

interface FileEntry {
    name: string;
    isDirectory: boolean;
    path: string;
}

interface ContextResult {
    found: boolean;
    title?: string;
    summary?: string;
}

class NovelRepository {
    private root: string;
    private activeNovel: string | null = null;

    constructor() {
        this.root = NOVEL_DIR;
    }

    /**
     * Sets the active novel project.
     * Verifies existence before setting.
     * @param name Name of the project directory
     */
    public async setActiveNovel(name: string): Promise<void> {
        const projectPath = path.join(this.root, name);
        try {
            await fs.access(projectPath);
            this.activeNovel = name;
        } catch {
            throw new Error(`Project "${name}" does not exist.`);
        }
    }

    public getActiveNovelName(): string | null {
        return this.activeNovel;
    }

    /**
     * Ensures the requested path is within the allowed Novel directory.
     * @param {string} targetPath 
     * @returns {string} Safe absolute path
     */
    private _getSafePath(targetPath: string): string {
        const fullPath = path.join(this.root, targetPath || '');
        if (!fullPath.startsWith(this.root)) {
            throw new Error("Access Denied: Path traversal detected.");
        }
        return fullPath;
    }

    /**
     * Helper to update the manifest when a file is changed.
     * @param filePath The path of the file that changed
     */
    private async _updateManifest(filePath: string): Promise<void> {
        // Find which novel this file belongs to
        const relative = path.relative(this.root, filePath);
        const novelName = relative.split(path.sep)[0];
        
        if (!novelName || novelName.startsWith('_')) return;

        const manifestPath = path.join(this.root, novelName, '00_Meta', 'manifest.json');
        
        try {
            // Check if manifest exists
            await fs.access(manifestPath);
            
            const content = await fs.readFile(manifestPath, 'utf-8');
            const manifest = JSON.parse(content);
            
            manifest.context.last_updated = new Date().toISOString();
            
            await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        } catch {
            // Manifest might not exist or be corrupted, ignore silently
        }
    }

    /**
     * Lists files in a directory.
     * @param {string} relativePath 
     */
    async listFiles(relativePath: string = ''): Promise<FileEntry[]> {
        const dirPath = this._getSafePath(relativePath);
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        const files: FileEntry[] = entries.map(entry => ({
            name: entry.name,
            isDirectory: entry.isDirectory(),
            path: path.join(relativePath, entry.name)
        }));

        // Sort: Folders first
        return files.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
            return a.isDirectory ? -1 : 1;
        });
    }

    async readFile(relativePath: string): Promise<string> {
        const filePath = this._getSafePath(relativePath);
        return await fs.readFile(filePath, 'utf-8');
    }

    async writeFile(relativePath: string, content: string): Promise<void> {
        const filePath = this._getSafePath(relativePath);
        // Ensure directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');

        // Trigger Manifest Update (Fire and forget)
        this._updateManifest(filePath);
    }

    async getNovels(): Promise<string[]> {
        const entries = await fs.readdir(this.root, { withFileTypes: true });
        return entries
            .filter(e => e.isDirectory() && !e.name.startsWith('_'))
            .map(e => e.name);
    }

    async createNovel(title: string, summary: string): Promise<string> {
        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
        const bookPath = path.join(this.root, safeTitle);
        const templatePath = path.join(this.root, '_template');

        // Check if template exists
        try {
            await fs.access(templatePath);
        } catch {
            throw new Error("Template directory missing.");
        }

        // Copy template
        await fs.cp(templatePath, bookPath, { recursive: true });
        
        // Ensure Lore Directory
        await fs.mkdir(path.join(bookPath, '01_Lore'), { recursive: true });
        
        // Update manifest
        const manifestPath = path.join(bookPath, '00_Meta', 'manifest.json');
        const manifestContent = await fs.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestContent);
        
        manifest.title = title;
        manifest.context.summary = summary;
        manifest.context.last_updated = new Date().toISOString();
        
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        
        return bookPath;
    }

    // --- LORE SYSTEM ---
    async writeLore(key: string, content: string): Promise<void> {
        if (!this.activeNovel) throw new Error("No active novel.");
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        const filePath = path.join(this.root, this.activeNovel, '01_Lore', `${safeKey}.md`);
        await fs.writeFile(filePath, content, 'utf-8');
        this._updateManifest(filePath);
    }

    async readLore(key: string): Promise<string> {
        if (!this.activeNovel) throw new Error("No active novel.");
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        const filePath = path.join(this.root, this.activeNovel, '01_Lore', `${safeKey}.md`);
        return await fs.readFile(filePath, 'utf-8');
    }

    async listLore(): Promise<string[]> {
        if (!this.activeNovel) throw new Error("No active novel.");
        const lorePath = path.join(this.root, this.activeNovel, '01_Lore');
        try {
            const files = await fs.readdir(lorePath);
            return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
        } catch {
            return [];
        }
    }

    // --- STATISTICS ---
    async getStats(): Promise<{ wordCount: number, chapterCount: number }> {
        if (!this.activeNovel) throw new Error("No active novel.");
        const projectPath = path.join(this.root, this.activeNovel);
        
        let wordCount = 0;
        let chapterCount = 0;

        async function traverse(dir: string) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const res = path.resolve(dir, entry.name);
                if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('00_Meta')) {
                    await traverse(res);
                } else if (entry.isFile() && entry.name.endsWith('.md')) {
                    if (!dir.includes('00_Meta') && !dir.includes('01_Lore')) {
                        const content = await fs.readFile(res, 'utf-8');
                        wordCount += content.split(/\s+/).length;
                        chapterCount++;
                    }
                }
            }
        }
        
        await traverse(projectPath);
        return { wordCount, chapterCount };
    }

    /**
     * Retrieves the context of the currently active novel.
     * Looks for the first directory that doesn't start with underscore.
     */
    async getActiveContext(): Promise<ContextResult> {
        try {
            let targetName = this.activeNovel;
            
            if (!targetName) {
                const entries = await fs.readdir(this.root, { withFileTypes: true });
                const targetNovel = entries.find(d => d.isDirectory() && !d.name.startsWith('_'));
                if (!targetNovel) return { found: false };
                targetName = targetNovel.name;
            }
            
            const manifestPath = path.join(this.root, targetName, '00_Meta', 'manifest.json');
            const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
            return {
                title: manifest.title,
                summary: manifest.context.summary,
                found: true
            };
        } catch (error) {
            // Use global error handler style for consistency in logs, 
            // but here we just return not found as it's a query result
            console.error("Context Retrieval Error:", (error as Error).message);
        }
        return { found: false };
    }
}

export default new NovelRepository();