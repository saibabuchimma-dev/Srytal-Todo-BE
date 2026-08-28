import crypto from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "@/config";
import { JwtPayload } from "@/types/authTypes";

const accessSecret = config.jwtSecret as Secret;
const refreshSecret = config.jwtRefreshSecret as Secret;

function toPayload(
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "Admin" | "Employee";
  },
  type: JwtPayload["type"],
): JwtPayload {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    type,
  };
}

export function generateAccessToken(
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "Admin" | "Employee";
  },
): string {
  return jwt.sign(toPayload(user, "access"), accessSecret, {
    expiresIn: config.jwtAccessExpiresIn as SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "Admin" | "Employee";
  },
): string {
  return jwt.sign(toPayload(user, "refresh"), refreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, refreshSecret) as JwtPayload;

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return decoded;
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiry(): Date {
  const ms = msToNumber(config.jwtRefreshExpiresIn);

  return new Date(Date.now() + ms);
}

function msToNumber(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])?$/);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = Number(match[1]);

  switch (match[2]) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return value * 24 * 60 * 60 * 1000;
  }
}
