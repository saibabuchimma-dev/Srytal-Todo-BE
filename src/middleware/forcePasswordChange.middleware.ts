import { NextFunction, Request, Response } from 'express';
import { EmployeeRepository } from '@/modules/employee/employee.repository';
import { ApiError } from '@/utils/ApiError';

const repository = new EmployeeRepository();

export async function forcePasswordChange(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next();
  }

  const employee = await repository.findById(req.user.id);

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  if (employee.mustChangePassword) {
    throw new ApiError(
      403,
      'You must change your password before continuing.'
    );
  }

  next();
}