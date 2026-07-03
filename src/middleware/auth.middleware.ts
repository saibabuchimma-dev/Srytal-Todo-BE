import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { ApiError } from '@/utils/ApiError';

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as {
      id: string;
      email: string;
      role: 'Admin' | 'Employee';
    };

    req.user = decoded;

    next();
  } catch {
    throw new ApiError(401, 'Invalid Token');
  }
}