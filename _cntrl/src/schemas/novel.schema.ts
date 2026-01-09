import { z } from 'zod';

export const CreateNovelSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    summary: z.string().min(5, "Summary must be at least 5 characters").max(500, "Summary is too long")
});

export type CreateNovelInput = z.infer<typeof CreateNovelSchema>;
