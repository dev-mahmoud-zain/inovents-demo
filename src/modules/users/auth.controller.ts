import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendError } from '../../common/utils';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 'Registration successful.', 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      sendError(res, msg, 400);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      sendError(res, msg, 401);
    }
  }
}

export const authController = new AuthController();
