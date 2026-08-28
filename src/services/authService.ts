import bcrypt from "bcryptjs";
import { ApiError } from "@/utils/ApiError";
import { Employee } from "@/models/Employee";
import { AuthToken } from "@/models/AuthToken";
import { AuthTokenDto, LoginDto } from "@/validations/authValidations";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  verifyRefreshToken,
} from "./tokenService";

export class AuthService {
  async login(data: LoginDto) {
    const user = await Employee.findOne({ email: data.email }).select(
      "+password",
    );

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    await Employee.findByIdAndUpdate(user.id, {
      lastLogin: new Date(),
    });

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

    const stored = await AuthToken.findOne({
      token: hashRefreshToken(data.refreshToken),
    });

    if (!stored) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (stored.revoked) {
      throw new ApiError(401, "Refresh token has been revoked");
    }

    if (stored.expiresAt.getTime() < Date.now()) {
      await AuthToken.deleteMany({ expiresAt: { $lte: new Date() } });
      throw new ApiError(401, "Refresh token has expired");
    }

    const user = await Employee.findById(stored.user.toString());

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
    const stored = await AuthToken.findOne({
      token: hashRefreshToken(refreshToken),
    });

    if (!stored || stored.revoked) {
      return;
    }

    await AuthToken.findByIdAndUpdate(stored.id, {
      revoked: true,
      revokedAt: new Date(),
    });

    return {
      message: "Logged out successfully",
    };
  }

  private async buildAuthResponse(
    userInfo: {
      id: string;
      fullName: string;
      email: string;
      role: "Admin" | "Employee";
    },
    mustChangePassword: boolean,
    prevTokenId?: string,
  ) {
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    await AuthToken.create({
      user: userInfo.id,
      token: hashRefreshToken(refreshToken),
      expiresAt: refreshTokenExpiry(),
    });

    if (prevTokenId) {
      await AuthToken.findByIdAndUpdate(prevTokenId, {
        revoked: true,
        revokedAt: new Date(),
        replacedByToken: refreshToken,
      });
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
