import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../common/utils';
import { AuthRequest } from '../common/types';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken<{ _id: string; role: string }>(token);
    (req as AuthRequest).user = decoded as AuthRequest['user'];
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
  }
};
