import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokenDto {
  refreshToken: string;
}

export interface JwtPayload {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "Employee";
  type: "access" | "refresh";
}
