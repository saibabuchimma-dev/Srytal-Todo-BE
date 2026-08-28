import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/ApiError";
import { AuthService } from "@/services/authService";
import {
  loginSchema,
  refreshTokenSchema,
} from "@/validations/authValidations";

const service = new AuthService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      400,
      parsed.error.issues[0]?.message ?? "Invalid login data",
    );
  }

  const response = await service.login(parsed.data);

  res.json({
    success: true,
    message: "Login Successful",
    data: response,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const parsed = refreshTokenSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      400,
      parsed.error.issues[0]?.message ?? "Refresh token is required",
    );
  }

  const response = await service.refresh(parsed.data);

  res.json({
    success: true,
    message: "Token refreshed successfully",
    data: response,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const parsed = refreshTokenSchema.safeParse(req.body);

  if (parsed.success) {
    await service.logout(parsed.data.refreshToken);
  }

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
