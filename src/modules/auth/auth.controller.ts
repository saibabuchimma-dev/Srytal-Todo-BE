import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthService } from './auth.service';

const service = new AuthService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const response = await service.login(req.body);

  res.json({
    success: true,
    message: 'Login Successful',
    data: response,
  });
});