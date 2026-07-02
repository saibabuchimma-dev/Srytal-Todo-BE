import { z } from 'zod';

export const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters'),

  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),

  role: z
    .enum(['Admin', 'Employee'])
    .default('Employee'),

  avatar: z
    .string()
    .trim()
    .optional()
    .default(''),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const updateEmployeeSchema = createEmployeeSchema
  .omit({
    password: true,
  })
  .partial();

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Current password is required'),

  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters'),
});

export const searchEmployeeSchema = z.object({
  search: z.string().optional().default(''),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreateEmployeeDto = z.infer<
  typeof createEmployeeSchema
>;

export type UpdateEmployeeDto = z.infer<
  typeof updateEmployeeSchema
>;

export type ChangePasswordDto = z.infer<
  typeof changePasswordSchema
>;

export type SearchEmployeeDto = z.infer<
  typeof searchEmployeeSchema
>;