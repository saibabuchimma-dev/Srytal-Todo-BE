import crypto from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";
import { JwtPayload } from "./auth.types";

const accessSecret = env.JWT_SECRET as Secret;
const refreshSecret = env.JWT_REFRESH_SECRET as Secret;

function toPayload(
  user: { id: string; fullName: string; email: string; role: "Admin" | "Employee" },
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
  user: { id: string; fullName: string; email: string; role: "Admin" | "Employee" },
): string {
  return jwt.sign(toPayload(user, "access"), accessSecret, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(
  user: { id: string; fullName: string; email: string; role: "Admin" | "Employee" },
): string {
  return jwt.sign(toPayload(user, "refresh"), refreshSecret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
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

export function generateTokenId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function refreshTokenExpiry(): Date {
  const ms = msToNumber(env.JWT_REFRESH_EXPIRES_IN);

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
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return value * 24 * 60 * 60 * 1000;
  }
}
