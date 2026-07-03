import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to access this resource.",
      );
    }

    next();
  };
}
