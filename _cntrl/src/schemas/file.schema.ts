import { z } from 'zod';

export const listFilesSchema = z.object({
    query: z.object({
        path: z.string().optional()
    })
});

export const readFileSchema = z.object({
    body: z.object({
        target: z.string().min(1, "Target path is required")
    })
});

export const writeFileSchema = z.object({
    body: z.object({
        target: z.string().min(1, "Target path is required"),
        content: z.string()
    })
});
