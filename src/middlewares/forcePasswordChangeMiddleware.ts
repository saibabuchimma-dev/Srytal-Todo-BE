import { NextFunction, Request, Response } from "express";
import { Employee } from "@/models/Employee";
import { ApiError } from "@/utils/ApiError";

export async function forcePasswordChange(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next();
  }

  if (req.user.role === "Admin") {
    return next();
  }

  const employee = await Employee.findById(req.user.id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  if (employee.mustChangePassword) {
    throw new ApiError(403, "You must change your password before continuing.");
  }

  next();
}
