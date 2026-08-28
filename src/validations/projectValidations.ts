import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z.string().trim().optional().default(""),

  status: z.enum(["Planning", "In Progress", "Completed"]).default("Planning"),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  members: z.array(z.string()).optional().default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export const searchProjectSchema = z.object({
  search: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  status: z.enum(["Planning", "In Progress", "Completed"]).optional(),
});

export const assignMembersSchema = z.object({
  employeeIds: z.array(z.string()).min(1, "At least one employee is required"),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type SearchProjectDto = z.infer<typeof searchProjectSchema>;
export type AssignMembersDto = z.infer<typeof assignMembersSchema>;
