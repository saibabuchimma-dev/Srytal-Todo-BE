import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/ApiError";
import { JwtPayload } from "@/types/authTypes";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload;

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    throw new ApiError(401, "Invalid Token");
  }
}
