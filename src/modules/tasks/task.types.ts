import { z } from "zod";

export const createTaskSchema = z.object({
  assignedTo: z.string().nullable().optional(),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z.string().trim().optional().default(""),

  status: z.enum(["Pending", "In Progress", "Completed"]).default("Pending"),

  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),

  dueDate: z.coerce.date(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const searchTaskSchema = z.object({
  search: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),

  priority: z.enum(["Low", "Medium", "High"]).optional(),

  assignedTo: z.string().optional(),
});

export interface TaskParams {
  id: string;
}

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

export type SearchTaskDto = z.infer<typeof searchTaskSchema>;
