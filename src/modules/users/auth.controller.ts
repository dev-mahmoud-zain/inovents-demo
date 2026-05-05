import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../common/utils';
import { catchAsync } from '../../common/utils/catch-async';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful.', 201);
  });

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful.');
  });
}

export const authController = new AuthController();