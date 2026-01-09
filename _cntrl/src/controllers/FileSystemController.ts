import type { Request, Response } from 'express';
import NovelRepository from '../repositories/NovelRepository.js';
import { listFilesSchema, readFileSchema, writeFileSchema } from '../schemas/file.schema.js';

export const listFiles = async (req: Request, res: Response): Promise<void> => {
    const { query } = listFilesSchema.parse(req);
    const targetPath = query.path || '';
    
    if (targetPath.includes('..')) {
        throw new Error("Access Denied: Path traversal detected.");
    }
    
    const files = await NovelRepository.listFiles(targetPath);
    res.json({ files });
};

export const readFile = async (req: Request, res: Response): Promise<void> => {
    const { body } = readFileSchema.parse(req);
    const content = await NovelRepository.readFile(body.target);
    res.json({ content });
};

export const writeFile = async (req: Request, res: Response): Promise<void> => {
    const { body } = writeFileSchema.parse(req);
    await NovelRepository.writeFile(body.target, body.content);
    res.json({ success: true });
};
