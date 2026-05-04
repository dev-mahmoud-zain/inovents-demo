import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Role } from '../common/enums';
import { AuthRequest } from '../common/types';

/**
 * Factory function that returns a middleware which restricts access
 * to users whose role matches one of the provided roles.
 *
 * Usage: router.get('/admin', authenticate, authorizeRoles(Role.Admin), handler)
 */
export const authorizeRoles = (...roles: Role[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (!roles.includes(user.role as Role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${roles.join(', ')}].`,
      });
      return;
    }

    next();
  };
};
