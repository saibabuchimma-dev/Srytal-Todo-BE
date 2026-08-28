import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";

export function authorize(...roles: ("Admin" | "Employee")[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to access this resource.",
      );
    }

    next();
  };
}
