import { Request, Response, NextFunction } from 'express';

// Wrapper for async route handlers to pass errors to Express NextFunction
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
