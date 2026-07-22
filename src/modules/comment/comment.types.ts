import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

export const updateCommentSchema = createCommentSchema;

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
