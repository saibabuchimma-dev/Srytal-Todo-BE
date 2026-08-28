import bcrypt from "bcryptjs";
import { ApiError } from "@/utils/ApiError";
import { AuthRepository } from "./auth.repository";
import { AuthTokenDto, LoginDto } from "./auth.types";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  verifyRefreshToken,
} from "./token.service";

const repository = new AuthRepository();

export class AuthService {
  async login(data: LoginDto) {
    const user = await repository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    await repository.updateLastLogin(user.id);

    const userInfo = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role as "Admin" | "Employee",
    };

    return this.buildAuthResponse(userInfo, user.mustChangePassword);
  }

  async refresh(data: AuthTokenDto) {
    try {
      verifyRefreshToken(data.refreshToken);
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const stored = await repository.findRefreshToken(
      hashRefreshToken(data.refreshToken),
    );

    if (!stored) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (stored.revoked) {
      throw new ApiError(401, "Refresh token has been revoked");
    }

    if (stored.expiresAt.getTime() < Date.now()) {
      await repository.deleteExpiredTokens();
      throw new ApiError(401, "Refresh token has expired");
    }

    const user = await repository.findById(stored.user.toString());

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const userInfo = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role as "Admin" | "Employee",
    };

    return this.buildAuthResponse(userInfo, user.mustChangePassword, stored.id);
  }

  async logout(refreshToken: string) {
    const stored = await repository.findRefreshToken(hashRefreshToken(refreshToken));

    if (!stored || stored.revoked) {
      return;
    }

    await repository.revokeRefreshToken(stored.id);

    return {
      message: "Logged out successfully",
    };
  }

  private async buildAuthResponse(
    userInfo: { id: string; fullName: string; email: string; role: "Admin" | "Employee" },
    mustChangePassword: boolean,
    prevTokenId?: string,
  ) {
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    await repository.createRefreshToken({
      user: userInfo.id,
      token: hashRefreshToken(refreshToken),
      expiresAt: refreshTokenExpiry(),
    });

    if (prevTokenId) {
      await repository.revokeRefreshToken(prevTokenId, refreshToken);
    }

    return {
      accessToken,
      refreshToken,
      mustChangePassword,
      user: {
        id: userInfo.id,
        fullName: userInfo.fullName,
        email: userInfo.email,
        role: userInfo.role,
        mustChangePassword,
      },
    };
  }
}
